# Steps to Publish to GitHub

## Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `piano-app` (or any name you like)
3. Make it Public or Private
4. **DON'T** check "Initialize with README"
5. Click "Create repository"

## Step 2: Connect and Push (choose one method)

### Method A: In Cursor UI
1. Look for "Publish Branch" button in Source Control
2. Click it
3. Sign in to GitHub if prompted
4. Choose to create new repo or use existing one

### Method B: Using Terminal in Cursor
After creating the repo on GitHub, run:

```bash
cd ~/.cursor/piano-app
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/piano-app.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Step 3: Enable GitHub Pages (to host the app)
1. Go to your repo on GitHub
2. Click "Settings" → "Pages"
3. Under "Source":
   - Branch: `main`
   - Folder: `/ (root)`
4. Click "Save"
5. Your app will be at: `https://YOUR_USERNAME.github.io/piano-app`


