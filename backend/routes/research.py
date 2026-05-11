from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from db import get_db
from typing import Optional, List

router = APIRouter()

class ResearchCreate(BaseModel):
    title: str
    summary: str
    topic: str
    url: Optional[str] = None

@router.get("")
async def get_research(topic: Optional[str] = Query(None)):
    """Get all research items, optionally filtered by topic."""
    db = await get_db()
    if topic:
        cursor = await db.execute(
            "SELECT * FROM research WHERE topic = ? ORDER BY created_at DESC", 
            (topic,)
        )
    else:
        cursor = await db.execute("SELECT * FROM research ORDER BY created_at DESC")
    rows = await cursor.fetchall()
    await db.close()
    return [
        {
            "id": row["id"],
            "title": row["title"],
            "summary": row["summary"],
            "topic": row["topic"],
            "url": row["url"],
            "created_at": row["created_at"]
        }
        for row in rows
    ]

@router.post("")
async def create_research(research: ResearchCreate):
    """Create a new research item."""
    db = await get_db()
    cursor = await db.execute(
        "INSERT INTO research (title, summary, topic, url) VALUES (?, ?, ?, ?)",
        (research.title, research.summary, research.topic, research.url)
    )
    await db.commit()
    research_id = cursor.lastrowid
    await db.close()
    
    return {
        "id": research_id,
        "title": research.title,
        "summary": research.summary,
        "topic": research.topic,
        "url": research.url
    }

@router.delete("/{research_id}")
async def delete_research(research_id: int):
    """Delete a research item."""
    db = await get_db()
    await db.execute("DELETE FROM research WHERE id = ?", (research_id,))
    await db.commit()
    await db.close()
    return {"message": "Research deleted"}
