/**
 * Multi-Step Form - Application Logic & State Management
 */

(function () {
  'use strict';

  // --- Pricing Data ---
  const PRICING_DATA = {
    plans: {
      arcade: { name: 'Arcade', monthly: 9, yearly: 90 },
      advanced: { name: 'Advanced', monthly: 12, yearly: 120 },
      pro: { name: 'Pro', monthly: 15, yearly: 150 }
    },
    addons: {
      online: { name: 'Online service', monthly: 1, yearly: 10 },
      storage: { name: 'Larger storage', monthly: 2, yearly: 20 },
      profile: { name: 'Customizable Profile', monthly: 2, yearly: 20 }
    }
  };

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

  // Input & Error references
  const nameInput = document.getElementById('nameInput');
  const emailInput = document.getElementById('emailInput');
  const phoneInput = document.getElementById('phoneInput');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');

  // Summary references
  const summaryPlanName = document.getElementById('summaryPlanName');
  const summaryPlanPrice = document.getElementById('summaryPlanPrice');
  const summaryAddonsList = document.getElementById('summaryAddonsList');
  const summaryTotalLabel = document.getElementById('summaryTotalLabel');
  const summaryTotalPrice = document.getElementById('summaryTotalPrice');

  // --- Validation Helpers ---
  function setFieldError(input, errorElement, message) {
    if (!input || !errorElement) return;

    if (message) {
      input.classList.add('has-error');
      input.setAttribute('aria-invalid', 'true');
      errorElement.textContent = message;
    } else {
      input.classList.remove('has-error');
      input.removeAttribute('aria-invalid');
      errorElement.textContent = '';
    }
  }

  function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailPattern.test(email);
  }

  function validateStep1() {
    let isValid = true;
    let firstInvalidInput = null;

    // Validate Name
    const nameVal = nameInput ? nameInput.value.trim() : '';
    if (!nameVal) {
      setFieldError(nameInput, nameError, 'This field is required');
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = nameInput;
    } else {
      setFieldError(nameInput, nameError, '');
    }

    // Validate Email
    const emailVal = emailInput ? emailInput.value.trim() : '';
    if (!emailVal) {
      setFieldError(emailInput, emailError, 'This field is required');
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = emailInput;
    } else if (!isValidEmail(emailVal)) {
      setFieldError(emailInput, emailError, 'Valid email required');
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = emailInput;
    } else {
      setFieldError(emailInput, emailError, '');
    }

    // Validate Phone
    const phoneVal = phoneInput ? phoneInput.value.trim() : '';
    if (!phoneVal) {
      setFieldError(phoneInput, phoneError, 'This field is required');
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = phoneInput;
    } else {
      setFieldError(phoneInput, phoneError, '');
    }

    if (firstInvalidInput) {
      firstInvalidInput.focus();
    }

    return isValid;
  }

  function validateStep2() {
    const selectedRadio = document.querySelector('input[name="plan"]:checked');
    return !!selectedRadio;
  }

  // --- Dynamic Pricing UI Updates ---
  function updatePricingUI() {
    const isYearly = state.formData.billingCycle === 'yearly';
    const cycleSuffix = isYearly ? 'yr' : 'mo';

    // Update Step 2 Plan Cards
    planCards.forEach(card => {
      const radio = card.querySelector('input[type="radio"]');
      const priceSpan = card.querySelector('.plan-price');
      const bonusSpan = card.querySelector('.plan-bonus');

      if (radio && priceSpan) {
        const planKey = radio.value;
        const planData = PRICING_DATA.plans[planKey];
        if (planData) {
          const price = isYearly ? planData.yearly : planData.monthly;
          priceSpan.textContent = `$${price}/${cycleSuffix}`;
        }
      }

      if (bonusSpan) {
        if (isYearly) {
          bonusSpan.removeAttribute('hidden');
        } else {
          bonusSpan.setAttribute('hidden', '');
        }
      }
    });

    // Update Step 3 Add-on Cards
    addonCards.forEach(card => {
      const checkbox = card.querySelector('.addon-checkbox');
      const priceSpan = card.querySelector('.addon-price');

      if (checkbox && priceSpan) {
        const addonKey = checkbox.value;
        const addonData = PRICING_DATA.addons[addonKey];
        if (addonData) {
          const price = isYearly ? addonData.yearly : addonData.monthly;
          priceSpan.textContent = `+$${price}/${cycleSuffix}`;
        }
      }
    });

    // Recalculate summary if on Step 4
    if (state.currentStep === 4) {
      renderSummary();
    }
  }

  // --- Step 4 Order Summary Rendering ---
  function renderSummary() {
    const isYearly = state.formData.billingCycle === 'yearly';
    const cycleSuffix = isYearly ? 'yr' : 'mo';
    const cycleLabel = isYearly ? 'Yearly' : 'Monthly';

    const selectedPlan = PRICING_DATA.plans[state.formData.plan] || PRICING_DATA.plans.arcade;
    const planCost = isYearly ? selectedPlan.yearly : selectedPlan.monthly;
    let totalCost = planCost;

    // Update Plan Name & Price
    if (summaryPlanName) {
      summaryPlanName.textContent = `${selectedPlan.name} (${cycleLabel})`;
    }
    if (summaryPlanPrice) {
      summaryPlanPrice.textContent = `$${planCost}/${cycleSuffix}`;
    }

    // Populate Add-ons
    if (summaryAddonsList) {
      summaryAddonsList.innerHTML = '';

      state.formData.addons.forEach(addonKey => {
        const addonData = PRICING_DATA.addons[addonKey];
        if (addonData) {
          const addonCost = isYearly ? addonData.yearly : addonData.monthly;
          totalCost += addonCost;

          const row = document.createElement('div');
          row.className = 'summary-addon-row';

          const nameSpan = document.createElement('span');
          nameSpan.className = 'summary-addon-name';
          nameSpan.textContent = addonData.name;

          const priceSpan = document.createElement('span');
          priceSpan.className = 'summary-addon-price';
          priceSpan.textContent = `+$${addonCost}/${cycleSuffix}`;

          row.appendChild(nameSpan);
          row.appendChild(priceSpan);
          summaryAddonsList.appendChild(row);
        }
      });
    }

    // Update Total
    if (summaryTotalLabel) {
      summaryTotalLabel.textContent = `Total (per ${isYearly ? 'year' : 'month'})`;
    }
    if (summaryTotalPrice) {
      summaryTotalPrice.textContent = `+$${totalCost}/${cycleSuffix}`;
    }
  }

  // --- Navigation & Pane Switching ---
  function goToStep(stepIndex) {
    if (stepIndex < 1 || stepIndex > 5) return;

    state.currentStep = stepIndex;

    // If entering Step 4, render the summary dynamically
    if (stepIndex === 4) {
      renderSummary();
    }

    // Update Step Panes
    stepPanes.forEach(pane => {
      const paneStep = parseInt(pane.dataset.step, 10);
      if (paneStep === stepIndex) {
        pane.removeAttribute('hidden');
        pane.classList.add('active');

        // Accessible Focus Management
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

      updatePricingUI();
    });
  }

  // --- Add-ons Selection ---
  function initAddonSelection() {
    addonCards.forEach(card => {
      const checkbox = card.querySelector('.addon-checkbox');

      if (checkbox) {
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

  // --- Input Syncing & Live Error Clearing ---
  function initInputSync() {
    if (nameInput) {
      nameInput.addEventListener('input', (e) => {
        state.formData.name = e.target.value.trim();
        if (e.target.value.trim()) {
          setFieldError(nameInput, nameError, '');
        }
      });
      nameInput.addEventListener('blur', () => {
        if (!nameInput.value.trim()) {
          setFieldError(nameInput, nameError, 'This field is required');
        }
      });
    }

    if (emailInput) {
      emailInput.addEventListener('input', (e) => {
        state.formData.email = e.target.value.trim();
        if (isValidEmail(e.target.value.trim())) {
          setFieldError(emailInput, emailError, '');
        }
      });
      emailInput.addEventListener('blur', () => {
        const val = emailInput.value.trim();
        if (!val) {
          setFieldError(emailInput, emailError, 'This field is required');
        } else if (!isValidEmail(val)) {
          setFieldError(emailInput, emailError, 'Valid email required');
        }
      });
    }

    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        state.formData.phone = e.target.value.trim();
        if (e.target.value.trim()) {
          setFieldError(phoneInput, phoneError, '');
        }
      });
      phoneInput.addEventListener('blur', () => {
        if (!phoneInput.value.trim()) {
          setFieldError(phoneInput, phoneError, 'This field is required');
        }
      });
    }
  }

  // --- Global Button Actions ---
  function initNavigationButtons() {
    document.querySelectorAll('[data-action="next"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();

        // Validation gate
        if (state.currentStep === 1) {
          if (!validateStep1()) {
            return;
          }
        } else if (state.currentStep === 2) {
          if (!validateStep2()) {
            return;
          }
        }

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
    updatePricingUI();
    goToStep(1);
    console.log('Multi-step form ready with dynamic pricing and summary.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
