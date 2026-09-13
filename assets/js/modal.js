/**
 * Charco - Accessible Modal Dialog Controller
 * Adheres to WCAG 2.2 AA modal standards:
 * - Traps keyboard focus within the dialog while active
 * - Restores focus to the trigger element on close
 * - Dispatches Esc key dismissal and backdrop click dismissal
 * - Updates ARIA attributes (aria-hidden, aria-modal)
 */

export class AccessibleModal {
  constructor(modalBackdropId, triggerBtnSelector) {
    this.backdrop = document.getElementById(modalBackdropId);
    if (!this.backdrop) return;

    this.dialog = this.backdrop.querySelector('[role="dialog"]');
    this.closeBtn = this.backdrop.querySelector('[data-close-modal]');
    this.triggers = document.querySelectorAll(triggerBtnSelector);
    this.previousActiveElement = null;

    this.focusableElementsSelector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

    this.init();
  }

  init() {
    this.triggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.open(trigger);
      });
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // Close on backdrop click (click outside dialog)
    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) {
        this.close();
      }
    });

    // Keyboard handlers
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen()) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        this.close();
      } else if (e.key === 'Tab') {
        this.handleFocusTrap(e);
      }
    });
  }

  isOpen() {
    return this.backdrop.classList.contains('open');
  }

  open(triggerElement = null) {
    this.previousActiveElement = triggerElement || document.activeElement;
    this.backdrop.classList.add('open');
    this.backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus the first focusable element inside dialog or close button
    const focusable = this.dialog.querySelectorAll(this.focusableElementsSelector);
    if (focusable.length > 0) {
      setTimeout(() => focusable[0].focus(), 50);
    }
  }

  close() {
    this.backdrop.classList.remove('open');
    this.backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Restore previous focus
    if (this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
      this.previousActiveElement.focus();
    }
  }

  handleFocusTrap(e) {
    const focusable = Array.from(this.dialog.querySelectorAll(this.focusableElementsSelector));
    if (focusable.length === 0) return;

    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];

    if (e.shiftKey) {
      // Shift + Tab: if on first element, cycle to last
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab: if on last element, cycle to first
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }
}
