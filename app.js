/**
 * Multi-Step Form - Application Logic & State Management
 */

(function () {
  'use strict';

  // --- State Model ---
  const state = {
    currentStep: 1,
    maxSteps: 4,
    formData: {
      name: '',
      email: '',
      phone: '',
      plan: 'arcade',
      billingCycle: 'monthly', // 'monthly' | 'yearly'
      addons: []
    }
  };

  // --- DOM References ---
  const form = document.getElementById('multiStepForm');
  const stepPanes = document.querySelectorAll('.step-pane');
  const stepNavItems = document.querySelectorAll('.step-nav-item');
  const planCards = document.querySelectorAll('.plan-card');
  const billingToggle = document.getElementById('billingCycleToggle');
  const addonCards = document.querySelectorAll('.addon-card');
  const btnChangePlan = document.getElementById('btnChangePlan');

  // Input references
  const nameInput = document.getElementById('nameInput');
  const emailInput = document.getElementById('emailInput');
  const phoneInput = document.getElementById('phoneInput');

  // --- Navigation & Pane Switching ---
  function goToStep(stepIndex) {
    if (stepIndex < 1 || stepIndex > 5) return;

    state.currentStep = stepIndex;

    // Update Step Panes
    stepPanes.forEach(pane => {
      const paneStep = parseInt(pane.dataset.step, 10);
      if (paneStep === stepIndex) {
        pane.removeAttribute('hidden');
        pane.classList.add('active');

        // Accessible Focus Management: focus heading on step change
        const heading = pane.querySelector('.step-heading, .thank-you-heading');
        if (heading) {
          heading.setAttribute('tabindex', '-1');
          heading.focus();
        }
      } else {
        pane.setAttribute('hidden', '');
        pane.classList.remove('active');
      }
    });

    // Update Sidebar Indicators (Steps 1-4)
    stepNavItems.forEach(item => {
      const indicatorStep = parseInt(item.dataset.stepIndicator, 10);
      const isCurrent = indicatorStep === (stepIndex === 5 ? 4 : stepIndex);
      item.classList.toggle('active', isCurrent);

      const badge = item.querySelector('.step-badge');
      if (badge) {
        if (isCurrent) {
          badge.setAttribute('aria-current', 'step');
        } else {
          badge.removeAttribute('aria-current');
        }
      }
    });
  }

  // --- Plan Card Selection ---
  function initPlanSelection() {
    planCards.forEach(card => {
      const radio = card.querySelector('input[type="radio"]');

      card.addEventListener('click', () => {
        planCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        if (radio) {
          radio.checked = true;
          state.formData.plan = radio.value;
        }
      });
    });
  }

  // --- Billing Cycle Toggle ---
  function initBillingToggle() {
    if (!billingToggle) return;

    billingToggle.addEventListener('change', (e) => {
      const isYearly = e.target.checked;
      state.formData.billingCycle = isYearly ? 'yearly' : 'monthly';
      billingToggle.setAttribute('aria-checked', String(isYearly));

      const monthlyLabel = document.getElementById('label-monthly');
      const yearlyLabel = document.getElementById('label-yearly');

      if (monthlyLabel && yearlyLabel) {
        monthlyLabel.classList.toggle('active', !isYearly);
        yearlyLabel.classList.toggle('active', isYearly);
      }
    });
  }

  // --- Add-ons Selection ---
  function initAddonSelection() {
    addonCards.forEach(card => {
      const checkbox = card.querySelector('.addon-checkbox');

      if (checkbox) {
        // Synchronize initial state
        if (checkbox.checked) {
          card.classList.add('selected');
          if (!state.formData.addons.includes(checkbox.value)) {
            state.formData.addons.push(checkbox.value);
          }
        }

        checkbox.addEventListener('change', () => {
          card.classList.toggle('selected', checkbox.checked);
          if (checkbox.checked) {
            if (!state.formData.addons.includes(checkbox.value)) {
              state.formData.addons.push(checkbox.value);
            }
          } else {
            state.formData.addons = state.formData.addons.filter(v => v !== checkbox.value);
          }
        });
      }
    });
  }

  // --- Input Syncing ---
  function initInputSync() {
    if (nameInput) {
      nameInput.addEventListener('input', (e) => {
        state.formData.name = e.target.value.trim();
      });
    }
    if (emailInput) {
      emailInput.addEventListener('input', (e) => {
        state.formData.email = e.target.value.trim();
      });
    }
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        state.formData.phone = e.target.value.trim();
      });
    }
  }

  // --- Global Button Actions ---
  function initNavigationButtons() {
    document.querySelectorAll('[data-action="next"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        goToStep(state.currentStep + 1);
      });
    });

    document.querySelectorAll('[data-action="back"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        goToStep(state.currentStep - 1);
      });
    });

    document.querySelectorAll('[data-action="confirm"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        goToStep(5);
      });
    });

    if (btnChangePlan) {
      btnChangePlan.addEventListener('click', (e) => {
        e.preventDefault();
        goToStep(2);
      });
    }
  }

  // --- Public Debug Helper ---
  window.formState = state;
  window.goToStep = goToStep;

  // --- Initialize App ---
  function init() {
    initPlanSelection();
    initBillingToggle();
    initAddonSelection();
    initInputSync();
    initNavigationButtons();
    goToStep(1);
    console.log('Multi-step form navigation ready.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
