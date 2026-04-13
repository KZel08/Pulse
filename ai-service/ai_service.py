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


@app.post("/validate-safety")
def validate_safety(req: MessageRequest):
    """
    Validate message content for safety and appropriateness.
    Returns validation result with safety score and any warnings.
    """
    messages = req.messages

    # Simple safety check - in real implementation, use ML models
    unsafe_keywords = ["harm", "violence", "threat", "abuse", "spam"]

    total_score = 0
    warnings = []

    for message in messages:
        score = 1.0  # Default safe
        message_warnings = []

        lower_msg = message.lower()
        for keyword in unsafe_keywords:
            if keyword in lower_msg:
                score -= 0.2
                message_warnings.append(f"Contains potentially unsafe keyword: {keyword}")

        if len(message.split()) > 100:
            score -= 0.1
            message_warnings.append("Message is very long")

        if score < 0.8:
            warnings.extend(message_warnings)

        total_score = min(total_score + score, 1.0)

    is_safe = total_score >= 0.7

    return {
        "isSafe": is_safe,
        "safetyScore": total_score,
        "warnings": warnings,
        "validated": True
    }


@app.post("/ghost-mode-process")
def ghost_mode_process(req: MessageRequest):
    """
    Process message for ghost mode - anonymize content if needed.
    """
    # In ghost mode, messages are already anonymized client-side
    # This endpoint could be used for additional processing
    return {
        "processed": True,
        "anonymized": True
    }