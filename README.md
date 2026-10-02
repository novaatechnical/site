# NOVAA Group Website

This repository contains the static website for **NOVAA Group Sdn. Bhd.** hosted on **Firebase Hosting** with automated **GitHub Actions** CI/CD.

---

## 🚀 Quick Start (Local Preview)

To preview the website locally on your computer while editing:

First, install the dependencies (only needed once, after cloning). This requires [Node.js](https://nodejs.org/):

```bash
npm install
```

Then start the local server:

```bash
npm run dev
```
* This starts a local server at `http://localhost:3000`.
* It automatically refreshes in your browser whenever you save changes in `public/`.

---

## 🔄 Deployment & Preview Workflow

```
1. Create Branch  ──►  2. Edit & Test Locally  ──►  3. Open Pull Request  ──►  4. Test Preview URL  ──►  5. Merge to Live
```

### Step 1: Create a feature branch
```bash
git checkout -b update/my-changes
```

### Step 2: Make your edits
All HTML, CSS, JavaScript, and images are in the `public/` folder.

### Step 3: Commit and push to GitHub
```bash
git add .
git commit -m "Describe your changes"
git push -u origin update/my-changes
```

### Step 4: Open a Pull Request (PR) & Review Preview
1. Go to [github.com/novaatechnical/site](https://github.com/novaatechnical/site)
2. Click **Compare & pull request**.
3. Within 1–2 minutes, GitHub Actions will generate a temporary **Firebase Preview URL** and comment it on your PR.
4. Open the link to review and test before going live.

### Step 5: Merge to Production
When satisfied with the preview, click **"Merge pull request"** on GitHub. The live production site will update automatically!