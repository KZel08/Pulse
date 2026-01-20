from fastapi import FastAPI

app = FastAPI(title="Pulse AI Service")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/summarize")
def summarize(payload: dict):
    text = payload.get("text", "")
    return {
        "summary": text[:200]
    }