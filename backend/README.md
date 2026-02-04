# Todo Backend API

A multi-user todo application backend built with FastAPI and SQLModel.

## Features

- RESTful API for managing todo tasks
- User isolation (users can only access their own tasks)
- Full CRUD operations for tasks
- Database persistence with PostgreSQL
- Async support for better performance

## Endpoints

- `POST /api/{user_id}/tasks` - Create a new task
- `GET /api/{user_id}/tasks` - Get all tasks for a user
- `GET /api/{user_id}/tasks/{task_id}` - Get a specific task
- `PUT /api/{user_id}/tasks/{task_id}` - Update a task
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete a task

## Setup

1. Install dependencies:
   ```bash
   pip install -e .
   ```

2. Set up environment variables in `.env`:
   ```bash
   DATABASE_URL=postgresql+asyncpg://username:password@localhost:5432/todo_db
   ```

3. Run the application:
   ```bash
   uvicorn main:app --reload
   ```

## Technologies

- FastAPI
- SQLModel
- PostgreSQL (with asyncpg)
- Uvicorn (ASGI server)