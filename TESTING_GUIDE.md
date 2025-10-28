# 🧪 Lab Exam Scheduler - Testing Guide

## ✅ Database Already Populated!

Your database now contains:
- **40 Students** across 4 branches (CSE-A, CSE-B, CSE-C, ISE-A)
- **6 Lab Exams** with different subjects and date ranges

## 🎯 Quick Test Scenarios

### Test 1: Generate Your First Schedule (Easy)

1. **Open the app**: http://localhost:3000
2. **Go to**: "Generate Schedule" tab
3. **Configure**:
   - Select Exam: `CSL331 - System Software & Microprocessor Lab`
   - Exam Date: `2025-11-05`
   - Max Students per Batch: `5`
   - Time Slots: (already filled - keep defaults)
     - Slot 1: 09:30 to 12:30
     - Slot 2: 13:30 to 16:30
4. **Click**: "Generate Schedule" button
5. **Result**: Should create 8 batches (40 students ÷ 5 per batch)

### Test 2: View Generated Schedules

1. **Go to**: "Dashboard" tab
2. **You'll see**: 
   - Beautiful schedule cards grouped by date/exam
   - Color-coded branches (Blue=CSE-A, Green=CSE-B, Purple=CSE-C, Orange=ISE-A)
   - Student registration numbers for each batch
   - Time slots and batch numbers
   - **Edit and Delete icons** for each batch

### Test 2.1: Edit a Batch (NEW!)

1. **Click the edit icon** (blue pencil) on any batch
2. **A modal will open** showing:
   - Current batch details
   - All students in that batch
   - Available target batches
3. **Select a student** to move from the dropdown
4. **Select target batch** to move the student to
5. **Click "Move Student"**
6. **Result**: Student moved successfully (or error if collision detected)
7. **Verify**: Check both batches - student counts updated!

### Test 3: Filter Schedules

1. **In Dashboard**:
   - Filter by Date: Select `2025-11-05`
   - Filter by Exam: Select any exam
   - Click "Apply" to filter
   - Click "Clear" to reset

### Test 4: Export Schedules

1. **In Dashboard**:
   - Click "Export CSV" → Opens CSV file in Excel
   - Click "Export PDF" → Downloads professional PDF

### Test 5: Generate Multiple Exams (Collision Test)

1. **Generate Schedule for 1st exam**:
   - Exam: `CSL331`
   - Date: `2025-11-08`
   - Max Students: `6`
   - Generate

2. **Generate Schedule for 2nd exam (SAME DATE)**:
   - Exam: `CSL332 - Database Systems Lab`
   - Date: `2025-11-08` (same date!)
   - Max Students: `6`
   - Generate

3. **Result**: The scheduler will automatically avoid collision! Each student appears in only ONE exam on that date.

### Test 5.1: Test Collision Prevention During Edit

1. **After generating 2 exams on same date** (from Test 5)
2. **Try to move a student** from Exam 1, Batch 1 to Exam 2, Batch 1
3. **Click edit** on Exam 1, Batch 1
4. **Select a student** who is already in Exam 2
5. **Try to move** to any Exam 2 batch
6. **Result**: ❌ Error message - "Student already scheduled at this time"
7. **This proves**: The system prevents double-booking!

### Test 6: Manage Students

1. **Go to**: "Students" tab
2. **View**: All 40 students grouped by branch
3. **Download Template**: Get a sample CSV format
4. **Upload More**: Try uploading a CSV with new students
5. **Delete**: Click trash icon to remove a student

### Test 7: Manage Exams

1. **Go to**: "Exams" tab
2. **View**: All 6 exams in card format
3. **Add More**: Upload CSV with additional exams
4. **Check Details**: See date ranges, examiners, lab numbers

### Test 8: Multiple Time Slots

1. **Generate Schedule** tab
2. **Add more slots**: Click "+ Add Slot"
3. **Configure 3-4 time slots**:
   - Slot 1: 09:00 - 11:30
   - Slot 2: 12:00 - 14:30
   - Slot 3: 15:00 - 17:30
4. **Generate** with smaller batch size (3-4 students)
5. **Result**: Students distributed across all time slots

## 📊 Mock Data Details

