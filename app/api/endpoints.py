from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.rag_chain import create_rag_chain
from app.services.document_processing import train_web_model, train_storage_model, retrieve_vectorstores

router = APIRouter()

class QueryRequest(BaseModel):
    input: str

@router.post("/query")
async def query(request: QueryRequest):
    try:
        retrievers = retrieve_vectorstores()
        rag_chain = create_rag_chain(retrievers)
        response = rag_chain.invoke({"question": request.input})
        return {"answer": response["answer"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/train/web")
async def train_web():
    try:
        train_web_model()
        return {"message": "Text model trained successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/train/storage")
async def train_storage():
    try:
        train_storage_model()
        return {"message": "Storage documents model trained successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))