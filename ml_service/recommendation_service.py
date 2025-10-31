import psycopg2
import pickle
import numpy as np
import io
from fastapi import FastAPI, UploadFile, Form, HTTPException
from pydantic import BaseModel
from psycopg2.extras import RealDictCursor
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch

app = FastAPI()

# ==========================
# 🧩 DATABASE CONNECTION
# ==========================
def get_conn():
    return psycopg2.connect(
        dbname="postgres",
        user="postgres.zavcdgxjqbkpsafishmg",
        password="gLdv4DObzlTii1RV",
        host="aws-0-ap-southeast-1.pooler.supabase.com",
        port="6543"
    )

# ==========================
# 🧠 LOAD CLIP MODEL
# ==========================
clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

def get_embedding(image_bytes: bytes) -> np.ndarray:
    """Extract normalized CLIP image embedding"""
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    inputs = clip_processor(images=image, return_tensors="pt")
    with torch.no_grad():
        embedding = clip_model.get_image_features(**inputs)
    embedding = embedding / embedding.norm(p=2, dim=-1, keepdim=True)
    return embedding.squeeze().cpu().numpy()

# ==========================
# ✅ TEST ROUTE
# ==========================
@app.get("/")
async def root():
    return {"status": "ok"}

# ==========================
# 🟢 ADD PRODUCT EMBEDDING
# ==========================
@app.post("/add_product/")
async def add_product(
    product_id: str = Form(...),
    name: str = Form(...),
    image: UploadFile = None
):
    image_bytes = await image.read() if image else None
    embedding = get_embedding(image_bytes)

    try:
        with get_conn() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO product_embeddings (product_id, name, embedding)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (product_id) DO UPDATE
                    SET name = EXCLUDED.name,
                        embedding = EXCLUDED.embedding
                """, (product_id, name, psycopg2.Binary(pickle.dumps(embedding))))
        return {"message": "Product added successfully", "product_id": product_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# ==========================
# 🟢 REQUEST BODY (Product Recommendation)
# ==========================
class RecommendRequest(BaseModel):
    product_id: str
    top_k: int = 5

# ==========================
# 🧩 GET SIMILAR PRODUCTS (BY PRODUCT)
# ==========================
@app.post("/recommend/")
async def recommend_items(req: RecommendRequest):
    try:
        with get_conn() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    "SELECT embedding FROM product_embeddings WHERE product_id = %s", 
                    (req.product_id,)
                )
                row = cursor.fetchone()
                if not row:
                    return {"error": "Product not found"}

                target_embedding = pickle.loads(row[0])

                cursor.execute(
                    "SELECT product_id, name, embedding FROM product_embeddings WHERE product_id != %s", 
                    (req.product_id,)
                )
                rows = cursor.fetchall()

        similarities = []
        for pid, name, emb_blob in rows:
            emb = pickle.loads(emb_blob)
            sim = np.dot(target_embedding, emb) / (np.linalg.norm(target_embedding) * np.linalg.norm(emb))
            similarities.append((pid, name, float(sim)))

        similarities.sort(key=lambda x: x[2], reverse=True)

        threshold = 0.6  # ignore weak matches
        recommendations = [
            {"product_id": pid, "name": name, "similarity": sim}
            for pid, name, sim in similarities[:req.top_k]
            if sim >= threshold
        ]

        if not recommendations:
            return {"error": "No similar products found"}

        return {"recommendations": recommendations}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# ==========================
# 📸 CAMERA SEARCH ENDPOINT
# ==========================
@app.post("/camera_recommend/")
async def camera_recommend(image: UploadFile, top_k: int = Form(5)):
    try:
        image_bytes = await image.read()
        query_embedding = get_embedding(image_bytes)

        with get_conn() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT product_id, name, embedding FROM product_embeddings")
                rows = cursor.fetchall()

        if not rows:
            return {"error": "No products found in database"}

        similarities = []
        for pid, name, emb_blob in rows:
            emb = pickle.loads(emb_blob)
            sim = np.dot(query_embedding, emb) / (np.linalg.norm(query_embedding) * np.linalg.norm(emb))
            similarities.append((pid, name, float(sim)))

        similarities.sort(key=lambda x: x[2], reverse=True)

        threshold = 0.6  # Only accept strong visual matches
        recommendations = [
            {"product_id": pid, "name": name, "similarity": sim}
            for pid, name, sim in similarities[:top_k]
            if sim >= threshold
        ]

        if not recommendations:
            return {"error": "No similar products found"}

        return {"recommendations": recommendations}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
