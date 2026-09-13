# Charco ⚡

> **A modern, clean, minimal, and fully self-hosted web application for real-time character counting and text intelligence.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/pratikshasatpute08/charco?style=social)](https://github.com/pratikshasatpute08/charco)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-brightgreen)](https://pratikshasatpute08.github.io/charco/)
[![WCAG 2.2 AA](https://img.shields.io/badge/Accessibility-WCAG%202.2%20AA-success)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![Dependencies](https://img.shields.io/badge/Dependencies-Zero%20External%20CDN-orange)](#)

---

## 🌟 Overview

**Charco** is an ultra-fast, privacy-first, and accessible text analytics workspace built with standard HTML5, CSS3, and modern Vanilla JavaScript. 

Every asset—including the typography (Inter variable font) and vector icons—is **100% self-hosted inside the repository**. There are **zero external CDN dependencies**, making it immune to third-party outages, trackers, and latency.

It is designed to be hosted directly on **GitHub Pages** straight out of the box with zero build step required.

---

## ✨ Key Features

- ⚡ **Real-Time Keystroke Analytics**: Computes character counts, words, sentences, and lines dynamically as you type with zero lag.
- ⏱️ **Reading & Speaking Time Estimates**:
  - Reading speed calculated at ~225 words/min.
  - Speaking speed calculated at ~130 words/min.
- 🎯 **Target Limit Tracker & Progress Bar**:
  - Presets for popular platforms:
    - **X / Twitter**: 280 characters
    - **SMS / Meta Description**: 160 characters
    - **LinkedIn Post**: 3,000 characters
    - **Instagram Caption**: 2,200 characters
    - **Custom Limit**: Any custom integer target
  - Dynamic visual progress bar with safety states (`Normal` ➔ `85% Warning` ➔ `Over-limit Alert`).
- 🔠 **Smart Case Transformers & Text Tools**:
  - One-click transformation: `UPPERCASE`, `lowercase`, `Title Case`, and `Sentence case`.
  - **Clean Spacing**: Removes trailing whitespaces and collapses redundant line breaks.
  - **One-Click Copy**: Copies text to clipboard with animated toast confirmation and keyboard shortcut (`Ctrl+Shift+C` / `Cmd+Shift+C`).
  - **Safe Clear & Undo**: Clear text with an instant "Undo" option in the toast notification.
- 📊 **Keyword Frequency & Density Drawer**:
  - Live ranking of top keywords, occurrence counts, and percentage density with progress visualization.
- 🌙 **Persistent Theme Engine**:
  - Seamless dark mode and light mode switching with `localStorage` persistence and `prefers-color-scheme` support.
- ♿ **WCAG 2.2 AA Accessibility**:
  - Accessible modal dialog for the creator bio with a strict keyboard focus trap (`Tab`, `Shift+Tab`, `Escape`).
  - Non-intrusive live region (`aria-live="polite"`) for assistive technologies.
  - High-contrast color tokens and clearly visible `:focus-visible` focus rings.
- 📱 **Fully Responsive Layout**:
  - Optimized for mobile, tablet, and desktop viewports.

---

## 🚀 Quick Start (Local Setup)

Because Charco has **zero build dependencies**, you can run it immediately using Python (or any static HTTP server).

### Using Python

Clone the repository and run:

```bash
# Python 3
python -m http.server 8000
```

Open your browser and navigate to:
```
http://localhost:8000
```

### Using Node.js

```bash
npx serve .
```

---

## 🌐 Deploy to GitHub Pages

Charco is pre-configured for GitHub Pages without requiring build tools or dependencies.

### Step 1: Commit and Push with GitHub Desktop
1. Open **GitHub Desktop**.
2. Write a commit message (e.g. `feat: modern width, SEO enhancements, and social media limits guide`).
3. Click **Commit to main** and then **Push origin**.

### Step 2: Enable GitHub Pages
1. Go to your repository on GitHub: [https://github.com/pratikshasatpute08/charco](https://github.com/pratikshasatpute08/charco)
2. Click **Settings** ➔ **Pages** (in the left sidebar).
3. Under **Build and deployment** ➔ **Source**, select **Deploy from a branch**.
4. Set the branch to `main` and the folder to `/(root)`.
5. Click **Save**. Within 1–2 minutes, your web app will be live at:
   ```
   https://pratikshasatpute08.github.io/charco/
   ```

### Step 3: Configure GitHub Repository "About" Section
On your repository's main page on GitHub, click the gear icon ⚙️ next to **About** on the right sidebar and set:
- **Description**: `⚡ Free, fast, and accessible online character counter & real-time word count tool with social media limits, reading times, and zero CDN dependencies.`
- **Website**: `https://pratikshasatpute08.github.io/charco/`
- **Include in the home page**: Check ✅ *Use your GitHub Pages website*
- **Topics**:
  `character-counter` `word-counter` `text-analyzer` `letter-counter` `accessibility` `wcag` `github-pages` `self-hosted` `seo-tool` `pwa` `devops` `javascript`

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd> | Copy text to clipboard |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>K</kbd> | Clear all text |
| <kbd>Escape</kbd> | Close any open modal dialog |

---

## 📁 Project Architecture

```
charco/
├── index.html                 # Semantic, accessible HTML5 entry point
├── manifest.json              # Web App Manifest for PWA readiness
├── LICENSE                    # MIT License
├── README.md                  # Documentation & deployment guide
└── assets/
    ├── css/
    │   ├── reset.css          # Modern CSS reset & base normalization
    │   ├── variables.css      # Design tokens (dark & light color palettes, typography)
    │   └── style.css          # Core layouts, responsive grid, animations
    ├── js/
    │   ├── app.js             # Main orchestrator & UI event handlers
    │   ├── counter.js         # Pure text calculation engine & analytics
    │   └── modal.js           # WCAG 2.2 accessible dialog controller & focus trap
    ├── icons/                 # Self-hosted SVG vector icons
    │   ├── logo.svg           # Brand logo
    │   ├── favicon.svg        # Browser tab favicon
    │   ├── github.svg         # GitHub logo
    │   ├── star.svg           # Star icon
    │   ├── info.svg           # Information/about icon
    │   ├── sun.svg            # Light theme icon
    │   ├── moon.svg           # Dark theme icon
    │   ├── copy.svg           # Copy action icon
    │   ├── check.svg          # Success checkmark
    │   └── trash.svg          # Clear action icon
    └── fonts/
        ├── inter.woff2        # Self-hosted Inter variable web font
        └── fonts.css          # Local @font-face declarations
```

---

## 👩‍💻 About the Creator

Created with ❤️ by **Pratiksha Satpute**

- 🌐 **GitHub**: [@pratikshasatpute08](https://github.com/pratikshasatpute08)
- 🚀 **Focus Areas**: DevOps, AWS Cloud Infrastructure, CI/CD Automation, Linux, and Modern Web Systems.
- ⭐ If you found Charco helpful, please consider [starring the repository](https://github.com/pratikshasatpute08/charco)!

---

## 📄 License

Distributed under the [MIT License](LICENSE). Free for personal and commercial use.
