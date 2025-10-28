# 📚 Import Real Exam Schedule Data

This guide will help you import the real student and exam data extracted from your exam schedule images.

## 📋 Data Summary

### Students
- **Total**: 75 students
- **Branch**: CSE-A
- **Semester**: 5
- **Registration Numbers**: MES23CS001 to MES23CS202 (with some special cases like XMES23CS017, LMES23CS190, etc.)

### Exams
1. **CSL331** - System Software and Microprocessor Lab
   - Lab: LAB 4 (Room C 107)
   - Dates: October 31 - November 4, 2025
   - Internal: FAHMA P (KTU F48552)

2. **CSL333** - Database Management Systems Lab
   - Lab: LAB 3 (Room C 210)
   - Dates: October 28-31, 2025
   - Internal: BADHARUDH FEN P (KTU F16356)
   - External: RAFA BEECHANARI IBRAHIM (KTU F48093)

## 🚀 Step-by-Step Import Process

### Step 1: Initialize Fresh Database
```bash
cd backend
python init_fresh_database.py
```

This will create a clean database with all necessary tables.

### Step 2: Start the Backend Server
```bash
uvicorn main:app --reload
```

Keep this terminal open and running.

### Step 3: Import Real Data (In a new terminal)
```bash
cd backend
python import_real_data.py
```

This script will:
- ✅ Import all 75 students
- ✅ Import both exams
- ✅ Create backup CSV files (students.csv and exams.csv)
- ✅ Verify all data was imported correctly

### Step 4: Start the Frontend
```bash
cd frontend
npm start
```

### Step 5: Generate Schedules
1. Open the frontend in your browser (usually http://localhost:3000)
2. Go to the **"Generate Schedule"** tab
3. For each exam:
   - Select the exam from dropdown
   - Choose the exam date
   - Set max students per batch (recommended: 10-13)
   - Add time slots:
     - Morning: 9:30 AM - 12:30 PM
     - Afternoon: 1:30 PM - 4:30 PM (or 2:00 PM - 5:00 PM)
   - Click "Generate Schedule"

## 📊 Expected Results

After importing:
- ✅ **75 students** in the Students tab
- ✅ **2 exams** in the Exams tab
- ✅ Ready to generate schedules

## 🔄 If You Need to Re-import

If something goes wrong, you can reset and try again:

```bash
# Step 1: Clear the database
python reset_database.py

# Step 2: Re-import the data
python import_real_data.py
```

## 📝 Student Names

Note: The imported students have placeholder names like "Student 001", "Student 004", etc.

If you need to update student names with real names:
1. Edit the `students.csv` file
2. Upload it through the frontend Students tab

## 🎯 Quick Commands Reference

```bash
# Initialize fresh database
python init_fresh_database.py

# Import real data
python import_real_data.py

# Clear database (if needed)
python reset_database.py

# Start backend
uvicorn main:app --reload

# Start frontend (in different terminal)
cd frontend && npm start
```

## ✨ Success Checklist

- [ ] Database initialized
- [ ] Backend running on http://localhost:8000
- [ ] Data imported successfully
- [ ] Frontend running on http://localhost:3000
- [ ] Can see 75 students in Students tab
- [ ] Can see 2 exams in Exams tab
- [ ] Ready to generate schedules

## 🆘 Troubleshooting

**Backend not running error?**
- Make sure you started the backend with `uvicorn main:app --reload`

**Import fails?**
- Check if backend is accessible at http://localhost:8000
- Try `python reset_database.py` and re-import

**Students not showing?**
- Refresh the frontend page
- Check browser console for errors

## 📞 Need Help?

If you encounter any issues:
1. Check that the backend is running
2. Verify the database file exists (lab_scheduler.db)
3. Look at the terminal output for error messages
4. Try the reset and re-import process
