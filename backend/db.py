import aiosqlite
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "wombat.db")

def init_db():
    """Initialize the database with required tables."""
    import sqlite3
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Tasks table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'todo',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Research table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS research (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            summary TEXT,
            topic TEXT,
            url TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    conn.commit()
    conn.close()

async def get_db():
    """Get async database connection."""
    db = await aiosqlite.connect(DB_PATH)
    db.row_factory = aiosqlite.Row
    return db
