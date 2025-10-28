"""
Database configuration that supports both SQLite (local) and PostgreSQL (production)
"""
import os
from sqlalchemy import create_engine, Column, Integer, String, Date, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

# Get database URL from environment variable, default to SQLite for local dev
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./lab_scheduler.db")

# Fix for Render's postgres:// URL (should be postgresql://)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Create engine with appropriate settings
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    # PostgreSQL settings
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# SQLAlchemy Models
class Student(Base):
    __tablename__ = "students"
    
    reg_no = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    branch = Column(String, nullable=False)
    semester = Column(Integer, nullable=False)

class Exam(Base):
    __tablename__ = "exams"
    
    exam_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    subject_code = Column(String, nullable=False)
    subject_name = Column(String, nullable=False)
    lab_no = Column(String, nullable=False)
    date_start = Column(Date, nullable=False)
    date_end = Column(Date, nullable=False)
    examiner_internal = Column(String, nullable=False)
    examiner_external = Column(String, nullable=False)
    
    schedules = relationship("Schedule", back_populates="exam", cascade="all, delete-orphan")

class Schedule(Base):
    __tablename__ = "schedules"
    
    schedule_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    exam_id = Column(Integer, ForeignKey("exams.exam_id"), nullable=False)
    date = Column(Date, nullable=False)
    time_slot = Column(String, nullable=False)
    total_students = Column(Integer, nullable=False)
    
    exam = relationship("Exam", back_populates="schedules")
    schedule_students = relationship("ScheduleStudent", back_populates="schedule", cascade="all, delete-orphan")

class ScheduleStudent(Base):
    __tablename__ = "schedule_students"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    schedule_id = Column(Integer, ForeignKey("schedules.schedule_id"), nullable=False)
    reg_no = Column(String, ForeignKey("students.reg_no"), nullable=False)
    
    schedule = relationship("Schedule", back_populates="schedule_students")
    student = relationship("Student")

def init_database():
    """Initialize the database with all tables"""
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")

def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
