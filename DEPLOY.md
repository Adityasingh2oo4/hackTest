# 🚀 Deployment Guide — Railway (Backend + MySQL) + Netlify (Frontend)

---

## STEP 1: Push Your Code to GitHub

> Skip this if your repo is already up to date on GitHub.

```bash
cd c:\Users\lenovo\Desktop\hackTest
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

## STEP 2: Create a New Railway Account

1. Open [railway.app](https://railway.app) in your browser
2. Click **Login** → Sign up with a **new GitHub account** or **new email**
3. You'll get **$5 free credit/month** automatically

---

## STEP 3: Create a New Project on Railway

1. Once logged in, click the **"New Project"** button (top right)
2. Select **"Provision MySQL"**
3. Railway will create a MySQL database instantly
4. You'll see a MySQL service card on your project dashboard

---

## STEP 4: Get Your MySQL Credentials

1. Click on the **MySQL service** card
2. Go to the **"Variables"** tab
3. You'll see variables like:
   - `MYSQLHOST` → e.g. `roundhouse.proxy.rlwy.net`
   - `MYSQLPORT` → e.g. `39281`
   - `MYSQLDATABASE` → e.g. `railway`
   - `MYSQLUSER` → e.g. `root`
   - `MYSQLPASSWORD` → e.g. `aBcDeFgHiJ`
4. **Keep this tab open** — you'll need these values in the next step

---

## STEP 5: Deploy Your Spring Boot Backend

1. Go back to your project dashboard (click the project name at the top)
2. Click **"New"** → **"GitHub Repo"**
3. Connect your GitHub account if prompted → select your **`hackTest`** repo
4. Railway will create a new service. Click on it.

### 5a. Set the Root Directory

1. Go to **"Settings"** tab
2. Scroll to **"Source"** section
3. Set **Root Directory** to:
   ```
   retail-ordering-backend
   ```
4. Click **checkmark** to save

### 5b. Add Environment Variables

1. Go to the **"Variables"** tab
2. Click **"New Variable"** and add these one by one:

   | KEY | VALUE |
   |-----|-------|
   | `DATABASE_URL` | `jdbc:mysql://MYSQLHOST:MYSQLPORT/MYSQLDATABASE` |
   | `DATABASE_USERNAME` | *(paste MYSQLUSER value from Step 4)* |
   | `DATABASE_PASSWORD` | *(paste MYSQLPASSWORD value from Step 4)* |
   | `JWT_SECRET` | `2511270772851830936318881809221091761410363659830625299042999860802527020670` |
   | `CORS_ALLOWED_ORIGINS` | `*` |

   > ⚠️ **IMPORTANT for DATABASE_URL**: Replace `MYSQLHOST`, `MYSQLPORT`, and `MYSQLDATABASE` with the **actual values** from Step 4.
   >
   > Example: `jdbc:mysql://roundhouse.proxy.rlwy.net:39281/railway`

   > 💡 **Shortcut**: You can also use Railway's variable references:
   > `jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}`

### 5c. Generate a Public URL

1. Go to the **"Settings"** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"**
4. You'll get a URL like: `https://hacktest-production.up.railway.app`
5. **Copy this URL** — you need it for the frontend

### 5d. Deploy

1. Railway should auto-deploy. If not, go to **"Deployments"** tab → **"Deploy"**
2. Watch the build logs — it will take **5-10 minutes** for the first build
3. Once you see `Started RetailOrderingBackendApplication`, it's working! ✅

### 5e. Verify Backend

Open in your browser:
```
https://YOUR-RAILWAY-URL/swagger-ui.html
```
You should see the Swagger API documentation page.

---

## STEP 6: Deploy Frontend on Netlify

1. Open [app.netlify.com](https://app.netlify.com)
2. Sign up / Log in (free, use your GitHub account)
3. Click **"Add new site"** → **"Import an existing project"**
4. Click **"Deploy with GitHub"** → select your **`hackTest`** repo

### 6a. Configure Build Settings

| Setting | Value |
|---------|-------|
| **Base directory** | `frontend/retail` |
| **Build command** | `npm run build` |
| **Publish directory** | `frontend/retail/dist` |

### 6b. Add Environment Variable

1. Click **"Show advanced"** → **"New variable"**
2. Add:

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://YOUR-RAILWAY-URL` *(from Step 5c, NO trailing slash)* |

### 6c. Deploy

1. Click **"Deploy site"**
2. Wait for build to complete (~1-2 minutes)
3. Your site will be live at something like: `https://random-name-123.netlify.app`
4. *(Optional)* Go to **Site settings** → **Domain management** → **Edit site name** to customize it

---

## STEP 7: Update CORS (Final Step!)

1. Go back to **Railway** → your backend service → **"Variables"** tab
2. Update `CORS_ALLOWED_ORIGINS` from `*` to your **exact Netlify URL**:
   ```
   https://your-site-name.netlify.app
   ```
3. Railway will auto-redeploy

---

## ✅ Done! Your App is Live!

| Component | URL |
|-----------|-----|
| **Frontend** | `https://your-site-name.netlify.app` |
| **Backend API** | `https://your-app.up.railway.app` |
| **Swagger Docs** | `https://your-app.up.railway.app/swagger-ui.html` |

---

## 🔧 Troubleshooting

| Problem | Fix |
|---------|-----|
| Backend build fails | Check Railway logs → likely a `pom.xml` or Java version issue |
| CORS errors in browser | Make sure `CORS_ALLOWED_ORIGINS` matches your exact Netlify URL |
| Frontend API calls fail | Verify `VITE_API_URL` has no trailing slash and is the correct Railway URL |
| 404 on page refresh | Ensure `_redirects` file exists in `public/` folder |
| DB connection error | Double-check `DATABASE_URL` format: `jdbc:mysql://host:port/database` |

---

## Local Development (Still Works!)

```bash
# Backend (needs local MySQL)
cd retail-ordering-backend
mvn spring-boot:run

# Frontend
cd frontend/retail
npm run dev
```
