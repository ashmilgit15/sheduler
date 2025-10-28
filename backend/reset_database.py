"""
Reset Database Script
Run this to completely clear your database and start fresh
"""

from database import get_db_connection

def reset_database():
    print("🗑️  Resetting database to clean state...")
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        try:
            # Delete all data from tables (in correct order due to foreign keys)
            print("Clearing schedule_students...")
            cursor.execute("DELETE FROM schedule_students")
            
            print("Clearing schedules...")
            cursor.execute("DELETE FROM schedules")
            
            print("Clearing exams...")
            cursor.execute("DELETE FROM exams")
            
            print("Clearing students...")
            cursor.execute("DELETE FROM students")
            
            # Reset autoincrement counters
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='exams'")
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='schedules'")
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='schedule_students'")
            
            # Commit the changes
            conn.commit()
            
            print("✅ Database successfully cleared!")
            
            # Verify the data is gone
            student_count = cursor.execute("SELECT COUNT(*) FROM students").fetchone()[0]
            exam_count = cursor.execute("SELECT COUNT(*) FROM exams").fetchone()[0]
            schedule_count = cursor.execute("SELECT COUNT(*) FROM schedules").fetchone()[0]
            
            print(f"\n📊 Current database state:")
            print(f"   Students: {student_count}")
            print(f"   Exams: {exam_count}")
            print(f"   Schedules: {schedule_count}")
            
        except Exception as e:
            print(f"❌ Error clearing database: {e}")
            conn.rollback()

if __name__ == "__main__":
    reset_database()
