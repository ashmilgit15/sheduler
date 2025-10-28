import sqlite3
from contextlib import contextmanager
from datetime import datetime

DATABASE_NAME = "lab_scheduler.db"

def init_database():
    """Initialize the database with required tables"""
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()
    
    # Create students table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS students (
            reg_no TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            branch TEXT NOT NULL,
            semester INTEGER NOT NULL
        )
    """)
    
    # Create exams table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS exams (
            exam_id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject_code TEXT NOT NULL,
            subject_name TEXT NOT NULL,
            lab_no TEXT NOT NULL,
            date_start DATE NOT NULL,
            date_end DATE NOT NULL,
            examiner_internal TEXT NOT NULL,
            examiner_external TEXT NOT NULL
        )
    """)
    
    # Create schedules table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS schedules (
            schedule_id INTEGER PRIMARY KEY AUTOINCREMENT,
            exam_id INTEGER NOT NULL,
            date DATE NOT NULL,
            time_slot TEXT NOT NULL,
            total_students INTEGER NOT NULL,
            FOREIGN KEY (exam_id) REFERENCES exams(exam_id)
        )
    """)
    
    # Create schedule_students table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS schedule_students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            schedule_id INTEGER NOT NULL,
            reg_no TEXT NOT NULL,
            FOREIGN KEY (schedule_id) REFERENCES schedules(schedule_id),
            FOREIGN KEY (reg_no) REFERENCES students(reg_no)
        )
    """)
    
    conn.commit()
    conn.close()

@contextmanager
def get_db_connection():
    """Context manager for database connections"""
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()
