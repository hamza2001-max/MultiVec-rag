from langchain_openai import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferWindowMemory
from langchain_core.prompts import ChatPromptTemplate
from langchain.retrievers import MultiQueryRetriever
from app.core.config import settings

llm = ChatOpenAI(model_name=settings.MODEL_NAME, temperature=settings.TEMPERATURE, openai_api_key=settings.OPENAI_API_KEY)

def create_rag_chain(retrievers):
    system_prompt = """
    You are a friendly and knowledgeable chatbot assistant. Engage in a natural conversation with the user,
    maintaining context throughout the interaction. Use the following guidelines:
    1. Utilize the provided context to answer questions accurately.
    2. If you're unsure or don't have enough information to answer, be honest and say so.
    3. Keep your responses conversational and human-like, but concise.
    4. Feel free to ask clarifying questions if needed.
    5. Use appropriate tone and empathy in your responses.
    6. Format your response using HTML tags for better readability. Use <p> for paragraphs, <ul> or <ol> for lists, <strong> for emphasis, etc.
    7. If the user's English is poor, try to understand their intent and respond accordingly.
    8. Provide sources for your information when possible.

    Context: {context}
    Current conversation:
    {chat_history}
    Human: {question}
    AI Assistant: Let's think about this step by step:
    """
    prompt = ChatPromptTemplate.from_template(system_prompt)

    memory = ConversationBufferWindowMemory(
        memory_key="chat_history",
        return_messages=True,
        output_key="answer",
        k=5
    )
    conversation_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever = retrievers,
        combine_docs_chain_kwargs={"prompt": prompt},
        return_source_documents=True,
        memory = memory
    )
    
    return conversation_chain