from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import calendar_routes, tasks, research, scripture, nascar
from db import init_db

app = FastAPI(title="Wombat Mission Control API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    init_db()

app.include_router(calendar_routes.router, prefix="/api/calendar")
app.include_router(tasks.router, prefix="/api/tasks")
app.include_router(research.router, prefix="/api/research")
app.include_router(scripture.router, prefix="/api/scripture")
app.include_router(nascar.router, prefix="/api/nascar")

@app.get("/")
async def root():
    return {"message": "Wombat Mission Control API"}
