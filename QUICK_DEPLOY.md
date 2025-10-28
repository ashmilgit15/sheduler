# ⚡ Quick Deployment Guide (5 Minutes)

## 🎯 Fastest Way to Deploy with PostgreSQL

### Step 1: Push to GitHub (2 min)
```bash
git init
git add .
git commit -m "Lab Scheduler ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/lab-scheduler.git
git push -u origin main
```

### Step 2: Deploy Backend on Render (2 min)

1. Go to **[render.com](https://render.com)** → Sign up with GitHub
2. Click **"New +"** → **"Blueprint"**
3. Connect your repository
4. Render will auto-detect `render.yaml` and create:
   - ✅ PostgreSQL database (free)
   - ✅ Web service (free)
5. Wait 5 minutes for deployment
6. Copy your backend URL: `https://your-app.onrender.com`

### Step 3: Deploy Frontend on Vercel (1 min)

1. **Update API URL** in `frontend/src/api.js`:
```javascript
const API_BASE_URL = 'https://your-app.onrender.com/api';
```

2. Commit and push:
```bash
git add .
git commit -m "Update API URL"
git push
```

3. Go to **[vercel.com](https://vercel.com)** → Sign up with GitHub
4. Click **"New Project"** → Select your repo
5. Set **Root Directory**: `frontend`
6. Click **"Deploy"**
7. Done! Your app is live in 30 seconds

---

## ✅ That's It!

Your app is now live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.onrender.com`

---

## 🔄 After First Deployment

### Initialize Database (One-time)

Go to Render Dashboard → Your Web Service → **Shell** tab:

```bash
python init_production_db.py
```

---

## 📱 Using Your Deployed App

1. Open your Vercel URL
2. Upload your students CSV
3. Upload your exams CSV
4. Generate schedules
5. Export and share!

---

## 💰 Cost

**100% FREE** with:
- Render Free Tier: 750 hours/month
- Vercel Free Tier: Unlimited hobby projects
- PostgreSQL: 1GB storage free

---

## 🆘 Issues?

**Backend not responding?**
- Wait 5-10 min for first deployment
- Check Render logs

**Frontend can't connect?**
- Verify API URL in `api.js` matches your Render URL
- Make sure it ends with `/api`

**Database error?**
- Run `python init_production_db.py` in Render Shell

---

## 📚 Need More Details?

See **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for complete instructions.

---

## 🎉 Success!

Your Lab Exam Scheduler is now:
- ✅ Live on the internet
- ✅ Using PostgreSQL database
- ✅ Accessible from anywhere
- ✅ Data persists forever
- ✅ Can handle multiple users
- ✅ Completely FREE!

Share the link and start scheduling! 🚀
