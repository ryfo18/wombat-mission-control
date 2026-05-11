from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db import get_db
from typing import Optional

router = APIRouter()

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

@router.get("")
async def get_tasks():
    """Get all tasks."""
    db = await get_db()
    cursor = await db.execute("SELECT * FROM tasks ORDER BY created_at DESC")
    rows = await cursor.fetchall()
    await db.close()
    return [
        {
            "id": row["id"],
            "title": row["title"],
            "description": row["description"],
            "status": row["status"],
            "created_at": row["created_at"]
        }
        for row in rows
    ]

@router.post("")
async def create_task(task: TaskCreate):
    """Create a new task."""
    db = await get_db()
    cursor = await db.execute(
        "INSERT INTO tasks (title, description, status) VALUES (?, ?, 'todo')",
        (task.title, task.description)
    )
    await db.commit()
    task_id = cursor.lastrowid
    await db.close()
    
    return {
        "id": task_id,
        "title": task.title,
        "description": task.description,
        "status": "todo"
    }

@router.put("/{task_id}")
async def update_task(task_id: int, task: TaskUpdate):
    """Update a task."""
    db = await get_db()
    
    # Build dynamic update query
    updates = []
    values = []
    if task.title is not None:
        updates.append("title = ?")
        values.append(task.title)
    if task.description is not None:
        updates.append("description = ?")
        values.append(task.description)
    if task.status is not None:
        updates.append("status = ?")
        values.append(task.status)
    
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    values.append(task_id)
    query = f"UPDATE tasks SET {', '.join(updates)} WHERE id = ?"
    
    await db.execute(query, values)
    await db.commit()
    
    # Fetch updated task
    cursor = await db.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    row = await cursor.fetchone()
    await db.close()
    
    if not row:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return {
        "id": row["id"],
        "title": row["title"],
        "description": row["description"],
        "status": row["status"],
        "created_at": row["created_at"]
    }

@router.delete("/{task_id}")
async def delete_task(task_id: int):
    """Delete a task."""
    db = await get_db()
    await db.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    await db.commit()
    await db.close()
    return {"message": "Task deleted"}
