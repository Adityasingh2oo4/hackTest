# 🚀 Deployment Guide — Render + Aiven + Netlify (100% Free)

## Architecture

| Component | Platform | Free Tier |
|-----------|----------|-----------|
| **Frontend** | [Netlify](https://netlify.com) | ✅ 100GB bandwidth, 300 build min/month |
| **Backend** | [Render](https://render.com) | ✅ 750 hrs/month (spins down after 15 min inactivity) |
| **MySQL DB** | [Aiven](https://aiven.io) | ✅ 1GB storage, free forever |

> ⚠️ **Note**: Render free tier spins down after 15 min of inactivity. First request after sleep takes ~30-50 seconds to wake up. This is normal for all free backend hosts.

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

## Step 2 — Create Free MySQL on Aiven

1. Go to [aiven.io](https://aiven.io) → **Sign up** (free, no credit card)
2. Click **Create service** → Choose **MySQL**
3. Select the **Free** plan → pick any region → **Create service**
4. Once running, go to the service → **Overview** tab → **Connection information**
5. Note down these values:

   | Field | Example |
   |-------|---------|
   | **Host** | `mysql-xxxx.aiven.io` |
   | **Port** | `12345` |
   | **User** | `avnadmin` |
   | **Password** | `AVNS_xxxxxxxxxx` |
   | **Database** | `defaultdb` |

6. Your JDBC URL will be:
   ```
   jdbc:mysql://HOST:PORT/DATABASE?sslMode=REQUIRED
   ```

---

## Step 3 — Deploy Backend on Render

1. Go to [render.com](https://render.com) → **Sign up** (free, no credit card)
2. Click **New** → **Web Service** → **Connect a repository** → select your `hackTest` repo
3. Configure:

   | Setting | Value |
   |---------|-------|
   | **Name** | `hacktest-backend` |
   | **Root Directory** | `retail-ordering-backend` |
   | **Runtime** | `Docker` |
   | **Instance Type** | `Free` |

   > 💡 If Render doesn't auto-detect, set **Build Command** and **Start Command** manually (see Step 3b below).

### 3a. If using Docker runtime (Recommended)

Create a `Dockerfile` in `retail-ordering-backend/` (already done if you follow this guide):

The Dockerfile is already configured. Render will auto-build it.

### 3b. If using Native runtime

   | Setting | Value |
   |---------|-------|
   | **Build Command** | `mvn clean package -DskipTests` |
   | **Start Command** | `java -jar target/*.jar` |

### 3c. Add Environment Variables

Go to the **Environment** tab → add these:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `jdbc:mysql://HOST:PORT/DATABASE?sslMode=REQUIRED` (from Aiven) |
| `DATABASE_USERNAME` | `avnadmin` (from Aiven) |
| `DATABASE_PASSWORD` | your Aiven password |
| `JWT_SECRET` | A long random string (min 64 chars). Generate one: `openssl rand -base64 64` |
| `CORS_ALLOWED_ORIGINS` | `*` (update with Netlify domain later) |

4. Click **Deploy**
5. Wait for the build to finish (~5-10 min for first deploy)
6. Note down your Render URL (e.g., `https://hacktest-backend.onrender.com`)

### 3d. Verify Backend

Visit `https://YOUR-RENDER-URL/swagger-ui.html` — you should see the Swagger UI.

---

## Step 4 — Deploy Frontend on Netlify

1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
2. Connect your GitHub account → select the `hackTest` repo
3. Configure:

   | Setting | Value |
   |---------|-------|
   | **Base directory** | `frontend/retail` |
   | **Build command** | `npm run build` |
   | **Publish directory** | `frontend/retail/dist` |

4. Click **Show advanced** → **New variable**:

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://YOUR-RENDER-URL` (NO trailing slash) |

5. Click **Deploy site**
6. Note down your Netlify domain (e.g., `https://hacktest.netlify.app`)

---

## Step 5 — Update CORS on Render

1. Go back to Render → your backend service → **Environment**
2. Update `CORS_ALLOWED_ORIGINS` to your Netlify domain:
   ```
   https://hacktest.netlify.app
   ```
3. Click **Save Changes** → Render will auto-redeploy

---

## ✅ You're Live!

- **Frontend**: `https://hacktest.netlify.app`
- **Backend API**: `https://hacktest-backend.onrender.com`
- **Swagger Docs**: `https://hacktest-backend.onrender.com/swagger-ui.html`

---

## � Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend takes long to respond | Render free tier sleeps after 15 min inactivity — first request takes ~30-50s |
| CORS errors in browser | Ensure `CORS_ALLOWED_ORIGINS` matches your exact Netlify URL (no trailing slash) |
| DB connection refused | Check Aiven requires SSL — make sure `?sslMode=REQUIRED` is in your JDBC URL |
| Frontend 404 on page refresh | `_redirects` file + `netlify.toml` handle this — verify they're in the build |
| Render build fails | Ensure `system.properties` has `java.runtime.version=17` |

---

## Local Development (Still Works!)

No changes needed — env var defaults fall back to `localhost`:

```bash
# Backend (requires MySQL running locally)
cd retail-ordering-backend
mvn spring-boot:run

# Frontend
cd frontend/retail
npm run dev
```
