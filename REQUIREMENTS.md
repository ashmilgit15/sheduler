# Lab Exam Scheduler - Requirements Specification

## Goal
Build a full-stack web app for an engineering teacher to schedule lab exams for college students automatically, ensuring no collisions.

## Stack
- **Frontend**: React + Tailwind CSS
- **Backend**: Python (FastAPI) + SQLite
- **Export**: CSV and PDF

---

## 1️⃣ Purpose

Allow the teacher to:
- ✅ Select exam and date
- ✅ Automatically divide students into batches for labs
- ✅ Respect max students per batch, customizable time slots, and branch/semester grouping
- ✅ Avoid scheduling collisions (no student in overlapping labs)
- ✅ Editable schedules in case adjustments are needed
- ✅ Support multiple exams per day
- ✅ Upload new student/exam data via CSV/Excel
- ✅ Modern table view for easy reading, with export options

---

## 2️⃣ Database Schema

### students
| Column | Type | Description |
|--------|------|-------------|
| reg_no | TEXT (PK) | e.g., MES23CS001 |
| name | TEXT | Full student name |
| branch | TEXT | e.g., CSE-A |
| semester | INTEGER | e.g., 5 |

### exams
| Column | Type | Description |
|--------|------|-------------|
| exam_id | INTEGER (PK) | Unique exam ID |
| subject_code | TEXT | e.g., CSL331 |
| subject_name | TEXT | e.g., System Software & Microprocessor Lab |
| lab_no | TEXT | e.g., LAB 4 |
| date_start | DATE | Earliest exam date |
| date_end | DATE | Last exam date |
| examiner_internal | TEXT | Internal examiner |
| examiner_external | TEXT | External examiner |

### schedules
| Column | Type | Description |
|--------|------|-------------|
| schedule_id | INTEGER (PK) | Unique schedule ID |
| exam_id | INTEGER (FK → exams) | Linked exam |
| date | DATE | Exam date |
| time_slot | TEXT | e.g., "09:30–12:30" |
| total_students | INTEGER | Students in this batch |

### schedule_students
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER (PK) | Unique row ID |
| schedule_id | INTEGER (FK → schedules.schedule_id) | Linked schedule |
| reg_no | TEXT (FK → students.reg_no) | Student reg_no |

---

## 3️⃣ Scheduler Logic

Teacher selects exam and date, optionally defines time slots.

### Backend automatically:
1. Groups students by branch/semester
2. Divides into batches based on max students per batch
3. Assigns batches to time slots
4. Checks existing schedules for collisions across all exams on that day
5. Saves schedule in `schedules` + `schedule_students`

### Frontend displays:
- Modern, editable table
- Color-coded by branch/semester
- Options to move students between batches
- Real-time collision validation

---

## 4️⃣ Frontend Features

### Modern Table View
Columns:
- Batch No.
- Time Slot
- Branch/Semester
- Student Reg. Nos.
- Total Students

### Visual Design
- ✅ Color-coded rows by branch/semester
  - CSE-A: Blue
  - CSE-B: Green
  - CSE-C: Purple
  - ISE-A: Orange
- ✅ Responsive design (desktop + mobile)
- ✅ Modern gradient UI with Tailwind CSS

### Action Buttons
- ✅ Edit batch (move students between batches)
- ✅ Download CSV/PDF
- ✅ Delete schedule
- ✅ Filter by date/exam

### Multi-Exam Display
- ✅ Shows all exams on a selected date
- ✅ Grouped display by date and exam
- ✅ Summary statistics per exam

---

## 5️⃣ Data Upload

### CSV/Excel Upload
- ✅ Students: `reg_no, name, branch, semester`
- ✅ Exams: `subject_code, subject_name, lab_no, date_start, date_end, examiner_internal, examiner_external`

### Backend Validation
- ✅ Duplicate detection
- ✅ Invalid data checks
- ✅ Error reporting

### Data Integrity
- ✅ New records added without affecting existing schedules
- ✅ Replace mode for updates

---

## 6️⃣ Access & Export

### Access
- ✅ Open access — no login required
- ✅ Direct URL access to all features

