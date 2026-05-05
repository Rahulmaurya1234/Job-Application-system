from __future__ import annotations

import html
import re
import os
import tempfile
import json
from functools import lru_cache

import pandas as pd
import requests
from pdfminer.high_level import extract_text
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from fastapi import FastAPI, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# ================= CONFIG =================
REQUEST_TIMEOUT = 30
USER_AGENT = "Mozilla/5.0"

BACKEND_URL = os.getenv(
    "BACKEND_URL",
    "https://job-application-system-a1x3.onrender.com"
)

EMPTY_JOB_COLUMNS = [
    "title", "company", "description", "url",
    "source", "remote", "tech_stack"
]

# ================= FASTAPI =================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= UTILS =================
def _empty_job_frame():
    return pd.DataFrame(columns=EMPTY_JOB_COLUMNS)

def _normalize(text):
    return re.sub(r"\s+", " ", text).strip()

def _clean(text):
    text = html.unescape(str(text)).lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return _normalize(text)

# ================= RESUME =================
def parse_resume(file_bytes):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(file_bytes)
            temp_path = tmp.name

        text = extract_text(temp_path) or ""
        return _normalize(text)

    except Exception as e:
        print("Resume parse error:", e)
        return ""

# ================= JOB FETCH =================
def _fetch_remoteok_jobs():
    try:
        data = requests.get(
            "https://remoteok.com/api",
            headers={"User-Agent": USER_AGENT},
            timeout=REQUEST_TIMEOUT
        ).json()
    except:
        return _empty_job_frame()

    rows = []
    for j in data:
        if isinstance(j, dict) and j.get("position"):
            rows.append({
                "title": j.get("position"),
                "company": j.get("company"),
                "description": j.get("description"),
                "url": j.get("url"),
                "source": "RemoteOK",
                "remote": True,
                "tech_stack": ", ".join(j.get("tags", []))
            })

    return pd.DataFrame(rows)

def _fetch_remotive_jobs():
    try:
        data = requests.get(
            "https://remotive.com/api/remote-jobs",
            timeout=REQUEST_TIMEOUT
        ).json()
    except:
        return _empty_job_frame()

    rows = []
    for j in data.get("jobs", []):
        rows.append({
            "title": j.get("title"),
            "company": j.get("company_name"),
            "description": j.get("description"),
            "url": j.get("url"),
            "source": "Remotive",
            "remote": True,
            "tech_stack": ", ".join(j.get("tags", []))
        })

    return pd.DataFrame(rows)

def _fetch_local_jobs():
    try:
        res = requests.get(f"{BACKEND_URL}/api/jobs", timeout=REQUEST_TIMEOUT)
        jobs = res.json()

        return pd.DataFrame([
            {
                "title": j.get("title"),
                "company": j.get("company"),
                "description": j.get("description"),
                "url": "",
                "source": "Local",
                "remote": True,
                "tech_stack": ""
            } for j in jobs
        ])
    except:
        return _empty_job_frame()

@lru_cache(maxsize=1)
def get_job_data():
    frames = [
        _fetch_remoteok_jobs(),
        _fetch_remotive_jobs(),
        _fetch_local_jobs()
    ]
    return pd.concat(frames, ignore_index=True).fillna("")

# ================= AI =================
def rank_jobs(resume_text, jobs_df):
    if jobs_df.empty:
        return jobs_df

    docs = [resume_text] + jobs_df["description"].tolist()

    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf = vectorizer.fit_transform(docs)

    scores = cosine_similarity(tfidf[0:1], tfidf[1:]).flatten()
    jobs_df["similarity"] = scores

    return jobs_df.sort_values(by="similarity", ascending=False)

# ================= API =================
@app.post("/analyze")
async def analyze(request: Request, resume: UploadFile = File(None)):
    try:
        file_bytes = None

        # ===== FILE =====
        if resume:
            file_bytes = await resume.read()

        # ===== JSON URL =====
        if not file_bytes:
            raw_body = await request.body()
            print("Raw body:", raw_body)

            try:
                data = json.loads(raw_body.decode())
            except:
                data = {}

            print("Parsed JSON:", data)

            resume_url = data.get("resumeUrl")

            if resume_url:
                print("Fetching:", resume_url)

                response = requests.get(
                    resume_url,
                    timeout=REQUEST_TIMEOUT,
                    headers={"User-Agent": USER_AGENT},
                    stream=True
                )

                content = b""
                for chunk in response.iter_content(8192):
                    if chunk:
                        content += chunk

                print("Status:", response.status_code)
                print("Downloaded size:", len(content))

                if response.status_code == 200 and content:
                    file_bytes = content

        # ===== VALIDATION =====
        if not file_bytes:
            return {"error": "No resume provided"}

        # ===== PROCESS =====
        resume_text = parse_resume(file_bytes)

        if not resume_text:
            return {"error": "Resume parsing failed"}

        jobs = get_job_data()
        result = rank_jobs(resume_text, jobs)

        return result.head(10).to_dict(orient="records")

    except Exception as e:
        print("ERROR:", e)
        return {"error": str(e)}

# ================= RUN =================
if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=10000)