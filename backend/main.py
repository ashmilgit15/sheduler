from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from typing import List
import pandas as pd
import io
import csv
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4, landscape
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

from database import init_database, get_db_connection
from models import Student, Exam, ScheduleRequest, ScheduleStudentUpdate
from scheduler import generate_schedules, check_collision

app = FastAPI(title="Lab Exam Scheduler API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    init_database()

# ==================== Student Endpoints ====================

@app.get("/api/students")
async def get_students():
    """Get all students"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM students ORDER BY branch, semester, reg_no")
        students = [dict(row) for row in cursor.fetchall()]
    return students

@app.post("/api/students")
async def add_student(student: Student):
    """Add a single student"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        try:
            cursor.execute("""
                INSERT INTO students (reg_no, name, branch, semester)
                VALUES (?, ?, ?, ?)
            """, (student.reg_no, student.name, student.branch, student.semester))
            conn.commit()
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error adding student: {str(e)}")
    return {"message": "Student added successfully"}

@app.post("/api/students/upload")
async def upload_students(file: UploadFile = File(...)):
    """Upload students via CSV/Excel"""
    try:
        content = await file.read()
        
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(content))
        elif file.filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(io.BytesIO(content))
        else:
            raise HTTPException(status_code=400, detail="File must be CSV or Excel")
        
        # Validate required columns
        required_columns = ['reg_no', 'name', 'branch', 'semester']
        if not all(col in df.columns for col in required_columns):
            raise HTTPException(status_code=400, detail=f"CSV must contain columns: {required_columns}")
        
        with get_db_connection() as conn:
            cursor = conn.cursor()
            added = 0
            errors = []
            
            for _, row in df.iterrows():
                try:
                    cursor.execute("""
                        INSERT OR REPLACE INTO students (reg_no, name, branch, semester)
                        VALUES (?, ?, ?, ?)
                    """, (str(row['reg_no']), str(row['name']), str(row['branch']), int(row['semester'])))
                    added += 1
                except Exception as e:
                    errors.append(f"Row {row['reg_no']}: {str(e)}")
            
            conn.commit()
        
        return {
            "message": f"Successfully uploaded {added} students",
            "errors": errors if errors else None
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.delete("/api/students/{reg_no}")
async def delete_student(reg_no: str):
    """Delete a student"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM students WHERE reg_no = ?", (reg_no,))
        conn.commit()
    return {"message": "Student deleted successfully"}

# ==================== Exam Endpoints ====================

@app.get("/api/exams")
async def get_exams():
    """Get all exams"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM exams ORDER BY date_start")
        exams = [dict(row) for row in cursor.fetchall()]
    return exams

@app.post("/api/exams")
async def add_exam(exam: Exam):
    """Add a single exam"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        try:
            cursor.execute("""
                INSERT INTO exams (subject_code, subject_name, lab_no, date_start, date_end, 
                                   examiner_internal, examiner_external)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (exam.subject_code, exam.subject_name, exam.lab_no, exam.date_start, 
                  exam.date_end, exam.examiner_internal, exam.examiner_external))
            conn.commit()
            exam_id = cursor.lastrowid
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error adding exam: {str(e)}")
    return {"message": "Exam added successfully", "exam_id": exam_id}

