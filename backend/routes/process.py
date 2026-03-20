from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.llm import LLMServiceError, generate_content

router = APIRouter()


class ProcessRequest(BaseModel):
    text: str


@router.post("/process")
def process_text(payload: ProcessRequest) -> dict[str, str]:
    try:
        generated_content = generate_content(payload.text)
    except LLMServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return {"status": "success", "generated_content": generated_content}
