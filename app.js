// Multi-step form application helper for development & inspection

window.showStep = function(stepNumber) {
  const panes = document.querySelectorAll('.step-pane');
  const indicators = document.querySelectorAll('.step-nav-item');

  panes.forEach(pane => {
    const isTarget = pane.dataset.step === String(stepNumber);
    if (isTarget) {
      pane.removeAttribute('hidden');
      pane.classList.add('active');
    } else {
      pane.setAttribute('hidden', '');
      pane.classList.remove('active');
    }
  });

  indicators.forEach(indicator => {
    const isTarget = indicator.dataset.stepIndicator === String(stepNumber);
    indicator.classList.toggle('active', isTarget);
    const badge = indicator.querySelector('.step-badge');
    if (badge) {
      if (isTarget) {
        badge.setAttribute('aria-current', 'step');
      } else {
        badge.removeAttribute('aria-current');
      }
    }
  });

  console.log(`Visualizando Passo ${stepNumber}`);
};

console.log('Multi-step form initialized. Use showStep(1..5) no console para inspecionar cada etapa visualmente.');
