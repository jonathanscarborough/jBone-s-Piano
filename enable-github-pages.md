# Enable GitHub Pages - Quick Steps

## Option 1: Web Interface (Easiest)

1. **Go to your repository:**
   https://github.com/jonathanscarborough/jBone-s-Piano

2. **Click "Settings"** (top right of the repo page)

3. **Click "Pages"** (left sidebar, under "Code and automation")

4. **Configure Pages:**
   - **Source**: Select "Deploy from a branch"
   - **Branch**: Select `main`
   - **Folder**: Select `/ (root)`
   - Click **"Save"**

5. **Wait 1-2 minutes** for GitHub to build your site

6. **Your piano app will be live at:**
   `https://jonathanscarborough.github.io/jBone-s-Piano/`

## Option 2: Using GitHub CLI (if installed)

```bash
gh repo edit jonathanscarborough/jBone-s-Piano --enable-pages --pages-branch main --pages-source /
```

## Verify It's Working

After enabling Pages:
1. Go back to your repo → Settings → Pages
2. You should see a green checkmark and your URL
3. Visit the URL in your browser (may take a minute or two to appear)

## Notes

- The site will update automatically when you push new changes to `main`
- Custom domain can be added later in Settings → Pages if desired
- Your `index.html` file will be served as the main page

