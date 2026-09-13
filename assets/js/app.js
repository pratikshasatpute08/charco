/**
 * Charco - Main Application Controller
 */

import { analyzeText } from './counter.js';
import { AccessibleModal } from './modal.js';

class CharcoApp {
  constructor() {
    // DOM Elements
    this.textarea = document.getElementById('text-input');
    this.heroChars = document.getElementById('stat-chars-hero');
    this.heroCharsNoSpaces = document.getElementById('stat-chars-no-spaces-hero');
    this.statWords = document.getElementById('stat-words');
    this.statSentences = document.getElementById('stat-sentences');
    this.statParagraphs = document.getElementById('stat-paragraphs');
    this.statLines = document.getElementById('stat-lines');
    this.statReadingTime = document.getElementById('stat-reading-time');
    this.statSpeakingTime = document.getElementById('stat-speaking-time');
    this.statAvgWordLength = document.getElementById('stat-avg-word-length');

    // Target Limit Elements
    this.targetSelect = document.getElementById('target-select');
    this.customLimitInput = document.getElementById('custom-limit-input');
    this.progressContainer = document.getElementById('progress-container');
    this.progressBar = document.getElementById('progress-bar');
    this.limitFeedback = document.getElementById('limit-feedback');

    // Density Drawer Elements
    this.insightsHeader = document.getElementById('insights-header');
    this.insightsContent = document.getElementById('insights-content');
    this.insightsToggleIcon = document.getElementById('insights-toggle-icon');
    this.densityList = document.getElementById('density-list');

    // Theme Toggle
    this.themeToggleBtn = document.getElementById('theme-toggle-btn');
    this.themeIcon = document.getElementById('theme-icon');

    // Toast Container
    this.toastContainer = document.getElementById('toast-container');

    // State
    this.currentLimit = 0;
    this.undoBuffer = '';
    this.isUpdating = false;

    this.init();
  }

  init() {
    // Initialize Theme
    this.initTheme();

    // Initialize Accessible Modal for "About Pratiksha"
    this.aboutModal = new AccessibleModal('about-modal-backdrop', '.btn-about-trigger');

    // Bind Event Listeners
    this.bindEvents();

    // Initial calculation
    this.updateStats();
  }

