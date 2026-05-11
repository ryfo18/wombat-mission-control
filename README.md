# Wombat Mission Control

A full-stack personal dashboard for coordinating life and projects with a dark "mission control" aesthetic.

## Features

- **Calendar**: View upcoming events and get carpool recommendations
- **Kanban Board**: Manage tasks with drag-and-drop status updates (To Do, In Progress, Done)
- **Research**: Save and organize research notes with filtering by topic
- **Scripture**: Daily verse with reflection prompts
- **Dark Theme**: Professional navy/slate color palette optimized for reduced eye strain

## Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS for styling
- Axios for HTTP requests
- React Router for navigation
- Lucide React for icons

### Backend
- FastAPI (Python)
- SQLite with aiosqlite for async database operations
- HTTPX for external API calls (Bible API)
- CORS middleware for frontend communication

## Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- pip (Python package manager)

### Installation

1. **Clone the repository** (if applicable)
   ```bash
   git clone <repository-url>
   cd wombat-mission-control
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   pip install -r requirements.txt
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   uvicorn main:app --reload
   ```
   The API will be available at http://localhost:8000

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The application will be available at http://localhost:5173

### Environment Assumptions
- Backend runs on http://localhost:8000
- Frontend runs on http://localhost:5173
- CORS is configured to allow requests from localhost:5173
- SQLite database file (wombat.db) will be created automatically in the backend directory

## API Endpoints

### Tasks
- GET `/api/tasks` - List all tasks
- POST `/api/tasks` - Create a new task
- PUT `/api/tasks/{id}` - Update a task
- DELETE `/api/tasks/{id}` - Delete a task

### Research
- GET `/api/research` - List all research (optional ?topic= filter)
- POST `/api/research` - Create research item
- DELETE `/api/research/{id}` - Delete research item

### Scripture
- GET `/api/scripture/daily` - Get daily verse with reflection prompt

### Calendar
- GET `/api/calendar/events` - Get mock events for next 7 days
- GET `/api/calendar/carpool` - Get carpool recommendation

## Project Structure
```
wombat-mission-control/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components (Sidebar)
│   │   ├── pages/          # Page components (Calendar, Kanban, etc.)
│   │   ├── api.js          # Axios HTTP client
│   │   ├── App.jsx         # Main app with routing
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Tailwind imports
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/
│   ├── main.py             # FastAPI app
│   ├── db.py               # Database initialization
│   ├── requirements.txt    # Python dependencies
│   └── routes/
│       ├── calendar_routes.py
│       ├── tasks.py
│       ├── research.py
│       └── scripture.py
├── README.md
└── .gitignore
```

## Customization

### Changing API URL
If you need to change the backend URL, edit `frontend/src/api.js` and modify the `baseURL` in the axios instance.

### Adding More Versions
To add more Bible verses, edit `backend/routes/scripture.py` and add entries to the `VERSES` array with corresponding reflection prompts.

## License
MIT