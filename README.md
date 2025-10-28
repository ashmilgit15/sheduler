# Lab Exam Scheduler - Full Stack Application

A comprehensive web application for engineering teachers to automatically schedule lab exams for college students, ensuring no scheduling collisions.

## 🚀 Features

### For Teachers
- **Automatic Scheduling**: Select exam and date, system automatically divides students into batches
- **Collision Detection**: Prevents scheduling conflicts across all exams on the same day
- **Editable Schedules**: Move students between batches with real-time collision checking
- **Multiple Exams Per Day**: Schedule different exams on the same date without conflicts

### Data Management
- **CSV/Excel Upload**: Bulk upload students and exams
- **Validation**: Automatic duplicate detection and data validation
- **Student Management**: Add, view, and remove students by branch/semester

### Scheduling Intelligence
- **Branch/Semester Grouping**: Automatically groups students for organized batches
- **Customizable Time Slots**: Define multiple time slots per exam/date
- **Max Students Per Batch**: Configurable batch size limits
- **Smart Assignment**: Round-robin batch assignment to time slots

### Modern UI & Export
- **Editable Table View**: Modern, color-coded display with batch editing
- **Responsive Design**: Works on desktop and mobile
- **CSV & PDF Export**: Download schedules with latest edits
- **No Login Required**: Open access for easy use

## 🛠 Tech Stack

### Frontend
- **React 18**: Modern UI library
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icons
- **Axios**: HTTP client

### Backend
- **FastAPI**: High-performance Python web framework
- **SQLite**: Lightweight database
- **Pandas**: Data processing
- **ReportLab**: PDF generation

## 📋 Database Schema

### Students Table
- `reg_no` (TEXT, PK): e.g., MES23CS001
- `name` (TEXT): Full student name
- `branch` (TEXT): e.g., CSE-A
- `semester` (INTEGER): e.g., 5

### Exams Table
- `exam_id` (INTEGER, PK): Unique exam ID
- `subject_code` (TEXT): e.g., CSL331
- `subject_name` (TEXT): e.g., System Software Lab
- `lab_no` (TEXT): e.g., LAB 4
- `date_start` (DATE): Earliest exam date
- `date_end` (DATE): Last exam date
- `examiner_internal` (TEXT): Internal examiner
- `examiner_external` (TEXT): External examiner

### Schedules Table
- `schedule_id` (INTEGER, PK): Unique schedule ID
- `exam_id` (INTEGER, FK): Linked exam
- `date` (DATE): Exam date
- `time_slot` (TEXT): e.g., "9:30–12:30"
- `total_students` (INTEGER): Students in this batch

### Schedule_Students Table
- `id` (INTEGER, PK): Unique row ID
- `schedule_id` (INTEGER, FK): Linked schedule
- `reg_no` (TEXT, FK): Student reg_no

## 🚦 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (optional but recommended):
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the backend server:
```bash
python main.py
```

The backend will run on `http://localhost:8000`

**API Documentation**: Visit `http://localhost:8000/docs` for interactive API documentation

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 📊 Using the Application

### 1. Upload Students
- Go to the **Students** tab
- Click "Download Template" to get a sample CSV file
- Upload your students CSV/Excel file with columns: `reg_no, name, branch, semester`

### 2. Upload Exams
- Go to the **Exams** tab
- Click "Download Template" to get a sample CSV file
- Upload your exams CSV/Excel file with required columns

### 3. Generate Schedule
- Go to the **Generate Schedule** tab
- Select an exam from the dropdown
- Choose the exam date
- Set maximum students per batch
- Define time slots (you can add multiple slots)
- Click "Generate Schedule"

### 4. View and Manage Schedules
- Go to the **Dashboard** tab
- View all generated schedules with color-coded branches
- Filter by date or exam
- **Edit batches**: Click the edit icon to move students between batches
- Export to CSV or PDF
- Delete schedules if needed

## 📁 Mock Data

The project includes sample data files in the `backend` directory:
- `students.csv`: Sample student data (10 students)
- `exams.csv`: Sample exam data (2 exams)

You can use these files to test the application immediately after setup.

## 🎨 Color Coding

The application uses color coding for different branches:
- **CSE-A**: Blue
- **CSE-B**: Green
- **CSE-C**: Purple
- **Others**: Orange

## 📤 Export Features

### CSV Export
- Exports schedule data in comma-separated format
- Includes: Date, Time Slot, Subject, Lab, Students, Total

### PDF Export
- Generates a professional PDF document
- Formatted table with all schedule details
- Suitable for printing and sharing

## 🔧 API Endpoints

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Add a student
- `POST /api/students/upload` - Upload CSV/Excel
- `DELETE /api/students/{reg_no}` - Delete a student

### Exams
- `GET /api/exams` - Get all exams
- `POST /api/exams` - Add an exam
- `POST /api/exams/upload` - Upload CSV/Excel
- `DELETE /api/exams/{exam_id}` - Delete an exam

### Schedules
- `GET /api/schedules` - Get schedules (with filters)
- `POST /api/schedules/generate` - Generate schedules automatically
- `PUT /api/schedules/move-student` - Move student between batches (with collision check)
- `DELETE /api/schedules/{schedule_id}` - Delete a schedule

### Export
- `GET /api/export/csv` - Export to CSV
- `GET /api/export/pdf` - Export to PDF

## 🧠 Scheduler Logic

When a teacher selects exam and date:

### Automatic Process
1. **Query Students**: Gets all students eligible for the exam
2. **Group by Branch/Semester**: Organizes students (e.g., CSE-A, CSE-B)
3. **Create Batches**: Divides each group based on max students per batch
4. **Check Collisions**: Verifies no student is already scheduled on that date
5. **Assign Time Slots**: Distributes batches across available time slots (round-robin)
6. **Save to Database**: Stores in `schedules` and `schedule_students` tables

### Editable Schedules
- Teachers can move students between batches via the UI
- System validates moves to prevent collision conflicts
- Real-time updates reflected in dashboard

## 🐛 Troubleshooting

### Backend won't start
- Ensure Python 3.8+ is installed
- Check if port 8000 is available
- Install all requirements: `pip install -r requirements.txt`

### Frontend won't start
- Ensure Node.js is installed
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `npm install`

### CORS errors
- Ensure backend is running on port 8000
- Check CORS middleware is enabled in `main.py`

### Database errors
- Delete `lab_scheduler.db` and restart backend to recreate database

## 📝 License

This project is open source and available for educational purposes.

## 👨‍💻 Development

Built with:
- React for a modern, responsive UI
- FastAPI for high-performance backend
- SQLite for simple, embedded database
- Tailwind CSS for beautiful styling

## 🎯 Future Enhancements

Potential features for future versions:
- User authentication and role management
- Email notifications for schedule updates
- Bulk edit capabilities
- Schedule templates
- Automated conflict resolution
- Mobile app version
- Real-time collaboration features

## 📞 Support

For issues and questions, please check:
1. API documentation at `http://localhost:8000/docs`
2. Console logs in browser developer tools
3. Backend logs in terminal

---

**Happy Scheduling! 🎓**
