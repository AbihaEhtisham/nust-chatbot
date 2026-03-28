from langchain_community.document_loaders import TextLoader
from langchain_text_splitter import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings

print("Loading FAQ document...")
loader = TextLoader("data/nust_faqs.txt", encoding="utf-8")
documents = loader.load()

print("Splitting into chunks...")
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=80,
    separators=["\n\n", "\n", "?", "."]
)
chunks = splitter.split_documents(documents)
print(f"Created {len(chunks)} chunks")

print("Generating embeddings with nomic-embed-text...")
embeddings = OllamaEmbeddings(model="nomic-embed-text")

print("Storing in ChromaDB...")
db = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db"
)

print(f"Done! Vector store saved with {len(chunks)} chunks.")