# 🆓 100% FREE Deployment Guide (No Paid Features)

This guide uses **only free features** - no paid Shell access needed!

---

## 🎯 Step-by-Step FREE Deployment

### Step 1: Push to GitHub (2 min)

```bash
git init
git add .
git commit -m "Lab Scheduler - Ready for free deployment"
git remote add origin https://github.com/YOUR_USERNAME/lab-scheduler.git
git push -u origin main
```

---

### Step 2: Deploy Backend on Render (FREE)

1. Go to **[render.com](https://render.com)** → Sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `lab-scheduler-backend`
   - **Region**: Oregon (Free)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements_production.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free
5. Click **"Create Web Service"**
6. Wait 5-10 minutes for first deployment

---

### Step 3: Create FREE PostgreSQL Database

1. In Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `lab-scheduler-db`
   - **Database**: `lab_scheduler`
   - **User**: `lab_scheduler_user`
   - **Region**: Oregon
   - **Plan**: **Free**
3. Click **"Create Database"**
4. Copy the **Internal Database URL**

---

### Step 4: Connect Database (FREE Method)

1. Go to your Web Service → **"Environment"** tab
2. Click **"Add Environment Variable"**
3. Add:
   - **Key**: `DATABASE_URL`
   - **Value**: (paste the Internal Database URL from Step 3)
4. Click **"Save Changes"**
5. App will automatically redeploy

---

### Step 5: Initialize Database (100% FREE - 3 Options)

#### **Option A: Automatic (Recommended) ✅**

Your app **auto-initializes** when it starts! No action needed.

**To verify:**
1. Open: `https://your-app.onrender.com/api/health`
2. You should see:
```json
{
  "status": "healthy",
  "database": "connected",
  "data": {
    "students": 0,
    "exams": 0,
    "schedules": 0
  }
}
```

#### **Option B: Browser Initialization (FREE Alternative to Shell) ✅**

1. Visit this URL in your browser:
   ```
   https://your-app.onrender.com/api/init-db
   ```

2. You'll see:
   ```json
   {
     "success": true,
     "message": "✅ Database tables created successfully!",
     "note": "You can now upload students and exams"
   }
   ```

3. Done! Database is ready.

#### **Option C: Use Free Postman/Thunder Client ✅**

1. Download [Postman](https://www.postman.com/downloads/) (free)
2. Send GET request to:
   ```
   https://your-app.onrender.com/api/init-db
   ```
3. Database initialized!

---

### Step 6: Deploy Frontend to Vercel (FREE)

1. **Update API URL** in `frontend/src/api.js`:
   ```javascript
   const API_BASE_URL = 'https://your-app.onrender.com/api';
   ```

2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Update API URL for production"
   git push
   ```

3. **Deploy to Vercel:**
   - Go to **[vercel.com](https://vercel.com)**
   - Sign up with GitHub
   - Click **"New Project"**
   - Select your repository
   - Set **Root Directory**: `frontend`
   - Click **"Deploy"**
   - Done in 30 seconds!

---

## ✅ Verification Checklist (All FREE)

After deployment, test these URLs:

### 1. Backend Health Check
```
https://your-app.onrender.com/
```
Should show: `{"message": "Lab Exam Scheduler API", "status": "running"}`

### 2. Database Health
```
https://your-app.onrender.com/api/health
```
Should show database stats

### 3. Frontend
```
https://your-app.vercel.app
```
Should show your beautiful UI

---

## 📱 Using Your Deployed App (FREE Features)

### Upload Data (FREE - Unlimited)

1. Open `https://your-app.vercel.app`
2. Go to **Students** tab
3. Upload CSV with 100s or 1000s of students
4. Go to **Exams** tab
5. Upload exam data
6. Generate schedules
7. Export PDF/CSV

**All FREE! No limits on data upload through the UI!**

---

## 🔄 How to Update Data Later (FREE)

### Method 1: Through Web UI
- Upload new CSV files anytime
- Delete individual items
- Edit batches
- **100% FREE**

### Method 2: Via API (FREE)
```bash
curl -X POST https://your-app.onrender.com/api/students \
  -H "Content-Type: application/json" \
  -d '{"reg_no":"MES23CS001","name":"Test","branch":"CSE-A","semester":5}'
```

### Method 3: Check Database Stats (FREE)
```
https://your-app.onrender.com/api/health
```

---

## 💰 Cost Summary

| Service | Feature | Cost |
|---------|---------|------|
| Render Backend | 750 hrs/month | **FREE** ✅ |
| Render PostgreSQL | 1 GB storage | **FREE** ✅ |
| Vercel Frontend | Unlimited sites | **FREE** ✅ |
| Database Init | HTTP endpoint | **FREE** ✅ |
| Data Upload | Unlimited via UI | **FREE** ✅ |
| **TOTAL** | | **$0.00** ✅ |

---

## 🎯 Quick Commands Reference (All FREE)

### Check Backend Status
```bash
curl https://your-app.onrender.com/
```

### Initialize Database (Manual)
```bash
curl https://your-app.onrender.com/api/init-db
```

### Check Database Health
```bash
curl https://your-app.onrender.com/api/health
```

### Test Student Upload
```bash
curl -X POST https://your-app.onrender.com/api/students \
  -H "Content-Type: application/json" \
  -d '{"reg_no":"TEST001","name":"Test Student","branch":"CSE-A","semester":5}'
```

---

## 🆘 Troubleshooting (FREE Solutions)

### Database not initialized?
**Solution:** Visit `https://your-app.onrender.com/api/init-db` in browser

### Frontend can't connect?
**Solution:** Verify API URL in `frontend/src/api.js` matches your Render URL

### Data not persisting?
**Solution:** Check `DATABASE_URL` is set in Render environment variables

### App sleeping?
**Solution:** Render free tier sleeps after 15 min of inactivity. First request wakes it up (takes 30 seconds)

---

## 🎉 You're Live!

**Your FREE deployment includes:**
- ✅ Backend API on Render
- ✅ PostgreSQL database (1 GB)
- ✅ Frontend on Vercel
- ✅ Automatic database initialization
- ✅ Unlimited data uploads
- ✅ PDF/CSV exports
- ✅ No paid features required
- ✅ No credit card needed

**Share your link and start scheduling exams! 🚀**

---

## 💡 Pro Tips (All FREE)

1. **Keep your app awake:** Use [UptimeRobot](https://uptimerobot.com) (free) to ping your app every 5 minutes

2. **Custom domain:** Vercel allows free custom domains

3. **Monitor uptime:** Use Render's free monitoring dashboard

4. **Backup data:** Regularly export CSV files through your UI

5. **Update anytime:** Just push to GitHub, Render/Vercel auto-deploys

---

## 📞 Need Help?

All features in this guide are **100% FREE**. No paid Shell access needed!

If you have issues:
1. Check Render logs (free)
2. Visit `/api/health` endpoint
3. Use browser to hit `/api/init-db`
4. All debugging can be done through free HTTP endpoints!

**Happy Scheduling! 🎓**