### Students (40 total)
- **CSE-A Sem 5**: 10 students (MES23CS001-019 odd)
- **CSE-B Sem 5**: 10 students (MES23CS003-020 even)
- **CSE-C Sem 5**: 10 students (MES23CS021-030)
- **ISE-A Sem 5**: 10 students (MES23IS001-010)

### Exams (6 total)
1. CSL331 - System Software & Microprocessor Lab (LAB 4) - Nov 5-10
2. CSL332 - Database Systems Lab (LAB 5) - Nov 6-12
3. CSL333 - Computer Networks Lab (LAB 3) - Nov 7-14
4. CSL334 - Operating Systems Lab (LAB 2) - Nov 8-15
5. CSL335 - Web Technology Lab (LAB 6) - Nov 9-16
6. ISL331 - Data Analytics Lab (LAB 1) - Nov 10-17

## 🎨 UI Features to Notice

### Color Coding
- **CSE-A**: Blue badges and highlights
- **CSE-B**: Green badges and highlights
- **CSE-C**: Purple badges and highlights
- **ISE-A**: Orange badges and highlights

### Visual Elements
- Gradient headers and buttons
- Hover effects on cards and rows
- Smooth transitions and animations
- Responsive design (try resizing window)
- Beautiful icons from Lucide React

## 🔍 Backend API Testing

### API Documentation
Visit: http://localhost:8000/docs

### Try These Endpoints:
```bash
# Get all students
GET http://localhost:8000/api/students

# Get all exams
GET http://localhost:8000/api/exams

# Get schedules for specific date
GET http://localhost:8000/api/schedules?date=2025-11-08

# Get schedules for specific exam
GET http://localhost:8000/api/schedules?exam_id=1
```

## 🐛 What to Test For

### ✅ Expected Behaviors
- Students grouped correctly by branch/semester
- No student appears twice on same date/time
- Batch numbers increment correctly
- Filters work properly
- CSV/PDF exports contain correct data
- Upload forms accept valid CSV files
- Delete operations work
- **NEW**: Edit modal opens when clicking edit icon
- **NEW**: Student moves between batches successfully
- **NEW**: Collision prevention works during edits
- **NEW**: Student counts update after moves

### ⚠️ Edge Cases to Try
- Generate schedule with 0 time slots (should error)
- Generate schedule for date outside exam range
- Upload CSV with duplicate registration numbers
- Try to schedule same exam twice on same date
- Delete a schedule and verify student count updates

## 📈 Performance Testing

Try generating schedules with:
- Very small batches (2 students) → Many batches created
- Very large batches (20 students) → Few batches created
- Multiple exams on consecutive dates
- All 6 exams scheduled on different dates

## 🎓 Advanced Testing

### Scenario: Full Week Schedule
Generate schedules for all 6 exams across different dates:
1. CSL331 on Nov 5
2. CSL332 on Nov 6
3. CSL333 on Nov 7
4. CSL334 on Nov 8
5. CSL335 on Nov 9
6. ISL331 on Nov 10

Then use Dashboard filters to view each day's schedule!

## 🔄 Reset Database

To start fresh:
```bash
# Stop backend (Ctrl+C)
# Delete database file
del lab_scheduler.db

# Restart backend
python main.py

# Re-run seed script
python seed_data.py
```

## 📞 Troubleshooting

### Issue: "No students found" when generating
**Solution**: Run `python seed_data.py` again

### Issue: Frontend not loading
**Solution**: Check if `npm start` is running on port 3000

### Issue: CORS error
**Solution**: Ensure backend is running on port 8000

### Issue: Schedule generation fails
**Solution**: Check that exam dates are valid and students exist

## 🎉 Success Criteria

You'll know everything works if you can:
1. ✅ See 40 students in Students tab
2. ✅ See 6 exams in Exams tab
3. ✅ Generate a schedule successfully
4. ✅ View schedules in Dashboard with color coding
5. ✅ **Edit a batch and move students** between batches
6. ✅ **Collision prevention** blocks invalid moves
7. ✅ Export CSV and PDF files
8. ✅ Filter schedules by date/exam
9. ✅ No student conflicts (double booking)
10. ✅ Student counts update dynamically

---

**Happy Testing! 🚀**

If everything works, you have a fully functional lab exam scheduler!
