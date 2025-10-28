from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class Student(BaseModel):
    reg_no: str
    name: str
    branch: str
    semester: int

class Exam(BaseModel):
    exam_id: Optional[int] = None
    subject_code: str
    subject_name: str
    lab_no: str
    date_start: str
    date_end: str
    examiner_internal: str
    examiner_external: str

class TimeSlot(BaseModel):
    slot_name: str
    start_time: str
    end_time: str

class ScheduleRequest(BaseModel):
    exam_id: int
    date: str
    time_slots: List[TimeSlot]
    max_students_per_batch: int

class Schedule(BaseModel):
    schedule_id: int
    exam_id: int
    date: str
    time_slot: str
    total_students: int
    students: List[Student]

class ScheduleStudentUpdate(BaseModel):
    student_reg_no: str
    from_schedule_id: int
    to_schedule_id: int
