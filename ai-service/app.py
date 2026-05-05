from __future__ import annotations

import html
import re
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
REQUEST_TIMEOUT = 12
USER_AGENT = "Mozilla/5.0"

EMPTY_JOB_COLUMNS = [
    "title", "company", "description", "url",
    "source", "remote", "tech_stack"
]

# ================= FASTAPI INIT =================
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

def _as_text(v):
    return "" if v is None else str(v)

def _normalize(text):
    return re.sub(r"\s+", " ", text).strip()

def _clean(text):
    text = html.unescape(_as_text(text)).lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return _normalize(text)

# ================= RESUME =================
def parse_resume(file_bytes):
    try:
        with open("temp.pdf", "wb") as f:
            f.write(file_bytes)

        text = extract_text("temp.pdf") or ""
        return _normalize(text)
    except:
        return ""

# ================= JOB FETCH =================
def _fetch_remoteok_jobs():
    try:
        data = requests.get("https://remoteok.com/api", headers={"User-Agent": USER_AGENT}).json()
    except:
        return _empty_job_frame()

    rows = []
    for j in data:
        if not isinstance(j, dict):
            continue

        title = j.get("position") or j.get("title")
        if not title:
            continue

        rows.append({
            "title": title,
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
        data = requests.get("https://remotive.com/api/remote-jobs").json()
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

def _fetch_arbeitnow_jobs():
    try:
        data = requests.get("https://www.arbeitnow.com/api/job-board-api").json()
    except:
        return _empty_job_frame()

    rows = []
    for j in data.get("data", []):
        rows.append({
            "title": j.get("title"),
            "company": j.get("company_name"),
            "description": j.get("description"),
            "url": j.get("url"),
            "source": "Arbeitnow",
            "remote": True,
            "tech_stack": ", ".join(j.get("tags", []))
        })

    return pd.DataFrame(rows)

# 🔥 LOCAL JOBS
def _fetch_local_jobs_from_node():
    try:
        res = requests.get("http://localhost:5000/api/jobs")
        jobs = res.json()

        rows = []
        for j in jobs:
            rows.append({
                "title": j.get("title"),
                "company": j.get("company"),
                "description": j.get("description"),
                "url": "",
                "source": "Local",
                "remote": True,
                "tech_stack": ""
            })

        return pd.DataFrame(rows)

    except:
        return _empty_job_frame()

# ================= JOB DATA =================
@lru_cache(maxsize=1)
def get_job_data():
    frames = []

    for loader in [
        _fetch_remoteok_jobs,
        _fetch_remotive_jobs,
        _fetch_arbeitnow_jobs,
        _fetch_local_jobs_from_node
    ]:
        try:
            df = loader()
            if df is not None and not df.empty:
                frames.append(df)
        except:
            continue

    if not frames:
        return _empty_job_frame()

    return pd.concat(frames, ignore_index=True).fillna("")

# ================= AI MATCH =================
def rank_jobs(resume_text, jobs_df):
    if jobs_df.empty:
        return jobs_df

    resume = _clean(resume_text)
    docs = [resume] + jobs_df["description"].tolist()

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

        # 🔥 TRY 1 → FILE
        if resume:
            try:
                file_bytes = await resume.read()
                print("Using uploaded file")
            except:
                pass

        # 🔥 TRY 2 → URL
        if not file_bytes:
            try:
                body = await request.json()
                resume_url = body.get("resumeUrl")

                if resume_url:
                    print("Using resume URL")
                    response = requests.get(resume_url)

                    if response.status_code == 200:
                        file_bytes = response.content
            except:
                pass

        # ❌ FAIL SAFE
        if not file_bytes:
            return {"error": "No resume provided"}

        # 🔥 AI PIPELINE
        resume_text = parse_resume(file_bytes)
        jobs = get_job_data()
        result = rank_jobs(resume_text, jobs)

        return result.head(10).to_dict(orient="records")

    except Exception as e:
        return {"error": str(e)}

# ================= RUN =================
if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=5001, reload=True)