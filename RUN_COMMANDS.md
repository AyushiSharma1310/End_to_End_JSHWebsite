# End-to-End Run Commands

Use separate PowerShell terminals for each running service.

## 1. Start PostgreSQL

Make sure PostgreSQL is running locally before starting the backend services.

Expected database details from the project:

```text
Database: hackathon2026_27
User: postgres
Password: JSHS2026
Host: localhost
Port: 5432
```

If the database does not exist locally, run:

```powershell
psql -U postgres -f C:\Projects\End_to_End_JSHWebsite\LOCAL_DATABASE_SETUP.sql
```

You can also let Django create/update its tables after the database exists by running `python manage.py migrate` in the backend step below.

## 2. Django Backend API

Runs the main portal API on `http://localhost:8000`.

```powershell
cd C:\Projects\End_to_End_JSHWebsite\backend
.\venv\Scripts\activate
python manage.py migrate
python manage.py runserver 8000
```

## 3. React Website Portal

Runs the website/frontend portal on `http://localhost:5173`.

```powershell
cd C:\Projects\End_to_End_JSHWebsite\client
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## 4. Python Dashboard and Chatbot API

Runs the Plotly Dash dashboard and chatbot endpoint on `http://localhost:8050`.

```powershell
cd C:\Projects\End_to_End_JSHWebsite\dashboard
.\.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Open dashboard:

```text
http://localhost:8050
```

Chatbot endpoint used by the React app:

```text
http://localhost:8050/chat
```

## 5. Node Server

Runs the older/admin Node API on `http://localhost:5000`.

```powershell
cd C:\Projects\End_to_End_JSHWebsite\server
npm install
npm start
```

Open/check:

```text
http://localhost:5000
```

## Recommended Startup Order

```text
1. PostgreSQL
2. Django backend API - port 8000
3. Python dashboard/chatbot - port 8050
4. React website portal - port 5173
5. Node server - port 5000, if needed
```

## Quick Check

After all required services are running:

```text
Website Portal: http://localhost:5173
Django API:      http://localhost:8000
Dashboard:       http://localhost:8050
Node Server:     http://localhost:5000
```
