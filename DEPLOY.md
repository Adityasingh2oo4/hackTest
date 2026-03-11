# 🚀 Deployment Guide — Railway (Backend + MySQL) + Netlify (Frontend)

## Prerequisites

- A **GitHub account** with this repo pushed
- A free **Railway** account → [railway.app](https://railway.app)
- A free **Netlify** account → [netlify.com](https://netlify.com)

---

## Step 1 — Push Code to GitHub

```bash
cd hackTest
git add .
git commit -m "Prepare for deployment"
git remote add origin https://github.com/YOUR_USERNAME/hackTest.git
git branch -M main
git push -u origin main
```

---

## Step 2 — Deploy Backend + MySQL on Railway

### 2a. Create a MySQL Database

1. Go to [railway.app](https://railway.app) → **New Project** → **Provision MySQL**
2. Click the MySQL service → **Variables** tab → **Connect** tab
3. Note down these values:
   - `MYSQL_HOST`
   - `MYSQL_PORT`
   - `MYSQL_USER` (usually `root`)
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE` (usually `railway`)

### 2b. Deploy the Spring Boot Backend

1. In the same Railway project → **New** → **GitHub Repo** → select your `hackTest` repo
2. Go to **Settings** and set:
   - **Root Directory**: `retail-ordering-backend`
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/*.jar`
3. Go to the **Variables** tab and add these:

   | Variable | Value |
   |----------|-------|
   | `DATABASE_URL` | `jdbc:mysql://MYSQL_HOST:MYSQL_PORT/MYSQL_DATABASE` |
   | `DATABASE_USERNAME` | `root` (from MySQL service) |
   | `DATABASE_PASSWORD` | (from MySQL service) |
   | `JWT_SECRET` | A long random string (min 64 chars) |
   | `CORS_ALLOWED_ORIGINS` | `*` (update with Netlify domain later) |

   > 💡 **Tip**: You can use Railway's internal networking for the DB URL.  
   > Go to MySQL service → **Connect** → copy the **Private** JDBC URL, it looks like:  
   > `jdbc:mysql://mysql.railway.internal:3306/railway`

4. Go to **Settings** → **Networking** → **Generate Domain**
5. Note down your backend URL (e.g., `https://hacktest-production.up.railway.app`)

### 2c. Verify Backend

Visit `https://YOUR-RAILWAY-URL/swagger-ui.html` — you should see the Swagger UI.

---

## Step 3 — Deploy Frontend on Netlify

### Option A: Deploy via Netlify UI (Recommended)

1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
2. Connect your GitHub account → select the `hackTest` repo
3. Configure build settings:
   - **Base directory**: `frontend/retail`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/retail/dist`
4. Click **Show advanced** → **New variable** → add:

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://YOUR-RAILWAY-URL` (NO trailing slash) |

5. Click **Deploy site**
6. Note down your Netlify domain (e.g., `https://hacktest.netlify.app`)
7. *(Optional)* Go to **Site configuration** → **Domain management** → set a custom subdomain

### Option B: Deploy via Netlify CLI

```bash
# Install CLI
npm install -g netlify-cli

# Login
netlify login

# Navigate to frontend
cd frontend/retail

# Build
npm run build

# Deploy (follow the prompts)
netlify deploy --prod --dir=dist
```

---

## Step 4 — Update CORS on Railway

1. Go back to your Railway backend service → **Variables**
2. Update `CORS_ALLOWED_ORIGINS` to your Netlify domain:
   ```
   https://hacktest.netlify.app
   ```
3. Railway will auto-redeploy

---

## ✅ You're Live!

- **Frontend**: `https://hacktest.netlify.app`
- **Backend API**: `https://hacktest-production.up.railway.app`
- **Swagger Docs**: `https://hacktest-production.up.railway.app/swagger-ui.html`

---

## 💰 Free Tier Limits

| Service | Free Tier |
|---------|-----------|
| **Railway** | $5 free credit/month (enough for small apps) |
| **Netlify** | 100GB bandwidth, 300 build min/month |

> ⚠️ Railway's free credit refreshes monthly. For a low-traffic app, $5 is usually enough to cover both the backend + MySQL.

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors in browser | Ensure `CORS_ALLOWED_ORIGINS` on Railway matches your exact Netlify URL |
| Frontend shows blank page | Check that `VITE_API_URL` is set correctly (no trailing slash) |
| Backend fails to start | Check Railway logs — likely a DB connection issue, verify `DATABASE_URL` |
| 404 on page refresh | The `_redirects` file and `netlify.toml` should handle this — verify they're in the build |

---

## Local Development (Still Works!)

No changes needed — environment variable defaults fall back to `localhost`:

```bash
# Backend (requires MySQL running locally)
cd retail-ordering-backend
mvn spring-boot:run

# Frontend
cd frontend/retail
npm run dev
```