  bindEvents() {
    // Realtime input listener
    this.textarea.addEventListener('input', () => this.scheduleUpdate());

    // Target limit change
    this.targetSelect.addEventListener('change', (e) => this.handleTargetChange(e.target.value));
    this.customLimitInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      this.currentLimit = isNaN(val) || val <= 0 ? 0 : val;
      this.scheduleUpdate();
    });

    // Theme toggle
    this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());

    // Insights toggle accordion
    if (this.insightsHeader) {
      this.insightsHeader.addEventListener('click', () => this.toggleInsights());
      this.insightsHeader.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleInsights();
        }
      });
    }

    // Action Toolbar buttons
    document.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = btn.getAttribute('data-action');
        this.handleAction(action);
      });
    });

    // Global Keyboard Shortcuts
    document.addEventListener('keydown', (e) => this.handleShortcuts(e));
  }

  scheduleUpdate() {
    if (this.isUpdating) return;
    this.isUpdating = true;
    window.requestAnimationFrame(() => {
      this.updateStats();
      this.isUpdating = false;
    });
  }

  updateStats() {
    const text = this.textarea.value;
    const metrics = analyzeText(text);

    // Update Hero and Primary Stats
    if (this.heroChars) this.heroChars.textContent = metrics.characters.toLocaleString();
    if (this.heroCharsNoSpaces) this.heroCharsNoSpaces.textContent = metrics.charactersNoSpaces.toLocaleString();
    if (this.statWords) this.statWords.textContent = metrics.words.toLocaleString();
    if (this.statSentences) this.statSentences.textContent = metrics.sentences.toLocaleString();
    if (this.statParagraphs) this.statParagraphs.textContent = metrics.paragraphs.toLocaleString();
    if (this.statLines) this.statLines.textContent = metrics.lines.toLocaleString();
    if (this.statReadingTime) this.statReadingTime.textContent = metrics.readingTime;
    if (this.statSpeakingTime) this.statSpeakingTime.textContent = metrics.speakingTime;
    if (this.statAvgWordLength) this.statAvgWordLength.textContent = `${metrics.avgWordLength} chars`;

    // Target Limit Progress Calculation
    this.updateLimitProgress(metrics.characters);

    // Keyword Density Breakdown
    this.updateKeywordDensity(metrics.keywordDensity, metrics.words);
  }

  handleTargetChange(val) {
    if (val === 'custom') {
      this.customLimitInput.style.display = 'inline-block';
      this.customLimitInput.focus();
      const customVal = parseInt(this.customLimitInput.value, 10);
      this.currentLimit = isNaN(customVal) || customVal <= 0 ? 0 : customVal;
    } else {
      this.customLimitInput.style.display = 'none';
      this.currentLimit = parseInt(val, 10) || 0;
    }
    this.scheduleUpdate();
  }

  updateLimitProgress(currentChars) {
    if (!this.currentLimit || this.currentLimit <= 0) {
      this.progressContainer.classList.remove('active');
      this.limitFeedback.classList.remove('active', 'over-limit');
      return;
    }

    this.progressContainer.classList.add('active');
    this.limitFeedback.classList.add('active');

    const percentage = Math.min(100, Math.round((currentChars / this.currentLimit) * 100));
    const remaining = this.currentLimit - currentChars;

    this.progressBar.style.width = `${Math.min(100, (currentChars / this.currentLimit) * 100)}%`;

    this.progressBar.classList.remove('warning', 'danger');
    this.limitFeedback.classList.remove('over-limit');

    if (remaining < 0) {
      this.progressBar.classList.add('danger');
      this.limitFeedback.classList.add('over-limit');
      this.limitFeedback.textContent = `${Math.abs(remaining).toLocaleString()} characters over limit!`;
    } else if (remaining === 0) {
      this.progressBar.classList.add('warning');
      this.limitFeedback.textContent = 'Character limit reached.';
    } else {
      if (percentage >= 85) {
        this.progressBar.classList.add('warning');
      }
      this.limitFeedback.textContent = `${remaining.toLocaleString()} characters left (${percentage}%)`;
    }
  }

  updateKeywordDensity(keywords, totalWords) {
    if (!this.densityList) return;

    if (!keywords || keywords.length === 0 || totalWords === 0) {
      this.densityList.innerHTML = '<div style="color: var(--text-tertiary); font-size: 0.85rem; padding: 8px 0;">Start typing to see keyword density insights...</div>';
      return;
    }

    this.densityList.innerHTML = keywords.map(item => `
      <div class="density-item">
        <span class="density-word">${this.escapeHtml(item.word)}</span>
        <div class="density-stats">
          <span>${item.count} &times; (${item.percentage}%)</span>
          <div class="density-bar-bg" aria-hidden="true">
            <div class="density-bar-fill" style="width: ${Math.min(100, item.percentage * 4)}%"></div>
          </div>
        </div>
      </div>
    `).join('');
  }

  toggleInsights() {
    const isHidden = this.insightsContent.style.display === 'none';
    this.insightsContent.style.display = isHidden ? 'flex' : 'none';
    this.insightsHeader.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    if (this.insightsToggleIcon) {
      this.insightsToggleIcon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
    }
  }

  handleAction(action) {
    const current = this.textarea.value;

    switch (action) {
      case 'copy':
        if (!current) {
          this.showToast('Nothing to copy!', 'info');
          return;
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(current)
            .then(() => this.showToast('Copied text to clipboard!'))
            .catch(() => this.fallbackCopy(current));
        } else {
          this.fallbackCopy(current);
        }
        break;

      case 'clear':
        if (!current) return;
        this.undoBuffer = current;
        this.textarea.value = '';
        this.scheduleUpdate();
        this.showToast('Text cleared', 'info', true);
        break;

      case 'undo':
        if (this.undoBuffer) {
          this.textarea.value = this.undoBuffer;
          this.undoBuffer = '';
          this.scheduleUpdate();
          this.showToast('Restored previous text');
        }
        break;

      case 'uppercase':
        if (!current) return;
        this.textarea.value = current.toUpperCase();
        this.scheduleUpdate();
        this.showToast('Converted to UPPERCASE');
        break;

      case 'lowercase':
        if (!current) return;
        this.textarea.value = current.toLowerCase();
        this.scheduleUpdate();
        this.showToast('Converted to lowercase');
        break;

      case 'titlecase':
        if (!current) return;
        this.textarea.value = current.replace(/\b\w+/g, txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
        this.scheduleUpdate();
        this.showToast('Converted to Title Case');
        break;

      case 'sentencecase':
        if (!current) return;
        this.textarea.value = current.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        this.scheduleUpdate();
        this.showToast('Converted to Sentence case');
        break;

      case 'clean-whitespace':
        if (!current) return;
        this.textarea.value = current
          .replace(/[ \t]+$/gm, '') // remove trailing spaces per line
          .replace(/\n{3,}/g, '\n\n') // collapse multiple blank lines
          .trim();
        this.scheduleUpdate();
        this.showToast('Cleaned whitespace');
        break;

      case 'sample':
        this.textarea.value = `Charco is a high-performance, accessible, and self-hosted text analytics application.\n\nDesigned for developers, DevOps engineers, content creators, and writers, Charco computes exact character counts, word statistics, speaking times, and keyword density in real-time as you type.\n\nWith zero external CDN dependencies, dark mode persistence, and WCAG 2.2 AA accessibility, it delivers an uncompromising experience across desktop, tablet, and mobile devices.`;
        this.scheduleUpdate();
        this.showToast('Loaded sample text');
        break;
    }
  }

  fallbackCopy(text) {
    try {
      this.textarea.select();
      document.execCommand('copy');
      this.showToast('Copied text to clipboard!');
    } catch (e) {
      this.showToast('Failed to copy', 'error');
    }
  }

  showToast(message, type = 'success', hasUndo = false) {
    if (!this.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    const iconSrc = type === 'success' ? 'assets/icons/check.svg' : 'assets/icons/info.svg';

    toast.innerHTML = `
      <img src="${iconSrc}" class="toast-icon" alt="" aria-hidden="true" />
      <span>${this.escapeHtml(message)}</span>
      ${hasUndo ? '<button type="button" class="tool-btn" style="padding: 2px 8px; margin-left: 8px; font-size: 0.75rem;" id="toast-undo-btn">Undo</button>' : ''}
    `;

    this.toastContainer.appendChild(toast);

    if (hasUndo) {
      const undoBtn = toast.querySelector('#toast-undo-btn');
      if (undoBtn) {
        undoBtn.addEventListener('click', () => {
          this.handleAction('undo');
          toast.remove();
        });
      }
    }

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, hasUndo ? 5000 : 2500);
  }

  handleShortcuts(e) {
    // Ctrl + Shift + C -> Copy
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
      e.preventDefault();
      this.handleAction('copy');
    }
    // Ctrl + Shift + K -> Clear
    else if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'K' || e.key === 'k')) {
      e.preventDefault();
      this.handleAction('clear');
    }
  }

  initTheme() {
    const savedTheme = localStorage.getItem('charco_theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    this.applyTheme(initialTheme);
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    this.applyTheme(next);
    localStorage.setItem('charco_theme', next);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (this.themeIcon) {
      this.themeIcon.src = theme === 'dark' ? 'assets/icons/sun.svg' : 'assets/icons/moon.svg';
      this.themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      this.themeToggleBtn.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Bootstrap once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.charcoApp = new CharcoApp();
});
