"""
LawVault backend server.

Serves three JSON APIs on http://localhost:5000:
  GET  /api/initialize        - readiness check for the chatbot UI
  POST /api/chat              - civil-code Q&A (RAG over civilcode.pdf)
  POST /api/generate-template - rewrite/modify an uploaded legal document

Both features run on a local Ollama model (llama3.2). Make sure Ollama is
installed and the model is pulled before starting:  ollama pull llama3.2
"""

import os
import math
import time
import pickle
import tempfile

from flask import Flask, request, jsonify
from flask_cors import CORS

from langchain_ollama import OllamaLLM, OllamaEmbeddings
from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    Docx2txtLoader,
)
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

# --- Flask app ---
app = Flask(__name__)
CORS(app)

# --- Models (local via Ollama) ---
model = OllamaLLM(model="llama3.2", temperature=0.1)
embeddings = OllamaEmbeddings(model="llama3.2")

# --- Paths ---
pdf_path = "civilcode.pdf"
index_path = "faiss_index.pkl"   # directory created by FAISS.save_local
docs_path = "faiss_docs.pkl"     # pickled list of document chunks

# --- Build or load the FAISS vector store over the civil code ---
if os.path.exists(index_path) and os.path.exists(docs_path):
    print("Loading existing FAISS index...")
    with open(docs_path, "rb") as f:
        docs = pickle.load(f)
    vectorstore = FAISS.load_local(
        index_path, embeddings, allow_dangerous_deserialization=True
    )
    print("Vector store loaded successfully!")
else:
    print("Building new FAISS index (first run can take a few minutes)...")
    start_time = time.time()

    loader = PyPDFLoader(pdf_path)
    documents = loader.load()
    print(f"Loaded {len(documents)} pages from PDF")

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=100)
    splits = text_splitter.split_documents(documents)

    total_chunks = len(splits)
    print(f"Will process {total_chunks} chunks...")

    batch_size = 20
    batches = math.ceil(total_chunks / batch_size)
    all_docs = []
    vectorstore = None

    for i in range(batches):
        batch_start = i * batch_size
        batch_end = min((i + 1) * batch_size, total_chunks)
        current_batch = splits[batch_start:batch_end]
        all_docs.extend(current_batch)

        print(f"Processing batch {i+1}/{batches} (chunks {batch_start+1}-{batch_end})...")

        if vectorstore is None:
            vectorstore = FAISS.from_documents(current_batch, embeddings)
        else:
            batch_vectorstore = FAISS.from_documents(current_batch, embeddings)
            vectorstore.merge_from(batch_vectorstore)

        vectorstore.save_local(index_path)
        with open(docs_path, "wb") as f:
            pickle.dump(all_docs, f)

        elapsed = time.time() - start_time
        print(f"Progress: {batch_end}/{total_chunks} chunks ({batch_end/total_chunks*100:.1f}%)")

    print(f"Index creation completed in {(time.time()-start_time)/60:.1f} minutes")

# --- RAG chain for the chatbot ---
retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

chat_template = """
You are an expert lawyer specialized in civil code interpretation of the Nepali civil code.
Based only on these civil code sections:
{context}

Question: {question}

Answer (cite specific articles) and keep the tone clear and friendly:
"""

prompt = ChatPromptTemplate.from_template(chat_template)


def format_docs(docs):
    return "\n\n".join([d.page_content for d in docs])


rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | model
    | StrOutputParser()
)


def ask_civil_code_question(question: str):
    return rag_chain.invoke(question)


# --- Chatbot routes ---
@app.route('/')
def home():
    return jsonify({"message": "LawVault AI Lawyer is running!"})


@app.route('/api/initialize', methods=['GET'])
def initialize():
    return jsonify({
        "status": "success",
        "message": "Vectorstore and Llama 3.2 model are ready!"
    })


@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_query = data.get("message", "")

        if not user_query.strip():
            return jsonify({"status": "error", "message": "No message provided"}), 400

        answer = ask_civil_code_question(user_query)
        response = {
            "answer": answer,
            "sources": ["Nepali Civil Code PDF via FAISS", "Llama 3.2"]
        }

        return jsonify({"status": "success", "response": response})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500


# --- Document template generator route ---
@app.route('/api/generate-template', methods=['POST'])
def generate_template():
    try:
        file = request.files['file']
        query = request.form['query']

        if not file:
            return jsonify({"status": "error", "message": "No file uploaded."})

        # Save the upload to a temporary file
        with tempfile.NamedTemporaryFile(
            delete=False, suffix=os.path.splitext(file.filename)[-1]
        ) as temp:
            file.save(temp.name)
            file_path = temp.name

        # Pick the loader based on file type
        if file.filename.endswith('.pdf'):
            loader = PyPDFLoader(file_path)
        elif file.filename.endswith('.docx'):
            loader = Docx2txtLoader(file_path)
        elif file.filename.endswith('.txt'):
            loader = TextLoader(file_path)
        else:
            os.remove(file_path)
            return jsonify({"status": "error", "message": "Unsupported file format."})

        docs = loader.load()
        full_text = "\n\n".join([doc.page_content for doc in docs])

        prompt_template = PromptTemplate.from_template(
            "You are a legal document editor. The following is the content of a legal document:\n\n{document}\n\n"
            "Based on this instruction, make appropriate modifications:\n\n{instruction}"
        )

        chain = prompt_template | model | StrOutputParser()
        result = chain.invoke({"document": full_text, "instruction": query})

        os.remove(file_path)

        return jsonify({"status": "success", "result": result})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


if __name__ == '__main__':
    print("Starting LawVault server on http://localhost:5000 ...")
    app.run(debug=True, port=5000)
