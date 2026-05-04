document.documentElement.classList.remove("no-js");
document.documentElement.classList.add("js");

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const themeToggle = document.querySelector(".theme-toggle");
const tabLinks = document.querySelectorAll("[data-tab-link]");
const navTabs = document.querySelectorAll(".nav-links [role='tab']");
const tabPanels = document.querySelectorAll("[data-tab-panel]");
const experienceCards = document.querySelectorAll("[data-experience-card]");
const validTabs = new Set(Array.from(tabPanels, (panel) => panel.id));
const themeStorageKey = "portfolio-theme";
const lightTheme = "light";

function getSavedTheme() {
  try {
    return localStorage.getItem(themeStorageKey);
  } catch (error) {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch (error) {
    // The visual toggle still works if storage is unavailable.
  }
}

function updateThemeToggle(isLightMode) {
  if (!themeToggle) return;
  themeToggle.setAttribute("aria-pressed", String(isLightMode));
  themeToggle.setAttribute("aria-label", isLightMode ? "Switch to dark theme" : "Switch to light theme");
}

function applyTheme(theme) {
  const isLightMode = theme === lightTheme;
  document.body.classList.toggle("light-mode", isLightMode);
  updateThemeToggle(isLightMode);
}

applyTheme(getSavedTheme());

function closeMenu() {
  if (!navToggle || !navLinks) return;
  navLinks.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation");
  document.body.classList.remove("nav-open");
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    document.body.classList.toggle("nav-open", isOpen);
  });
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("light-mode") ? "dark" : lightTheme;
    applyTheme(nextTheme);
    saveTheme(nextTheme);
  });
}

function setExperienceCardExpanded(card, shouldExpand) {
  const toggle = card.querySelector(".experience-toggle");
  const indicator = card.querySelector(".expand-indicator");
  const details = card.querySelector(".experience-details");

  card.classList.toggle("is-expanded", shouldExpand);
  if (toggle) {
    toggle.setAttribute("aria-expanded", String(shouldExpand));
  }
  if (details) {
    details.setAttribute("aria-hidden", String(!shouldExpand));
  }
  if (indicator) {
    indicator.textContent = shouldExpand ? "Hide details" : "View details";
  }
}

experienceCards.forEach((card) => {
  const toggle = card.querySelector(".experience-toggle");
  if (!toggle) return;

  setExperienceCardExpanded(card, card.classList.contains("is-expanded"));

  toggle.addEventListener("click", () => {
    const shouldExpand = !card.classList.contains("is-expanded");

    experienceCards.forEach((otherCard) => {
      setExperienceCardExpanded(otherCard, otherCard === card && shouldExpand);
    });
  });
});

const revealItems = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function revealPanel(panel) {
  panel.querySelectorAll(".reveal").forEach((item) => {
    item.classList.add("is-visible");
  });
}

function setActiveTab(tabId, options = {}) {
  const { updateHash = true, focusPanel = false } = options;
  const activePanel = document.getElementById(tabId);

  if (!activePanel || !validTabs.has(tabId)) return;

  tabPanels.forEach((panel) => {
    const isActive = panel.id === tabId;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active-panel", isActive);
    if (isActive) revealPanel(panel);
  });

  navTabs.forEach((tab) => {
    const isActive = tab.getAttribute("aria-controls") === tabId;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.setAttribute("tabindex", isActive ? "0" : "-1");
  });

  closeMenu();

  if (updateHash) {
    history.replaceState(null, "", `#${tabId}`);
  }

  if (focusPanel) {
    activePanel.focus({ preventScroll: true });
  }

  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
}

tabLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const tabId = link.hash.slice(1);
    if (!validTabs.has(tabId)) return;

    event.preventDefault();
    setActiveTab(tabId, { focusPanel: link.getAttribute("role") === "tab" });
  });
});

navTabs.forEach((tab, index) => {
  tab.addEventListener("keydown", (event) => {
    const lastIndex = navTabs.length - 1;
    let nextIndex = index;

    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      setActiveTab(tab.getAttribute("aria-controls"), { focusPanel: true });
      return;
    }

    if (event.key === "ArrowRight") nextIndex = index === lastIndex ? 0 : index + 1;
    if (event.key === "ArrowLeft") nextIndex = index === 0 ? lastIndex : index - 1;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = lastIndex;
    if (nextIndex === index && !["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;

    event.preventDefault();
    const nextTab = navTabs[nextIndex];
    nextTab.focus();
    setActiveTab(nextTab.getAttribute("aria-controls"), { focusPanel: false });
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

const initialTab = validTabs.has(window.location.hash.slice(1)) ? window.location.hash.slice(1) : "home";

if (prefersReducedMotion) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

setActiveTab(initialTab, { updateHash: Boolean(window.location.hash) });
