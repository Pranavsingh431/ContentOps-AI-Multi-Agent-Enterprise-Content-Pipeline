import os

import requests

OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_MODEL = "openai/gpt-3.5-turbo"
SYSTEM_PROMPT = (
    "You are a professional content writer. Convert raw input into a clear, "
    "well-structured blog post."
)


class LLMServiceError(Exception):
    pass


def generate_content(input_text: str) -> str:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise LLMServiceError("OpenRouter API key is not configured.")

    payload = {
        "model": OPENROUTER_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": input_text},
        ],
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(
            OPENROUTER_ENDPOINT,
            headers=headers,
            json=payload,
            timeout=30,
        )
    except requests.RequestException as exc:
        raise LLMServiceError("Unable to reach content generation service.") from exc

    if response.status_code >= 400:
        raise LLMServiceError("Content generation failed. Please try again.")

    try:
        data = response.json()
    except ValueError as exc:
        raise LLMServiceError("Invalid response from content generation service.") from exc
    choices = data.get("choices", [])
    if not choices:
        raise LLMServiceError("Empty response from content generation service.")

    message = choices[0].get("message", {})
    content = message.get("content")
    if not content or not isinstance(content, str):
        raise LLMServiceError("Invalid response from content generation service.")

    return content.strip()
