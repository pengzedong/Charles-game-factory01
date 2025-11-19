# Vercel Deployment Guide

This project is configured for **complete deployment on Vercel** - both frontend and backend together on a single platform!

## 🚀 Why Vercel for Everything?

- ✅ **Single Platform** - No need to manage separate services
- ✅ **Automatic HTTPS** - SSL certificates included
- ✅ **Global CDN** - Fast delivery worldwide
- ✅ **Zero Configuration** - Works out of the box
- ✅ **Serverless Backend** - Python FastAPI runs as serverless functions
- ✅ **Same Domain** - Frontend and backend on same URL (no CORS issues)
- ✅ **Free Tier** - Generous limits for hobby projects

## 📋 Prerequisites

- GitHub account
- Vercel account (free) - Sign up at [vercel.com](https://vercel.com)
- Git repository with this project

## 🎯 Quick Deploy (Recommended)

### Method 1: Deploy Button

Click this button to deploy in one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/Charles-game-factory01)

### Method 2: Vercel Dashboard

1. **Go to [vercel.com/new](https://vercel.com/new)**

2. **Import your Git repository:**
   - Connect your GitHub account
   - Select this repository
   - Click "Import"

3. **Configure the project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `.` (project root - leave default)
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Output Directory:** `frontend/dist`
   - **Install Command:** `cd frontend && npm install`

4. **Click "Deploy"**

That's it! Vercel will:
- Install Node.js dependencies
- Install Python dependencies (from requirements.txt)
- Build the frontend
- Deploy serverless functions for the backend
- Set up a custom domain

## 🔧 How It Works

### Project Structure

```
Charles-game-factory01/
├── frontend/              # Vite + Phaser game
│   ├── src/
│   ├── public/
│   └── dist/             # Build output (auto-generated)
│
├── backend/              # FastAPI backend code
│   └── backend/
│       ├── main.py       # FastAPI app
│       ├── api/          # Route handlers
│       ├── services/     # Business logic
│       └── models/       # Data models
│
├── api/                  # Vercel serverless functions
│   └── index.py          # Serverless entry point (wraps FastAPI)
│
├── vercel.json          # Vercel configuration
└── requirements.txt     # Python dependencies for serverless functions
```

### URL Structure After Deployment

```
your-app.vercel.app/
├── /                    → Frontend game (Phaser)
├── /index.html          → Main game page
├── /assets/             → Game assets (images, audio)
│
└── /api/               → Backend API (Serverless Functions)
    ├── /api/health             → Health check
    ├── /api/highscores         → Get/Post highscores
    └── /api/rooms              → Room management
```

### Configuration Files

**1. vercel.json** - Main deployment configuration
```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/index.py" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**2. api/index.py** - Serverless function entry point
```python
from backend.backend.main import app
from mangum import Mangum

handler = Mangum(app, lifespan="off")
```

**3. requirements.txt** - Python dependencies
```
mangum==0.17.0
fastapi==0.109.0
pydantic==2.5.3
```

## 🌐 Accessing Your Deployed App

After deployment, you'll get a URL like:
```
https://your-project-name.vercel.app
```

**Frontend:**
- Visit `https://your-project-name.vercel.app`
- Play the game immediately!

**Backend API:**
- Health check: `https://your-project-name.vercel.app/api/health`
- Interactive docs: `https://your-project-name.vercel.app/api/docs`
- Highscores: `https://your-project-name.vercel.app/api/highscores`

## 🔄 Continuous Deployment

Vercel automatically redeploys when you push to your repository:

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update game features"
   git push
   ```
3. Vercel automatically detects the push
4. Builds and deploys the new version
5. Your app is live in ~1 minute!

**Preview Deployments:**
- Every pull request gets its own preview URL
- Test changes before merging
- Perfect for collaboration

## 🎮 Testing Your Deployment

### Frontend Tests

```bash
# Local testing before deployment
cd frontend
npm test

# Build to verify it works
npm run build
npm run preview
```

### Backend Tests

```bash
# Run backend tests
cd backend
pytest

# Test locally with uvicorn
uvicorn backend.main:app --reload
```

### Integration Test

Once deployed, test the integration:

```bash
# Health check
curl https://your-app.vercel.app/api/health

# Submit a test score
curl -X POST https://your-app.vercel.app/api/highscores \
  -H "Content-Type: application/json" \
  -d '{"playerName": "TestPlayer", "score": 1000}'

# Get highscores
curl https://your-app.vercel.app/api/highscores?limit=5
```

## 🛠 Advanced Configuration

### Environment Variables

If you need environment variables:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add variables like:
   - `PYTHON_VERSION` = `3.9`
   - `NODE_VERSION` = `20.x`

### Custom Domain

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain (e.g., `keydash.com`)
3. Update DNS records as instructed
4. Vercel automatically provisions SSL certificate

### Monitoring & Logs

**View logs:**
1. Go to Vercel Dashboard → Your Project
2. Click on a deployment
3. View "Function Logs" for backend
4. View "Build Logs" for deployment details

**Analytics:**
- Vercel provides built-in analytics
- View in Dashboard → Your Project → Analytics
- See page views, performance metrics, etc.

## 📊 Resource Limits (Free Tier)

Vercel's free tier includes:
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ 100 GB-hours serverless function execution
- ✅ Automatic SSL
- ✅ DDoS protection
- ✅ Global CDN

This is **more than enough** for:
- Personal projects
- Portfolios
- Class demonstrations
- Small games with moderate traffic

## 🐛 Troubleshooting

### Build Fails

**Problem:** "Build failed" error

**Solutions:**
1. Check build logs in Vercel dashboard
2. Verify package.json scripts are correct
3. Test build locally: `cd frontend && npm run build`
4. Check Node.js version compatibility

### API Not Working

**Problem:** `/api/*` returns 404 or errors

**Solutions:**
1. Verify `api/index.py` exists in project root
2. Check `requirements.txt` includes `mangum`
3. View function logs in Vercel dashboard
4. Test backend locally first: `uvicorn backend.main:app --reload`

### CORS Errors

**Problem:** Frontend can't connect to backend

**Solutions:**
- **Good news:** This shouldn't happen with Vercel!
- Both frontend and backend are on same domain
- No CORS configuration needed
- If you see CORS errors, verify you're using relative URLs (`/api/*`) not absolute URLs

### Deployment Timeout

**Problem:** Deployment takes too long and times out

**Solutions:**
1. Reduce `node_modules` size by removing unused dependencies
2. Use `npm ci` instead of `npm install` in build command
3. Check for large files in repository (use `.gitignore`)

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Python Runtime](https://vercel.com/docs/functions/serverless-functions/runtimes/python)
- [Deploying FastAPI on Vercel](https://vercel.com/guides/deploying-fastapi-with-vercel)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)

## 🎉 Next Steps After Deployment

1. **Test Everything:**
   - Play through the game
   - Submit a highscore
   - Verify it appears in the leaderboard

2. **Share Your Game:**
   - Send the Vercel URL to friends
   - Add it to your portfolio
   - Share on social media

3. **Set Up Custom Domain (Optional):**
   - Buy a domain (e.g., from Namecheap, Google Domains)
   - Connect it in Vercel settings
   - Get `https://yourgame.com` instead of `.vercel.app`

4. **Monitor Performance:**
   - Check Vercel Analytics
   - Monitor serverless function execution times
   - Optimize if needed

## 🚀 Deploy Now!

Ready to deploy? Just:

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Click Deploy

Your game will be live in under 2 minutes! 🎮

---

**Questions?** Check the [Vercel support docs](https://vercel.com/support) or open an issue in this repository.
