from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class MessageRequest(BaseModel):
    messages: list[str]


@app.post("/summarize")
def summarize(req: MessageRequest):

    text = " ".join(req.messages)

    summary = text[:200] + "..."

    return {"summary": summary}


@app.post("/smart-reply")
def smart_reply(req: MessageRequest):

    return {
        "replies": [
            "Sounds good!",
            "I'll check and get back to you.",
            "Let's discuss this later."
        ]
    }