# 🚀 Complete Deployment Guide with PostgreSQL

This guide will help you deploy your Lab Exam Scheduler with PostgreSQL database support for production.

## 📋 Prerequisites

- GitHub account
- Render.com account (free) OR Railway.app account (free)
- Your code pushed to GitHub

---

## 🎯 Option 1: Deploy to Render.com (Recommended)

### Step 1: Prepare Your GitHub Repository

```bash
# Initialize git if not done
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment with PostgreSQL"

# Connect to GitHub
git remote add origin https://github.com/YOUR_USERNAME/lab-scheduler.git
git push -u origin main
```

### Step 2: Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"PostgreSQL"**
3. Fill in:
   - **Name**: `lab-scheduler-db`
   - **Database**: `lab_scheduler`
   - **User**: `lab_scheduler_user`
   - **Region**: Oregon (Free)
   - **Plan**: Free
4. Click **"Create Database"**
5. Wait 2-3 minutes for database to be ready
6. Copy the **Internal Database URL** (starts with `postgresql://`)

### Step 3: Deploy Backend

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Fill in:
   - **Name**: `lab-scheduler-backend`
   - **Region**: Oregon (Free)
   - **Branch**: main
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements_production.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add Environment Variables:
   - Key: `DATABASE_URL`
   - Value: (Paste the Internal Database URL from Step 2)
5. Click **"Create Web Service"**
6. Wait 5-10 minutes for deployment

### Step 4: Initialize Database Tables

After deployment completes:

```bash
# Use Render Shell to initialize tables
# Go to your web service → Shell tab
python -c "from database_postgres import init_database; init_database()"
```

Or create an initialization endpoint (see below).

### Step 5: Deploy Frontend to Vercel/Netlify

**Update API URL in frontend:**

Edit `frontend/src/api.js`:
```javascript
const API_BASE_URL = 'https://your-backend.onrender.com/api';
```

**Deploy to Vercel:**
1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Set Root Directory to `frontend`
4. Deploy!

---

## 🎯 Option 2: Deploy to Railway.app (Alternative)

### Step 1: Deploy Backend + Database

1. Go to [Railway](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Railway will auto-detect Python
5. Click **"Add PostgreSQL"**
6. Railway automatically sets `DATABASE_URL`
7. Set environment variables:
   - `PYTHON_VERSION`: 3.11
8. Deploy!

### Step 2: Deploy Frontend

Same as Render instructions above.

---

## 🔧 Code Changes Needed

### 1. Update Backend to Use SQLAlchemy

**Replace the import in `main.py`:**

```python
# OLD (line 14-15):
from database import init_database, get_db_connection

# NEW:
from database_postgres import init_database, get_db, Student, Exam, Schedule, ScheduleStudent, SessionLocal
```

**Add database initialization on startup:**

Add this to your `main.py` after creating the FastAPI app:

```python
@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_database()
    print("✅ Database initialized")
```

### 2. Update Database Queries

Since we're moving from raw SQLite to SQLAlchemy, we need to update queries.

**Example - Getting students (around line 50-60 in main.py):**

OLD:
```python
with get_db_connection() as conn:
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM students ORDER BY reg_no")
    students = cursor.fetchall()
```

NEW:
```python
db = SessionLocal()
try:
    students = db.query(Student).order_by(Student.reg_no).all()
    return [{"reg_no": s.reg_no, "name": s.name, "branch": s.branch, "semester": s.semester} for s in students]
finally:
    db.close()
```

### 3. Install Production Dependencies Locally

```bash
cd backend
pip install -r requirements_production.txt
```

---

## 🔄 Migration Script (Run Locally)

To migrate your existing SQLite data to PostgreSQL:

```python
# migrate_to_postgres.py
import os
import sqlite3
from database_postgres import SessionLocal, Student, Exam, init_database

def migrate():
    # Initialize PostgreSQL tables
    init_database()
    
    # Connect to SQLite
    sqlite_conn = sqlite3.connect('lab_scheduler.db')
    sqlite_conn.row_factory = sqlite3.Row
    cursor = sqlite_conn.cursor()
    
    # Get PostgreSQL session
    db = SessionLocal()
    
    try:
        # Migrate students
        print("Migrating students...")
        cursor.execute("SELECT * FROM students")
        for row in cursor.fetchall():
            student = Student(
                reg_no=row['reg_no'],
                name=row['name'],
                branch=row['branch'],
                semester=row['semester']
            )
            db.add(student)
        
        # Migrate exams
        print("Migrating exams...")
        cursor.execute("SELECT * FROM exams")
        for row in cursor.fetchall():
            exam = Exam(
                subject_code=row['subject_code'],
                subject_name=row['subject_name'],
                lab_no=row['lab_no'],
                date_start=row['date_start'],
                date_end=row['date_end'],
                examiner_internal=row['examiner_internal'],
                examiner_external=row['examiner_external']
            )
            db.add(exam)
        
        db.commit()
        print("✅ Migration completed!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()
        sqlite_conn.close()

if __name__ == "__main__":
    # Set your PostgreSQL URL
    os.environ['DATABASE_URL'] = 'postgresql://user:pass@localhost:5432/dbname'
    migrate()
```

---

## 🧪 Testing Locally with PostgreSQL

1. **Install PostgreSQL locally** (optional):
   - Windows: Download from postgresql.org
   - Mac: `brew install postgresql`

2. **Create local database**:
```bash
createdb lab_scheduler_test
```

3. **Set environment variable**:
```bash
# Windows PowerShell
$env:DATABASE_URL="postgresql://localhost:5432/lab_scheduler_test"

# Mac/Linux
export DATABASE_URL="postgresql://localhost:5432/lab_scheduler_test"
```

4. **Run backend**:
```bash
python -m uvicorn main:app --reload
```

---

## 📝 Environment Variables Summary

| Variable | Local Development | Production |
|----------|------------------|------------|
| `DATABASE_URL` | `sqlite:///./lab_scheduler.db` | `postgresql://...` (from Render/Railway) |
| `PORT` | Not needed | Auto-set by platform |

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] PostgreSQL database created on Render/Railway
- [ ] Backend deployed with correct `DATABASE_URL`
- [ ] Database tables initialized
- [ ] Frontend deployed with correct API URL
- [ ] Test student upload works
- [ ] Test exam creation works
- [ ] Test schedule generation works

---

## 🆘 Troubleshooting

**Database connection fails:**
- Check `DATABASE_URL` is set correctly
- Verify PostgreSQL database is running
- Check firewall allows connections

**Tables not created:**
- Run initialization command manually
- Check server logs for errors

**Frontend can't connect:**
- Verify API URL in `frontend/src/api.js`
- Check CORS settings in backend
- Ensure backend is deployed and running

---

## 🎉 After Deployment

Your app will be live at:
- **Backend**: `https://your-app.onrender.com`
- **Frontend**: `https://your-app.vercel.app`

You can now:
- ✅ Upload students and exams through the UI
- ✅ Generate schedules
- ✅ Export to PDF/CSV
- ✅ All data persists in PostgreSQL
- ✅ Access from anywhere

---

## 💡 Pro Tips

1. **Backup your data**: Regularly export CSV files
2. **Monitor usage**: Check Render/Railway dashboard
3. **Free tier limits**: 
   - Render: 750 hours/month
   - Railway: $5 credit/month
4. **Scale up**: Upgrade to paid tier if needed

Need help? Check the platform documentation or ask for assistance!
