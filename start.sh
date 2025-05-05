#!/bin/bash

# Install Python dependencies
pip3 install -r backend/requirements.txt

# Start backend (FastAPI)
echo "Starting backend..."
uvicorn backend.main:app --reload &

# Install frontend dependencies
cd frontend
npm install

# Start frontend (Angular)
echo "Starting frontend..."
ng serve
