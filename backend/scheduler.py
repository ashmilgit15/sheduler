from datetime import datetime
from typing import List, Dict
from database import get_db_connection

def generate_schedules(exam_id: int, date: str, time_slots: List[Dict], max_students_per_batch: int):
    """
    Generate schedules for an exam on a specific date
    Groups students by branch/semester and creates batches
    """
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Get all students grouped by branch and semester
        cursor.execute("""
            SELECT reg_no, name, branch, semester 
            FROM students 
            ORDER BY branch, semester, reg_no
        """)
        students = cursor.fetchall()
        
        if not students:
            return {"error": "No students found"}
        
        # Group students by branch-semester
        groups = {}
        for student in students:
            key = f"{student['branch']}-{student['semester']}"
            if key not in groups:
                groups[key] = []
            groups[key].append(dict(student))
        
        # Check for collision - students already scheduled at this date
        cursor.execute("""
            SELECT DISTINCT ss.reg_no
            FROM schedule_students ss
            JOIN schedules s ON ss.schedule_id = s.schedule_id
            WHERE s.date = ?
        """, (date,))
        
        scheduled_students = {row['reg_no'] for row in cursor.fetchall()}
        
        # Create batches from groups
        batches = []
        batch_number = 1
        
        for group_key, group_students in groups.items():
            # Filter out already scheduled students
            available_students = [s for s in group_students if s['reg_no'] not in scheduled_students]
            
            # Split into batches
            for i in range(0, len(available_students), max_students_per_batch):
                batch = available_students[i:i + max_students_per_batch]
                batches.append({
                    'batch_number': batch_number,
                    'group': group_key,
                    'students': batch
                })
                batch_number += 1
        
        # Assign batches to time slots
        schedules = []
        slot_index = 0
        
        for batch in batches:
            if slot_index >= len(time_slots):
                slot_index = 0  # Wrap around to first slot if we run out
            
            slot = time_slots[slot_index]
            time_slot_str = f"{slot['start_time']}–{slot['end_time']}"
            
            # Insert schedule
            cursor.execute("""
                INSERT INTO schedules (exam_id, date, time_slot, total_students)
                VALUES (?, ?, ?, ?)
            """, (exam_id, date, time_slot_str, len(batch['students'])))
            
            schedule_id = cursor.lastrowid
            
            # Insert students for this schedule
            for student in batch['students']:
                cursor.execute("""
                    INSERT INTO schedule_students (schedule_id, reg_no)
                    VALUES (?, ?)
                """, (schedule_id, student['reg_no']))
            
            schedules.append({
                'schedule_id': schedule_id,
                'batch_number': batch['batch_number'],
                'time_slot': time_slot_str,
                'group': batch['group'],
                'total_students': len(batch['students']),
                'students': batch['students']
            })
            
            slot_index += 1
        
        conn.commit()
        
        return {
            'exam_id': exam_id,
            'date': date,
            'schedules': schedules
        }

def check_collision(reg_no: str, date: str, exclude_schedule_id: int = None) -> bool:
    """
    Check if a student is already scheduled on a particular date
    """
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        query = """
            SELECT COUNT(*) as count
            FROM schedule_students ss
            JOIN schedules s ON ss.schedule_id = s.schedule_id
            WHERE ss.reg_no = ? AND s.date = ?
        """
        params = [reg_no, date]
        
        if exclude_schedule_id:
            query += " AND s.schedule_id != ?"
            params.append(exclude_schedule_id)
        
        cursor.execute(query, params)
        result = cursor.fetchone()
        
        return result['count'] > 0
