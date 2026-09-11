# Frontend Mentor - Multi-step form solution

This is a solution to the [Multi-step form challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/multistep-form-YVAnSdqQBJ). Frontend Mentor challenges help developers improve their front-end coding skills by building realistic, production-ready interfaces.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
- [My process](#my-process)
  - [Built with](#built-with)
  - [Architecture & Key Decisions](#architecture--key-decisions)
  - [Accessibility (a11y)](#accessibility-a11y)
- [Author](#author)

---

## Overview

### The challenge

Users should be able to:

- Complete each step of the sequence seamlessly
- Go back to a previous step to review or update selections without losing data
- Select between Monthly and Yearly billing cycles with synchronized plan and add-on pricing
- Pick optional add-on services with real-time feedback
- See an itemized order summary on the final step with an option to change the chosen plan
- View the optimal layout for their device (desktop 1440px and mobile 375px responsive views)
- Experience hover, focus, and active states across all interactive elements
- Receive clear, accessible client-side validation messages if required fields are missed or invalid

### Screenshot

![Design Preview](./preview.jpg)

---

## My process

### Built with

- Semantic **HTML5** markup (`<main>`, `<aside>`, `<nav>`, `<form>`, `<fieldset>`, `<legend>`)
- Modern **CSS3** with Custom Properties (CSS variables), Flexbox, and CSS Grid
- **Mobile-first workflow** with desktop media queries
- Vanilla **JavaScript (ES6+)** with modular state management and event-driven architecture
- Accessible **ARIA attributes** (`aria-live`, `aria-describedby`, `aria-invalid`, `role="switch"`, `aria-current`)

### Architecture & Key Decisions

1. **State Machine Pattern**:
   A single, predictable state object (`state.formData` and `state.currentStep`) coordinates form inputs, plan choice, billing cycle, and add-ons across steps. This ensures complete data retention when users traverse back and forth across steps.

2. **Decoupled Pricing Engine**:
   Pricing data is centralized in a configuration map (`PRICING_DATA`). When the billing toggle flips between monthly and yearly, the interface re-renders prices across steps 2 and 3 automatically, calculates total cost, and displays the "2 months free" promotional badge.

3. **Client-Side Validation & Live Feedback**:
   Step 1 validates required fields and email syntax using standardized regex. Form errors are rendered dynamically with `aria-live="polite"`, preventing progression until resolved, and clearing automatically as soon as valid input is entered.

### Accessibility (a11y)

- **Keyboard Navigation**: Full Tab, Space, and Enter keyboard support across custom cards, radio controls, switch toggle, and buttons.
- **Focus Management**: Focus is programmatically routed to the step heading on pane transitions so assistive technologies announce the updated step context.
- **Motion Preference**: Layout animations respect `@media (prefers-reduced-motion: reduce)`.

---

## Author

- GitHub - [Juan Menezes](https://github.com/menezesjuan)
- Frontend Mentor - [@menezesjuan](https://www.frontendmentor.io/profile/menezesjuan)
