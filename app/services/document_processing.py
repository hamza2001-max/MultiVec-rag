from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import DirectoryLoader, TextLoader, CSVLoader, PyPDFLoader, Docx2txtLoader
from app.core.config import settings
from langchain.retrievers import MergerRetriever
import os
from langchain_community.document_transformers import EmbeddingsRedundantFilter
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import DocumentCompressorPipeline
from langchain_community.document_transformers import LongContextReorder

def load_web_documents():
    loader = DirectoryLoader(os.path.join(settings.DATA_DIR, "web_files"), glob="**/*.txt", loader_cls=TextLoader)
    text_documents = loader.load()
    return text_documents

def load_storage_documents():
    loaders = {
        '.pdf': PyPDFLoader,
        '.docx': Docx2txtLoader,
        '.csv': CSVLoader,
    }

    def create_directory_loader(file_type, directory_path):
        return DirectoryLoader(
            path=directory_path,
            glob=f"**/*{file_type}",
            loader_cls=loaders[file_type],
        )

    pdf_loader = create_directory_loader('.pdf', 'app/data/storage')
    docx_loader = create_directory_loader('.docx', 'app/data/storage')
    csv_loader = create_directory_loader('.csv', 'app/data/storage')

    pdf_documents = pdf_loader.load()
    docx_documents = docx_loader.load()
    csv_documents = csv_loader.load()

    storage_documents = pdf_documents + docx_documents + csv_documents
    return storage_documents


def retrieve_vectorstores():
    embedding = OpenAIEmbeddings()
    storage_vectorstore = Chroma(
        persist_directory=os.path.join(settings.DATA_DIR, "web_chroma_db"),
        embedding_function=embedding
    )
    web_vectorstore = Chroma(
        persist_directory=os.path.join(settings.DATA_DIR, "storage_chroma_db"),
        embedding_function=embedding
    )
    storage_retriever = storage_vectorstore.as_retriever(search_kwargs={"k": 3})
    web_retriever = web_vectorstore.as_retriever()

    lotr = MergerRetriever(retrievers=[web_retriever, storage_retriever])

    filter_embeddings = OpenAIEmbeddings()
    filter = EmbeddingsRedundantFilter(embeddings=filter_embeddings)
    reordering = LongContextReorder()  
    pipeline = DocumentCompressorPipeline(transformers=[filter, reordering])
    retrievers = ContextualCompressionRetriever(
        base_compressor=pipeline, base_retriever=lotr,search_kwargs={"k": 2, "include_metadata": True}
    )
    return retrievers

def train_web_model():
    text_documents = load_web_documents()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = text_splitter.split_documents(text_documents)
    embedding = OpenAIEmbeddings()  
    Chroma.from_documents(
        documents=splits,
        embedding=embedding,
        persist_directory=os.path.join(settings.DATA_DIR, "web_chroma_db")
    )

def train_storage_model():
    storage_documents = load_web_documents()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = text_splitter.split_documents(storage_documents)
    embedding = OpenAIEmbeddings()
    Chroma.from_documents(
        documents=splits,
        embedding=embedding,
        persist_directory=os.path.join(settings.DATA_DIR, "storage_chroma_db")
    )