@app.post("/api/exams/upload")
async def upload_exams(file: UploadFile = File(...)):
    """Upload exams via CSV/Excel"""
    try:
        content = await file.read()
        
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(content))
        elif file.filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(io.BytesIO(content))
        else:
            raise HTTPException(status_code=400, detail="File must be CSV or Excel")
        
        required_columns = ['subject_code', 'subject_name', 'lab_no', 'date_start', 
                          'date_end', 'examiner_internal', 'examiner_external']
        if not all(col in df.columns for col in required_columns):
            raise HTTPException(status_code=400, detail=f"CSV must contain columns: {required_columns}")
        
        with get_db_connection() as conn:
            cursor = conn.cursor()
            added = 0
            errors = []
            
            for _, row in df.iterrows():
                try:
                    cursor.execute("""
                        INSERT INTO exams (subject_code, subject_name, lab_no, date_start, 
                                         date_end, examiner_internal, examiner_external)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    """, (str(row['subject_code']), str(row['subject_name']), str(row['lab_no']),
                         str(row['date_start']), str(row['date_end']), 
                         str(row['examiner_internal']), str(row['examiner_external'])))
                    added += 1
                except Exception as e:
                    errors.append(f"Row: {str(e)}")
            
            conn.commit()
        
        return {
            "message": f"Successfully uploaded {added} exams",
            "errors": errors if errors else None
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.delete("/api/exams/{exam_id}")
async def delete_exam(exam_id: int):
    """Delete an exam"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM exams WHERE exam_id = ?", (exam_id,))
        conn.commit()
    return {"message": "Exam deleted successfully"}

# ==================== Schedule Endpoints ====================

@app.post("/api/schedules/generate")
async def create_schedule(request: ScheduleRequest):
    """Generate schedules for an exam"""
    time_slots = [slot.dict() for slot in request.time_slots]
    result = generate_schedules(
        request.exam_id,
        request.date,
        time_slots,
        request.max_students_per_batch
    )
    return result

@app.get("/api/schedules")
async def get_schedules(date: str = None, exam_id: int = None):
    """Get schedules with optional filters"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        query = """
            SELECT s.*, e.subject_name, e.subject_code, e.lab_no
            FROM schedules s
            JOIN exams e ON s.exam_id = e.exam_id
            WHERE 1=1
        """
        params = []
        
        if date:
            query += " AND s.date = ?"
            params.append(date)
        
        if exam_id:
            query += " AND s.exam_id = ?"
            params.append(exam_id)
        
        query += " ORDER BY s.date, s.time_slot"
        
        cursor.execute(query, params)
        schedules = []
        
        for row in cursor.fetchall():
            schedule = dict(row)
            
            # Get students for this schedule
            cursor.execute("""
                SELECT s.* FROM students s
                JOIN schedule_students ss ON s.reg_no = ss.reg_no
                WHERE ss.schedule_id = ?
                ORDER BY s.branch, s.reg_no
            """, (schedule['schedule_id'],))
            
            schedule['students'] = [dict(s) for s in cursor.fetchall()]
            schedules.append(schedule)
    
    return schedules

@app.put("/api/schedules/move-student")
async def move_student(update: ScheduleStudentUpdate):
    """Move a student from one schedule to another"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Get date of destination schedule
        cursor.execute("SELECT date FROM schedules WHERE schedule_id = ?", (update.to_schedule_id,))
        result = cursor.fetchone()
        if not result:
            raise HTTPException(status_code=404, detail="Destination schedule not found")
        
        date = result['date']
        
        # Check for collision
        if check_collision(update.student_reg_no, date, update.from_schedule_id):
            raise HTTPException(status_code=400, detail="Student already scheduled at this time")
        
        # Move student
        cursor.execute("""
            UPDATE schedule_students 
            SET schedule_id = ? 
            WHERE schedule_id = ? AND reg_no = ?
        """, (update.to_schedule_id, update.from_schedule_id, update.student_reg_no))
        
        # Update student counts
        cursor.execute("""
            UPDATE schedules 
            SET total_students = (
                SELECT COUNT(*) FROM schedule_students 
                WHERE schedule_id = schedules.schedule_id
            )
            WHERE schedule_id IN (?, ?)
        """, (update.from_schedule_id, update.to_schedule_id))
        
        conn.commit()
    
    return {"message": "Student moved successfully"}

@app.delete("/api/schedules/{schedule_id}")
async def delete_schedule(schedule_id: int):
    """Delete a schedule and its students"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM schedule_students WHERE schedule_id = ?", (schedule_id,))
        cursor.execute("DELETE FROM schedules WHERE schedule_id = ?", (schedule_id,))
        conn.commit()
    return {"message": "Schedule deleted successfully"}

# ==================== Export Endpoints ====================

@app.get("/api/export/csv")
async def export_csv(date: str = None, exam_id: int = None):
    """Export schedules to CSV"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        query = """
            SELECT 
                s.schedule_id,
                s.date,
                s.time_slot,
                e.subject_name,
                e.subject_code,
                e.lab_no,
                GROUP_CONCAT(st.reg_no, ', ') as students,
                s.total_students
            FROM schedules s
            JOIN exams e ON s.exam_id = e.exam_id
            LEFT JOIN schedule_students ss ON s.schedule_id = ss.schedule_id
            LEFT JOIN students st ON ss.reg_no = st.reg_no
            WHERE 1=1
        """
        params = []
        
        if date:
            query += " AND s.date = ?"
            params.append(date)
        
        if exam_id:
            query += " AND s.exam_id = ?"
            params.append(exam_id)
        
        query += " GROUP BY s.schedule_id ORDER BY s.date, s.time_slot"
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
    
    # Create CSV
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['Date', 'Time Slot', 'Subject', 'Lab', 'Students', 'Total'])
    
    for row in rows:
        writer.writerow([
            row['date'],
            row['time_slot'],
            f"{row['subject_code']} - {row['subject_name']}",
            row['lab_no'],
            row['students'] or '',
            row['total_students']
        ])
    
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=schedule.csv"}
    )

@app.get("/api/export/pdf")
async def export_pdf(date: str = None, exam_id: int = None):
    """Export schedules to PDF"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        query = """
            SELECT 
                s.schedule_id,
                s.date,
                s.time_slot,
                e.subject_name,
                e.subject_code,
                e.lab_no,
                s.total_students,
                st.branch,
                st.semester,
                GROUP_CONCAT(st.reg_no, ', ') as students
            FROM schedules s
            JOIN exams e ON s.exam_id = e.exam_id
            LEFT JOIN schedule_students ss ON s.schedule_id = ss.schedule_id
            LEFT JOIN students st ON ss.reg_no = st.reg_no
            WHERE 1=1
        """
        params = []
        
        if date:
            query += " AND s.date = ?"
            params.append(date)
        
        if exam_id:
            query += " AND s.exam_id = ?"
            params.append(exam_id)
        
        query += " GROUP BY s.schedule_id, st.branch, st.semester ORDER BY s.date, s.time_slot"
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
    
    # Create PDF
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=landscape(A4))
    elements = []
    
    # Title
    styles = getSampleStyleSheet()
    title = Paragraph("<b>Lab Exam Schedule</b>", styles['Title'])
    elements.append(title)
    elements.append(Spacer(1, 20))
    
    # Table data
    data = [['Date', 'Time Slot', 'Subject', 'Lab', 'Branch/Sem', 'Students', 'Total']]
    
    for row in rows:
        data.append([
            row['date'],
            row['time_slot'],
            f"{row['subject_code']}\n{row['subject_name']}",
            row['lab_no'],
            f"{row['branch']}-{row['semester']}" if row['branch'] else '',
            row['students'][:50] + '...' if row['students'] and len(row['students']) > 50 else (row['students'] or ''),
            str(row['total_students'])
        ])
    
    # Create table
    table = Table(data, colWidths=[60, 80, 120, 50, 70, 200, 40])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTSIZE', (0, 1), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    
    elements.append(table)
    doc.build(elements)
    
    buffer.seek(0)
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=schedule.pdf"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