### Export
- ✅ CSV export with all schedule details
- ✅ PDF export with professional formatting
- ✅ Reflects latest edits
- ✅ Filter-aware exports (date/exam specific)

---

## 7️⃣ Mock Data

### students.csv
```csv
reg_no,name,branch,semester
MES23CS001,Anita Sharma,CSE-A,5
MES23CS002,Rahul Verma,CSE-A,5
MES23CS003,Priya Singh,CSE-B,5
MES23CS004,Aditya Kumar,CSE-B,5
MES23CS005,Neha Gupta,CSE-A,5
MES23CS006,Sameer Jain,CSE-B,5
MES23CS007,Sanya Mehta,CSE-A,5
MES23CS008,Arjun Rao,CSE-B,5
MES23CS009,Kavita Reddy,CSE-A,5
MES23CS010,Manish Sinha,CSE-B,5
```

### exams.csv
```csv
exam_id,subject_code,subject_name,lab_no,date_start,date_end,examiner_internal,examiner_external
1,CSL331,System Software & Microprocessor Lab,LAB 4,2025-11-05,2025-11-10,Dr. Verma,Dr. Sharma
2,CSL332,Database Systems Lab,LAB 5,2025-11-06,2025-11-12,Dr. Rao,Dr. Gupta
```

### Time Slots Input Example
```json
[
  {"slot_name":"Slot 1","start_time":"09:30","end_time":"12:30"},
  {"slot_name":"Slot 2","start_time":"13:30","end_time":"16:30"}
]
```

---

## 8️⃣ Implementation Status

### ✅ Completed Features

#### Backend (FastAPI + SQLite)
- [x] Database schema implementation
- [x] Student CRUD operations
- [x] Exam CRUD operations
- [x] Automatic scheduler with collision detection
- [x] Move student between batches API
- [x] CSV/Excel upload endpoints
- [x] PDF generation with ReportLab
- [x] CSV export functionality
- [x] CORS enabled for frontend access

#### Frontend (React + Tailwind)
- [x] Modern, responsive UI
- [x] Student management interface
- [x] Exam management interface
- [x] Schedule generator with customizable slots
- [x] Dashboard with schedule viewer
- [x] Color-coded branch display
- [x] **NEW**: Batch editor modal for moving students
- [x] Filter by date/exam
- [x] CSV/PDF export buttons
- [x] File upload components
- [x] Error handling and validation

#### Scheduling Logic
- [x] Branch/semester grouping
- [x] Automatic batch creation
- [x] Round-robin time slot assignment
- [x] Collision detection across all exams
- [x] **NEW**: Real-time collision checking for edits
- [x] Dynamic student count updates

#### Data Management
- [x] CSV/Excel upload for students
- [x] CSV/Excel upload for exams
- [x] Duplicate detection
- [x] Validation and error reporting
- [x] Mock data seeding script (40 students, 6 exams)

### 🎯 Key Differentiators
1. **Teacher-Focused**: Designed specifically for engineering faculty needs
2. **Collision-Free**: Intelligent scheduling prevents student conflicts
3. **Fully Editable**: Move students between batches with validation
4. **Production-Ready**: Complete with exports, uploads, and modern UI
5. **Zero Configuration**: Works out of the box with mock data

---

## 📊 Testing Checklist

- [x] Upload student data via CSV
- [x] Upload exam data via CSV
- [x] Generate schedule for single exam
- [x] Generate schedules for multiple exams on same date
- [x] Verify no collision occurs
- [x] Edit batch by moving students
- [x] Test collision prevention during edit
- [x] Export CSV with correct data
- [x] Export PDF with formatting
- [x] Filter schedules by date
- [x] Filter schedules by exam
- [x] Delete schedules
- [x] Mobile responsive testing
- [x] Multiple time slots configuration

---

## 🚀 Deployment Ready

The application is fully functional and production-ready:
- All requirements implemented ✅
- 40 mock students loaded ✅
- 6 mock exams configured ✅
- Backend API running on port 8000 ✅
- Frontend UI running on port 3000 ✅
- Complete documentation provided ✅

**Next Step**: Test the edit functionality by generating a schedule and clicking the edit icon! 🎓
