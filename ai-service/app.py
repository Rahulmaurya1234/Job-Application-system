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
        data = requests.get("https://remoteok.com/api", timeout=REQUEST_TIMEOUT).json()
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
        data = requests.get("https://remotive.com/api/remote-jobs", timeout=REQUEST_TIMEOUT).json()
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

        # ===== FILE UPLOAD =====
        if resume:
            try:
                file_bytes = await resume.read()
                print("Uploaded file size:", len(file_bytes))
            except Exception as e:
                print("File read error:", e)

        # ===== JSON URL =====
        if not file_bytes:
            try:
                data = await request.json()
            except:
                data = {}

            resume_url = data.get("resumeUrl")

            if resume_url:
                print("Fetching:", resume_url)

                try:
                    response = requests.get(
                        resume_url,
                        timeout=20,   #  reduce timeout
                        headers={
                            "User-Agent": "Mozilla/5.0"
                        }
                    )

                    if response.status_code != 200:
                        return {"error": "Failed to fetch resume"}

                    if not response.content:
                        return {"error": "Empty resume file"}

                    file_bytes = response.content
                    print("Downloaded size:", len(file_bytes))

                except requests.exceptions.Timeout:
                    return {"error": "Resume fetch timeout ❌"}

                except Exception as e:
                    print("Download error:", e)
                    return {"error": "Resume download failed ❌"}

        # ===== VALIDATION =====
        if not file_bytes:
            return {"error": "No resume provided"}

        # ===== PARSE =====
        try:
            resume_text = parse_resume(file_bytes)
        except Exception as e:
            print("Parsing crash:", e)
            return {"error": "Resume parsing failed ❌"}

        if not resume_text:
            return {"error": "Empty resume content ❌"}

        # ===== JOB FETCH =====
        try:
            jobs = get_job_data()
        except Exception as e:
            print("Job fetch error:", e)
            jobs = _empty_job_frame()

        if jobs.empty:
            return {"error": "No jobs available"}

        # ===== RANK =====
        try:
            result = rank_jobs(resume_text, jobs)
        except Exception as e:
            print("Ranking error:", e)
            return {"error": "AI processing failed ❌"}

        # LIMIT RESULT (important for speed)
        return result.head(5).to_dict(orient="records")

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": "Internal server error ❌"}

# ================= RUN =================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run("app:app", host="0.0.0.0", port=port)