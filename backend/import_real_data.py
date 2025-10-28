"""
Import Real Data from Exam Schedule Images
Extracted from S5 A,B,C students and faculty schedules
"""

import csv
import requests

API_BASE = "http://localhost:8000/api"

# Real students extracted from the schedules
STUDENTS = [
    # Batch 1 - Common in both exams (9:30 am - 12:30 pm, various dates)
    {"reg_no": "MES23CS001", "name": "Student 001", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS004", "name": "Student 004", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS007", "name": "Student 007", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS010", "name": "Student 010", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS013", "name": "Student 013", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS016", "name": "Student 016", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS019", "name": "Student 019", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS022", "name": "Student 022", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS024", "name": "Student 024", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS027", "name": "Student 027", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS030", "name": "Student 030", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS033", "name": "Student 033", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS036", "name": "Student 036", "branch": "CSE-A", "semester": 5},
    
    # Batch 2 - Common in both exams (1:30/2:00 pm - 4:30/5:00 pm)
    {"reg_no": "MES23CS039", "name": "Student 039", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS042", "name": "Student 042", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS043", "name": "Student 043", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS045", "name": "Student 045", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS048", "name": "Student 048", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS051", "name": "Student 051", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS055", "name": "Student 055", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS058", "name": "Student 058", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS061", "name": "Student 061", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS064", "name": "Student 064", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS067", "name": "Student 067", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS071", "name": "Student 071", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS074", "name": "Student 074", "branch": "CSE-A", "semester": 5},
    
    # Batch 3
    {"reg_no": "MES23CS080", "name": "Student 080", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS083", "name": "Student 083", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS089", "name": "Student 089", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS092", "name": "Student 092", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS095", "name": "Student 095", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS098", "name": "Student 098", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS101", "name": "Student 101", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS104", "name": "Student 104", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS107", "name": "Student 107", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS110", "name": "Student 110", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS114", "name": "Student 114", "branch": "CSE-A", "semester": 5},
    
    # Batch 4
    {"reg_no": "MES23CS120", "name": "Student 120", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS123", "name": "Student 123", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS128", "name": "Student 128", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS135", "name": "Student 135", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS136", "name": "Student 136", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS139", "name": "Student 139", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS141", "name": "Student 141", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS142", "name": "Student 142", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS145", "name": "Student 145", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS146", "name": "Student 146", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS148", "name": "Student 148", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS149", "name": "Student 149", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS152", "name": "Student 152", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS044", "name": "Student 044", "branch": "CSE-A", "semester": 5},
    
    # Batch 5
    {"reg_no": "MES23CS154", "name": "Student 154", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS157", "name": "Student 157", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS160", "name": "Student 160", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS163", "name": "Student 163", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS166", "name": "Student 166", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS169", "name": "Student 169", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS172", "name": "Student 172", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS175", "name": "Student 175", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS178", "name": "Student 178", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS180", "name": "Student 180", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS184", "name": "Student 184", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS187", "name": "Student 187", "branch": "CSE-A", "semester": 5},
    {"reg_no": "XMES23CS017", "name": "Student X017", "branch": "CSE-A", "semester": 5},
    
    # Batch 6 - Final batch with special cases
    {"reg_no": "MES23CS006", "name": "Student 006", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS015", "name": "Student 015", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS023", "name": "Student 023", "branch": "CSE-A", "semester": 5},
    {"reg_no": "LMES23CS190", "name": "Student L190", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS192", "name": "Student 192", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS194", "name": "Student 194", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS196", "name": "Student 196", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS198", "name": "Student 198", "branch": "CSE-A", "semester": 5},
    {"reg_no": "MES23CS202", "name": "Student 202", "branch": "CSE-A", "semester": 5},
    {"reg_no": "LMES21CS017", "name": "Student L21-017", "branch": "CSE-A", "semester": 5},
]

# Real exam data from the schedules
EXAMS = [
    {
        "subject_code": "CSL331",
        "subject_name": "System Software and Microprocessor Lab",
        "lab_no": "LAB 4 (Room C 107)",
        "date_start": "2025-10-31",
        "date_end": "2025-11-04",
        "examiner_internal": "FAHMA P (KTU F48552)",
        "examiner_external": "External Examiner TBD"
    },
    {
        "subject_code": "CSL333",
        "subject_name": "Database Management Systems Lab",
        "lab_no": "LAB 3 (Room C 210)",
        "date_start": "2025-10-28",
        "date_end": "2025-10-31",
        "examiner_internal": "BADHARUDH FEN P (KTU F16356)",
        "examiner_external": "RAFA BEECHANARI IBRAHIM (KTU F48093)"
    }
]

def import_students():
    """Import all students"""
    print("📚 Importing students...")
    for student in STUDENTS:
        try:
            response = requests.post(f"{API_BASE}/students", json=student)
            if response.status_code == 200:
                print(f"  ✓ Added: {student['reg_no']} - {student['name']}")
            else:
                print(f"  ✗ Failed: {student['reg_no']} - {response.text}")
        except Exception as e:
            print(f"  ✗ Error adding {student['reg_no']}: {e}")
    
    print(f"\n✅ Imported {len(STUDENTS)} students")

def import_exams():
    """Import all exams"""
    print("\n📝 Importing exams...")
    for exam in EXAMS:
        try:
            response = requests.post(f"{API_BASE}/exams", json=exam)
            if response.status_code == 200:
                print(f"  ✓ Added: {exam['subject_code']} - {exam['subject_name']}")
            else:
                print(f"  ✗ Failed: {exam['subject_code']} - {response.text}")
        except Exception as e:
            print(f"  ✗ Error adding {exam['subject_code']}: {e}")
    
    print(f"\n✅ Imported {len(EXAMS)} exams")

def save_to_csv():
    """Save data to CSV files as backup"""
    print("\n💾 Saving data to CSV files...")
    
    # Save students
    with open('students.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['reg_no', 'name', 'branch', 'semester'])
        writer.writeheader()
        writer.writerows(STUDENTS)
    print("  ✓ students.csv created")
    
    # Save exams
    with open('exams.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=[
            'subject_code', 'subject_name', 'lab_no', 
            'date_start', 'date_end', 'examiner_internal', 'examiner_external'
        ])
        writer.writeheader()
        writer.writerows(EXAMS)
    print("  ✓ exams.csv created")

if __name__ == "__main__":
    print("🚀 Starting real data import from exam schedules...")
    print("=" * 60)
    
    # Check if backend is running
    try:
        response = requests.get(f"{API_BASE}/students")
        print("✓ Backend is running\n")
    except:
        print("❌ Backend is not running!")
        print("Please start the backend first: uvicorn main:app --reload")
        exit(1)
    
    # Save to CSV first
    save_to_csv()
    
    # Import to database
    import_students()
    import_exams()
    
    print("\n" + "=" * 60)
    print("🎉 Data import completed!")
    print("\nNext steps:")
    print("1. Go to the frontend application")
    print("2. Navigate to the 'Generate Schedule' tab")
    print("3. Generate schedules for the imported exams")
