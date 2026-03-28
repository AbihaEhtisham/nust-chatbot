from langchain_community.vectorstores import Chroma
from langchain_core.runnables import RunnablePassthrough
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_ollama import OllamaEmbeddings, OllamaLLM

PROMPT_TEMPLATE = """You are a helpful NUST (National University of Sciences and Technology) admissions assistant.
Answer ONLY based on the context provided below.
If the answer is not in the context, say: "I don't have that information. Please visit nust.edu.pk for more details."
Keep answers clear and concise.

Context:
{context}

Student's Question: {question}

Answer:"""

prompt = PromptTemplate(
    input_variables=["context", "question"],
    template=PROMPT_TEMPLATE
)

print("Loading vector store...")
embeddings = OllamaEmbeddings(model="nomic-embed-text")
db = Chroma(
    persist_directory="./chroma_db",
    embedding_function=embeddings
)
retriever = db.as_retriever(search_kwargs={"k": 3})

print("Loading Llama model...")
llm = OllamaLLM(model="llama3.2", temperature=0.1)

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

# Modern LCEL chain — replaces RetrievalQA
chain = (
    {
        "context": retriever | format_docs,
        "question": RunnablePassthrough()
    }
    | prompt
    | llm
    | StrOutputParser()
)

def ask_question(question: str) -> str:
    try:
        return chain.invoke(question)
    except Exception as e:
        return f"Error generating response: {str(e)}"