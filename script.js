document.documentElement.classList.remove("no-js");
document.documentElement.classList.add("js");

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const themeToggle = document.querySelector(".theme-toggle");
const tabLinks = document.querySelectorAll("[data-tab-link]");
const navTabs = document.querySelectorAll(".nav-links [role='tab']");
const tabPanels = document.querySelectorAll("[data-tab-panel]");
const experienceCards = document.querySelectorAll("[data-experience-card]");
const modeSelector = document.getElementById("mode-selector");
const modeButtons = document.querySelectorAll("[data-mode-select]");
const modeResetButtons = document.querySelectorAll("[data-mode-reset]");
const footballNavButtons = document.querySelectorAll("[data-football-target]");
const footballScreens = document.querySelectorAll("#football-mode .football-screen, #football-mode .football-section");
const footballMenuItems = document.querySelectorAll("[data-football-menu-item]");
const footballExpandButtons = document.querySelectorAll(".football-expand");
const footballPreviewTitle = document.querySelector("[data-football-preview-title]");
const footballPreviewCopy = document.querySelector("[data-football-preview-copy]");
const footballPreviewMeta = document.querySelector("[data-football-preview-meta]");
const footballTicker = document.querySelector("[data-football-ticker]");
const footballCommentary = document.querySelector("[data-football-commentary] span");
const footballLoading = document.querySelector("[data-football-loading]");
const footballLoadingText = document.querySelector("[data-football-loading-text]");
const arcadePenalty = document.querySelector("[data-arcade-penalty]");
const minefield = document.querySelector("[data-minefield]");
const arkanoid = document.querySelector("[data-arkanoid]");
const secretStadium = document.querySelector("[data-secret-stadium]");
const blackjack = document.querySelector("[data-blackjack]");
const validTabs = new Set(Array.from(tabPanels, (panel) => panel.id));
const themeStorageKey = "portfolio-theme";
const modeStorageKey = "portfolio-mode";
const lightTheme = "light";
const modes = new Set(["formal", "football"]);
const transferRumors = [
  "Real Madrid scouts monitoring Uber midfielder.",
  "Miguel rejects America offer due to philosophical differences.",
  "ITAM academy prospect linked with advanced statistics masterclass.",
  "Pumas spirit level reaches dangerous levels.",
  "Nationality confirmed: Mexican.",
];
let openPenaltyTab = () => {};
const commentaryLines = [
  "Strong analytical vision from the ITAM midfielder.",
  "Uber coaching staff impressed by decision making under pressure.",
  "Still unable to cook.",
  "Possession football detected.",
  "Pumas energy holding at 100 percent.",
  "Scouting department confirms: serious right-back build-up play.",
];
const loadingMessages = [
  "LOADING PLAYER DATA...",
  "ANALYZING MARKET TRENDS...",
  "PREPARING NEXT MATCH...",
  "SCOUTING REPORT IN PROGRESS...",
];

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

// Portfolio mode selection is intentionally separate from tabs and theme state.
function getSavedMode() {
  try {
    const savedMode = localStorage.getItem(modeStorageKey);
    return modes.has(savedMode) ? savedMode : null;
  } catch (error) {
    return null;
  }
}

function saveMode(mode) {
  try {
    localStorage.setItem(modeStorageKey, mode);
  } catch (error) {
    // Mode selection still works for the current visit if storage is unavailable.
  }
}

function clearSavedMode() {
  try {
    localStorage.removeItem(modeStorageKey);
  } catch (error) {
    // Returning to the selector still works if storage is unavailable.
  }
}

function setMode(mode, options = {}) {
  const { persist = false } = options;
  const activeMode = modes.has(mode) ? mode : "selector";

  document.body.classList.toggle("mode-selector-active", activeMode === "selector");
  document.body.classList.toggle("mode-formal-active", activeMode === "formal");
  document.body.classList.toggle("mode-football-active", activeMode === "football");

  if (persist && modes.has(activeMode)) {
    saveMode(activeMode);
  }

  if (activeMode === "selector") {
    closeMenu();
    window.scrollTo({ top: 0, behavior: "auto" });
    if (modeSelector) {
      modeSelector.querySelector("[data-mode-select]")?.focus({ preventScroll: true });
    }
  } else if (activeMode === "football") {
    showFootballScreen("football-menu");
    updateFootballMenuPreview(footballMenuItems[0]);
  }
}

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

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setMode(button.dataset.modeSelect, { persist: true });
  });

  button.addEventListener("keydown", (event) => {
    if (!["ArrowUp", "ArrowDown"].includes(event.key)) return;

    event.preventDefault();
    const currentIndex = Array.from(modeButtons).indexOf(button);
    const nextIndex = event.key === "ArrowDown"
      ? (currentIndex + 1) % modeButtons.length
      : (currentIndex - 1 + modeButtons.length) % modeButtons.length;

    modeButtons[nextIndex].focus();
  });
});

modeResetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    clearSavedMode();
    setMode("selector");
  });
});

footballExpandButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const details = button.nextElementSibling;
    const isExpanded = button.getAttribute("aria-expanded") === "true";

    button.setAttribute("aria-expanded", String(!isExpanded));
    button.textContent = isExpanded ? "View club report" : "Hide club report";
    if (details) {
      details.hidden = isExpanded;
    }
  });
});

function updateFootballMenuPreview(item) {
  if (!item || !footballPreviewTitle || !footballPreviewCopy || !footballPreviewMeta) return;

  footballMenuItems.forEach((menuItem) => {
    menuItem.classList.toggle("is-selected", menuItem === item);
  });

  footballPreviewTitle.textContent = item.dataset.previewTitle || "Retro Football Mode";
  footballPreviewCopy.textContent = item.dataset.previewCopy || "Choose a section from the team sheet.";
  footballPreviewMeta.textContent = item.dataset.previewMeta || "Main Menu";
}

function showFootballScreen(screenId, options = {}) {
  const { focusHeading = false } = options;
  const activeScreen = document.getElementById(screenId);

  if (!activeScreen) return;

  showFootballLoading(screenId);

  window.setTimeout(() => {
    footballScreens.forEach((screen) => {
      screen.classList.toggle("is-active", screen === activeScreen);
    });

    footballNavButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.footballTarget === screenId);
    });

    if (screenId === "football-menu") {
      updateFootballMenuPreview(document.querySelector("[data-football-menu-item].is-selected") || footballMenuItems[0]);
    }

    if (screenId === "football-play") {
      openPenaltyTab();
    }

    setRandomCommentary();
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });

    if (focusHeading) {
      const heading = activeScreen.querySelector("h1, h2");
      heading?.setAttribute("tabindex", "-1");
      heading?.focus({ preventScroll: true });
    }
  }, prefersReducedMotion ? 0 : 180);
}

function showFootballLoading(screenId) {
  if (!footballLoading || !footballLoadingText || prefersReducedMotion) return;

  const messageIndex = Math.abs(screenId.length) % loadingMessages.length;
  footballLoadingText.textContent = loadingMessages[messageIndex];
  footballLoading.classList.add("is-visible");
  footballLoading.setAttribute("aria-hidden", "false");

  window.setTimeout(() => {
    footballLoading.classList.remove("is-visible");
    footballLoading.setAttribute("aria-hidden", "true");
  }, 420);
}

function setRandomCommentary() {
  if (!footballCommentary) return;
  footballCommentary.textContent = commentaryLines[Math.floor(Math.random() * commentaryLines.length)];
}

if (footballTicker) {
  let tickerIndex = 0;
  window.setInterval(() => {
    tickerIndex = (tickerIndex + 1) % transferRumors.length;
    footballTicker.textContent = transferRumors[tickerIndex];
  }, 3200);
}

setRandomCommentary();

footballNavButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!button.dataset.footballTarget) return;

    showFootballScreen(button.dataset.footballTarget, { focusHeading: true });
  });
});

footballMenuItems.forEach((item, index) => {
  item.addEventListener("mouseenter", () => updateFootballMenuPreview(item));
  item.addEventListener("focus", () => updateFootballMenuPreview(item));

  item.addEventListener("keydown", (event) => {
    if (!["ArrowUp", "ArrowDown"].includes(event.key)) return;

    event.preventDefault();
    const nextIndex = event.key === "ArrowDown"
      ? (index + 1) % footballMenuItems.length
      : (index - 1 + footballMenuItems.length) % footballMenuItems.length;

    footballMenuItems[nextIndex].focus();
  });
});

const penaltyPlayers = {
  itam: {
    name: "ITAM Miguel",
    ovr: "91",
    role: "Finance & Data Science Academy Player",
    theme: "Green academy jersey",
    avatar: "about_me/ITAM_retro.png",
    description: "Academic and technical profile focused on Finance, Data Science, programming, and analytical discipline.",
  },
  uber: {
    name: "Uber Miguel",
    ovr: "92",
    role: "Strategy & Planning Midfielder",
    theme: "Black jersey",
    avatar: "about_me/Uber_retro.png",
    description: "Professional profile focused on market analysis, demand trends, growth forecasting, and business judgment under pressure.",
  },
  incode: {
    name: "Incode Miguel",
    ovr: "90",
    role: "M&A Scout",
    theme: "Blue and white jersey",
    avatar: "about_me/Incode_retro.png",
    description: "Startup and M&A profile focused on market research, competitive analysis, expansion opportunities, and strategic synergies.",
  },
  miguel: {
    name: "Miguel",
    ovr: "93",
    role: "Life Beyond Work Player",
    theme: "Blue and gold jersey",
    avatar: "about_me/Pumas_retro.png",
    description: "Personal profile focused on Pumas, football, Barça, chess, gaming, family, friends, and personality.",
  },
};

const penaltyQuestions = {
  itam: [
    { question: "What does ITAM Miguel study?", answers: ["Finance and Data Science", "Medicine and Law", "Architecture and Design", "Marketing and Communications"], correct: 0 },
    { question: "Which class shaped ITAM Miguel the most?", answers: ["Corporate Finance", "Organic Chemistry", "Film Studies", "Medieval History"], correct: 0 },
    { question: "Which technical topic was especially challenging?", answers: ["Mathematical Statistics", "Drawing", "Biology Lab", "Music Theory"], correct: 0 },
    { question: "Which subject feels most natural to him?", answers: ["Algorithms and Programming", "Literature", "Public Health", "Architecture"], correct: 0 },
    { question: "What academic achievement makes him proud?", answers: ["Studying two degrees", "Winning a cooking contest", "Joining a band", "Becoming a goalkeeper"], correct: 0 },
  ],
  uber: [
    { question: "Where does Uber Miguel currently work?", answers: ["Uber", "Google", "Deloitte", "Citi"], correct: 0 },
    { question: "When did Miguel join Uber?", answers: ["March 2026", "January 2024", "July 2025", "September 2023"], correct: 0 },
    { question: "Which team is Uber Miguel part of?", answers: ["Strategy & Planning Mobility Mexico", "Human Resources Europe", "Legal Operations LATAM", "Product Design Asia"], correct: 0 },
    { question: "What kind of work does he enjoy at Uber?", answers: ["High-impact problems with limited information", "Tasks with no pressure", "Pure design work", "Cooking research"], correct: 0 },
    { question: "Which skill improved the most at Uber?", answers: ["Communication", "Goalkeeping", "Guitar", "Cooking"], correct: 0 },
  ],
  incode: [
    { question: "What type of work did Incode Miguel do?", answers: ["M&A and market research", "Medical diagnosis", "Graphic design", "Sports coaching"], correct: 0 },
    { question: "What interested him about M&A?", answers: ["Business expansion opportunities", "Cooking recipes", "Stadium architecture", "Video game graphics"], correct: 0 },
    { question: "What makes a company interesting to him?", answers: ["Innovative new products", "A cool logo only", "Office furniture", "Social media followers only"], correct: 0 },
    { question: "What does he enjoy connecting?", answers: ["Businesses and potential synergies", "Songs and album covers", "Recipes and ingredients", "Stadium seats and ticket prices"], correct: 0 },
    { question: "What did he help build?", answers: ["A structured M&A pipeline", "A restaurant menu", "A football stadium", "A music album"], correct: 0 },
  ],
  miguel: [
    { question: "Which team does Miguel support in Mexico?", answers: ["Pumas UNAM", "América", "Chivas", "Cruz Azul"], correct: 0 },
    { question: "Which European team does Miguel support?", answers: ["FC Barcelona", "Real Madrid", "Chelsea", "Juventus"], correct: 0 },
    { question: "What is Miguel surprisingly bad at?", answers: ["Cooking", "FIFA / Warzone", "Chess", "Football passion"], correct: 0 },
    { question: "Who is Miguel's favorite current Barça player?", answers: ["Pedri", "Vinícius Jr.", "Haaland", "Mbappé"], correct: 0 },
    { question: "What was Miguel's favorite Pumas memory?", answers: ["2011 Liga MX Final, Pumas champion", "2014 World Cup Final", "2022 Champions League Final", "2006 Super Bowl"], correct: 0 },
    { question: "Who is Miguel's favorite artist?", answers: ["Álvaro Díaz", "Bad Bunny", "Feid", "Rauw Alejandro"], correct: 0 },
  ],
};

if (arcadePenalty) {
  const panels = arcadePenalty.querySelectorAll("[data-penalty-panel]");
  const carouselCard = arcadePenalty.querySelector("[data-penalty-carousel-card]");
  const penaltyPrev = arcadePenalty.querySelector("[data-penalty-prev]");
  const penaltyNext = arcadePenalty.querySelector("[data-penalty-next]");
  const penaltyPlayerKeys = Object.keys(penaltyPlayers);
  const backButtons = arcadePenalty.querySelectorAll("[data-penalty-back], [data-penalty-games]");
  const changePlayerButton = arcadePenalty.querySelector("[data-penalty-change-player]");
  const restartButton = arcadePenalty.querySelector("[data-penalty-restart]");
  const question = arcadePenalty.querySelector("[data-arcade-penalty-question]");
  const options = arcadePenalty.querySelector("[data-arcade-penalty-options]");
  const selectedPlayerLabel = arcadePenalty.querySelector("[data-arcade-penalty-player]");
  const topStatus = arcadePenalty.querySelector("[data-arcade-penalty-status]");
  const scorePlayer = arcadePenalty.querySelector("[data-penalty-score-player]");
  const scoreQuestion = arcadePenalty.querySelector("[data-penalty-score-question]");
  const scoreGoals = arcadePenalty.querySelector("[data-penalty-score-goals]");
  const scoreStatus = arcadePenalty.querySelector("[data-penalty-score-status]");
  const matchPanel = arcadePenalty.querySelector("[data-penalty-panel='match']");
  const matchBall = matchPanel?.querySelector("[data-penalty-ball]");
  const matchKeeper = matchPanel?.querySelector("[data-penalty-keeper]");
  const matchResult = matchPanel?.querySelector("[data-arcade-penalty-result]");
  const PENALTY_ZONES = ["top-left", "top-right", "bottom-left", "bottom-right"];
  const PENALTY_SHOT_CLASSES = PENALTY_ZONES.map((zone) => `shot-${zone}`);
  const PENALTY_KEEPER_CLASSES = PENALTY_ZONES.map((zone) => `keeper-dive-${zone}`);
  let selectedPenaltyPlayer = null;
  let currentPenaltyPlayerIndex = 0;
  let penaltyQuestionIndex = 0;
  let penaltyGoals = 0;
  let penaltyLocked = false;
  let penaltyShotId = 0;

  function setPenaltyPanel(panelName) {
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.penaltyPanel !== panelName;
    });
  }

  function updatePenaltyArcadeScoreboard(status = "READY") {
    const player = selectedPenaltyPlayer ? penaltyPlayers[selectedPenaltyPlayer] : null;
    const questions = selectedPenaltyPlayer ? penaltyQuestions[selectedPenaltyPlayer] : [];
    selectedPlayerLabel.textContent = player?.name || "None";
    topStatus.textContent = status;
    scorePlayer.textContent = player?.name || "---";
    scoreQuestion.textContent = questions.length
      ? `${Math.min(penaltyQuestionIndex + 1, questions.length)}/${questions.length}`
      : "0/0";
    scoreGoals.textContent = String(penaltyGoals);
    scoreStatus.textContent = status;
  }

  function resetPenaltySprites() {
    if (!matchBall || !matchKeeper || !matchResult) return;
    matchBall.classList.remove(...PENALTY_SHOT_CLASSES);
    matchKeeper.classList.remove(...PENALTY_KEEPER_CLASSES);
    matchResult.className = "penalty-shot-result";
    matchResult.textContent = "";
  }

  function showPenaltyPlayerSelect() {
    penaltyShotId += 1;
    selectedPenaltyPlayer = null;
    currentPenaltyPlayerIndex = 0;
    penaltyQuestionIndex = 0;
    penaltyGoals = 0;
    penaltyLocked = false;
    updatePenaltyArcadeScoreboard("SELECT");
    setPenaltyPanel("select");
    renderSelectedPenaltyPlayer();
    penaltyPrev?.focus({ preventScroll: true });
  }

  function selectPenaltyPlayer(playerId) {
    selectedPenaltyPlayer = playerId;
    resetPenaltyGame();
  }

  function shuffleArray(array) {
    const shuffled = [...array];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
  }

  function loadPenaltyQuestion() {
    const questions = penaltyQuestions[selectedPenaltyPlayer];
    const current = questions[penaltyQuestionIndex];
    penaltyLocked = false;
    resetPenaltySprites();
    updatePenaltyArcadeScoreboard("SHOOT");
    question.textContent = current.question;
    options.textContent = "";

    const renderedAnswers = shuffleArray(current.answers.map((answer, index) => ({
      text: answer,
      isCorrect: index === current.correct,
    }))).map((answer, index) => ({
      ...answer,
      zone: PENALTY_ZONES[index],
    }));

    renderedAnswers.forEach((answer) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.zone = answer.zone;
      const answerText = document.createElement("span");
      answerText.className = "penalty-answer-text";
      answerText.textContent = answer.text;
      button.append(answerText);
      button.addEventListener("click", () => handlePenaltyAnswer(answer));
      options.append(button);
    });
  }

  function handlePenaltyAnswer(selectedAnswer) {
    if (penaltyLocked || !selectedPenaltyPlayer) return;
    penaltyLocked = true;
    const shotId = penaltyShotId + 1;
    penaltyShotId = shotId;
    options.querySelectorAll("button").forEach((button) => {
      button.disabled = true;
    });

    const isCorrect = Boolean(selectedAnswer?.isCorrect);
    const selectedZone = selectedAnswer?.zone || PENALTY_ZONES[0];
    animatePenaltyShot(isCorrect, selectedZone);

    window.setTimeout(() => {
      if (shotId !== penaltyShotId) return;

      if (!isCorrect) {
        finishPenaltyGame("GAME OVER");
        return;
      }

      penaltyGoals += 1;
      penaltyQuestionIndex += 1;

      if (penaltyQuestionIndex >= penaltyQuestions[selectedPenaltyPlayer].length) {
        finishPenaltyGame("WIN");
      } else {
        loadPenaltyQuestion();
      }
    }, 980);
  }

  function getPenaltyZoneId(zone) {
    return typeof zone === "number" ? PENALTY_ZONES[zone] : zone;
  }

  function getPenaltyZoneSide(zone) {
    return getPenaltyZoneId(zone).endsWith("left") ? "left" : "right";
  }

  function chooseKeeperDiveZone(selectedZone, isCorrect) {
    const selectedZoneId = getPenaltyZoneId(selectedZone);
    if (!isCorrect) return selectedZoneId;

    const clearMissZones = PENALTY_ZONES.filter((zone) => getPenaltyZoneSide(zone) !== getPenaltyZoneSide(selectedZoneId));
    const availableZones = clearMissZones.length
      ? clearMissZones
      : PENALTY_ZONES.filter((zone) => zone !== selectedZoneId);

    return availableZones[Math.floor(Math.random() * availableZones.length)];
  }

  function animateKeeperDive(zone) {
    if (!matchKeeper) return;
    matchKeeper.classList.remove(...PENALTY_KEEPER_CLASSES);
    matchKeeper.classList.add(`keeper-dive-${zone}`);
  }

  function animatePenaltyShot(isCorrect, selectedZone) {
    if (!matchBall || !matchKeeper || !matchResult) return;
    const selectedZoneId = getPenaltyZoneId(selectedZone);
    const keeperZone = chooseKeeperDiveZone(selectedZoneId, isCorrect);

    resetPenaltySprites();
    matchBall.offsetHeight;

    matchBall.classList.add(`shot-${selectedZoneId}`);
    animateKeeperDive(keeperZone);
    matchResult.textContent = isCorrect ? "GOAL" : "SAVED";
    matchResult.classList.add("is-visible");
    updatePenaltyArcadeScoreboard(isCorrect ? "GOAL" : "SAVED");
  }

  function finishPenaltyGame(result) {
    updatePenaltyArcadeScoreboard(result);
    question.textContent = result;
    options.textContent = "";
    matchResult.textContent = result;
    matchResult.className = `penalty-shot-result is-visible ${result === "WIN" ? "is-win" : "is-game-over"}`;
  }

  function resetPenaltyGame() {
    if (!selectedPenaltyPlayer) {
      showPenaltyPlayerSelect();
      return;
    }

    penaltyShotId += 1;
    penaltyQuestionIndex = 0;
    penaltyGoals = 0;
    penaltyLocked = false;
    setPenaltyPanel("match");
    loadPenaltyQuestion();
  }

  function renderSelectedPenaltyPlayer() {
    const playerId = penaltyPlayerKeys[currentPenaltyPlayerIndex];
    const player = penaltyPlayers[playerId];
    const theme = playerId === "miguel" ? "pumas" : playerId;
    carouselCard.innerHTML = `
      <article class="penalty-player-card theme-${theme}">
        <div class="penalty-card-avatar">
          <img class="retro-photo" src="${player.avatar}" alt="Retro football avatar of ${player.name}" width="210" height="210">
        </div>
        <div class="penalty-card-nameovr">
          <h5>${player.name}</h5>
          <strong class="penalty-card-ovr">OVR ${player.ovr}</strong>
        </div>
        <p class="penalty-card-role"><span class="penalty-card-label">Role:</span> ${player.role}</p>
        <p class="penalty-card-jersey"><span class="penalty-card-label">Jersey:</span> ${player.theme}</p>
        <p class="penalty-card-desc">${player.description}</p>
        <button class="football-link penalty-card-select" type="button" data-penalty-select="${playerId}">SELECT PLAYER</button>
      </article>
    `;
    carouselCard.querySelector("[data-penalty-select]").addEventListener("click", () => selectCurrentPenaltyPlayer());
  }

  function nextPenaltyPlayer() {
    currentPenaltyPlayerIndex = (currentPenaltyPlayerIndex + 1) % penaltyPlayerKeys.length;
    renderSelectedPenaltyPlayer();
  }

  function previousPenaltyPlayer() {
    currentPenaltyPlayerIndex = (currentPenaltyPlayerIndex - 1 + penaltyPlayerKeys.length) % penaltyPlayerKeys.length;
    renderSelectedPenaltyPlayer();
  }

  function selectCurrentPenaltyPlayer() {
    selectPenaltyPlayer(penaltyPlayerKeys[currentPenaltyPlayerIndex]);
  }

  backButtons.forEach((button) => {
    button.addEventListener("click", () => {
      penaltyShotId += 1;
      selectedPenaltyPlayer = null;
      penaltyQuestionIndex = 0;
      penaltyGoals = 0;
      penaltyLocked = false;
      updatePenaltyArcadeScoreboard("READY");
      showFootballScreen("football-menu", { focusHeading: true });
    });
  });
  penaltyPrev?.addEventListener("click", previousPenaltyPlayer);
  penaltyNext?.addEventListener("click", nextPenaltyPlayer);
  arcadePenalty.addEventListener("keydown", (event) => {
    const selectPanel = arcadePenalty.querySelector("[data-penalty-panel='select']");
    if (selectPanel?.hidden) return;
    if (event.key === "ArrowLeft") { event.preventDefault(); previousPenaltyPlayer(); }
    if (event.key === "ArrowRight") { event.preventDefault(); nextPenaltyPlayer(); }
    if (event.key === "Enter") { event.preventDefault(); selectCurrentPenaltyPlayer(); }
  });
  changePlayerButton.addEventListener("click", showPenaltyPlayerSelect);
  restartButton.addEventListener("click", resetPenaltyGame);
  openPenaltyTab = showPenaltyPlayerSelect;
  updatePenaltyArcadeScoreboard("READY");
  setPenaltyPanel("select");
  renderSelectedPenaltyPlayer();
}

if (minefield) {
  const mineGrid = minefield.querySelector("[data-mine-grid]");
  const mineScore = minefield.querySelector("[data-mine-score]");
  const mineStatus = minefield.querySelector("[data-mine-status]");
  const mineReset = minefield.querySelector("[data-mine-reset]");
  let mines = new Set();
  let safeScore = 0;
  let mineOver = false;

  function resetMinefield() {
    mines = new Set();
    while (mines.size < 3) mines.add(Math.floor(Math.random() * 25));
    safeScore = 0;
    mineOver = false;
    mineScore.textContent = "0";
    mineStatus.textContent = "Avoid 3 random mines.";
    mineGrid.textContent = "";

    for (let index = 0; index < 25; index += 1) {
      const tile = document.createElement("button");
      tile.type = "button";
      tile.setAttribute("aria-label", `Minefield tile ${index + 1}`);
      tile.addEventListener("click", () => {
        if (mineOver || tile.disabled) return;
        tile.disabled = true;
        if (mines.has(index)) {
          tile.classList.add("is-mine");
          tile.textContent = "!";
          mineStatus.textContent = "GAME OVER";
          mineOver = true;
        } else {
          tile.classList.add("is-safe");
          tile.textContent = "✓";
          safeScore += 1;
          mineScore.textContent = String(safeScore);
          if (safeScore === 22) mineStatus.textContent = "WIN";
        }
      });
      mineGrid.append(tile);
    }
  }

  mineReset.addEventListener("click", resetMinefield);
  resetMinefield();
}

if (arkanoid) {
  const canvas = arkanoid.querySelector("[data-arkanoid-canvas]");
  const scoreEl = arkanoid.querySelector("[data-arkanoid-score]");
  const kickOffBtn = arkanoid.querySelector("[data-arkanoid-kickoff]");
  const resetBtn = arkanoid.querySelector("[data-arkanoid-reset]");
  const arkanoidStatus = arkanoid.querySelector("[data-arkanoid-status]");
  const ctx = canvas?.getContext("2d");
  const keys = new Set();
  let arkanoidState = null;
  let animationFrameId = null;
  let gameRunning = false;

  function buildArkanoidState() {
    return {
      score: 0,
      paddleX: 170,
      ballX: 210,
      ballY: 228,
      vx: 2.3,
      vy: -2.5,
      launched: false,
      bricks: Array.from({ length: 24 }, (_, index) => ({ x: 20 + (index % 6) * 64, y: 28 + Math.floor(index / 6) * 22, alive: true })),
    };
  }

  function drawArkanoid() {
    if (!ctx || !arkanoidState) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(224,195,106,.45)";
    ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

    arkanoidState.bricks.forEach((brick, index) => {
      if (!brick.alive) return;
      ctx.fillStyle = index % 2 ? "#C8A24F" : "#002B5C";
      ctx.fillRect(brick.x, brick.y, 52, 14);
    });

    ctx.fillStyle = "#E0C36A";
    ctx.fillRect(arkanoidState.paddleX, 238, 80, 10);
    ctx.beginPath();
    ctx.arc(arkanoidState.ballX, arkanoidState.ballY, 7, 0, Math.PI * 2);
    ctx.fillStyle = "#F8FAFC";
    ctx.fill();
  }

  function stopArkanoid() {
    window.cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    gameRunning = false;
  }

  function finishArkanoid(result) {
    stopArkanoid();
    if (arkanoidStatus) arkanoidStatus.textContent = result;
    if (!ctx) return;
    ctx.fillStyle = "rgba(2, 6, 23, 0.82)";
    ctx.fillRect(60, 90, 300, 80);
    ctx.fillStyle = result === "WIN" ? "#C8A24F" : "#DC2626";
    ctx.font = '18px "Press Start 2P", monospace';
    ctx.textAlign = "center";
    ctx.fillText(result, canvas.width / 2, canvas.height / 2);
    ctx.textAlign = "left";
  }

  function resetArkanoid() {
    stopArkanoid();
    arkanoidState = buildArkanoidState();
    scoreEl.textContent = "0";
    if (arkanoidStatus) arkanoidStatus.textContent = "Use ← → or A/D to move. Press KICK OFF to start.";
    kickOffBtn.disabled = false;
    drawArkanoid();
  }

  function startArkanoid() {
    if (gameRunning) return;
    gameRunning = true;
    kickOffBtn.disabled = true;
    arkanoidState.launched = true;
    animationFrameId = window.requestAnimationFrame(tickArkanoid);
  }

  function tickArkanoid() {
    if (!arkanoidState || !gameRunning) return;
    if (keys.has("ArrowLeft") || keys.has("a")) arkanoidState.paddleX -= 5;
    if (keys.has("ArrowRight") || keys.has("d")) arkanoidState.paddleX += 5;
    arkanoidState.paddleX = Math.max(10, Math.min(330, arkanoidState.paddleX));

    arkanoidState.ballX += arkanoidState.vx;
    arkanoidState.ballY += arkanoidState.vy;
    if (arkanoidState.ballX < 15 || arkanoidState.ballX > 405) arkanoidState.vx *= -1;
    if (arkanoidState.ballY < 15) arkanoidState.vy *= -1;
    if (arkanoidState.ballY > 232 && arkanoidState.ballX > arkanoidState.paddleX && arkanoidState.ballX < arkanoidState.paddleX + 80) {
      arkanoidState.vy = -Math.abs(arkanoidState.vy);
    }

    if (arkanoidState.ballY > 270) {
      drawArkanoid();
      finishArkanoid("GAME OVER");
      return;
    }

    arkanoidState.bricks.forEach((brick) => {
      if (!brick.alive) return;
      if (arkanoidState.ballX > brick.x && arkanoidState.ballX < brick.x + 52 && arkanoidState.ballY > brick.y && arkanoidState.ballY < brick.y + 14) {
        brick.alive = false;
        arkanoidState.vy *= -1;
        arkanoidState.score += 10;
        scoreEl.textContent = String(arkanoidState.score);
      }
    });

    if (arkanoidState.bricks.every((b) => !b.alive)) {
      drawArkanoid();
      finishArkanoid("WIN");
      return;
    }

    drawArkanoid();
    animationFrameId = window.requestAnimationFrame(tickArkanoid);
  }

  window.addEventListener("keydown", (event) => {
    if (["ArrowLeft", "ArrowRight", "a", "d"].includes(event.key)) {
      keys.add(event.key);
    }
  });
  window.addEventListener("keyup", (event) => keys.delete(event.key));

  kickOffBtn?.addEventListener("click", startArkanoid);
  resetBtn?.addEventListener("click", resetArkanoid);

  resetArkanoid();
}

if (secretStadium) {
  secretStadium.addEventListener("click", () => {
    setRandomCommentary();
    secretStadium.textContent = "Hidden scouting line unlocked: Nationality confirmed: Mexican.";
  });
}

if (blackjack) {
  const bjDealBtn = blackjack.querySelector("[data-bj-deal]");
  const bjHitBtn = blackjack.querySelector("[data-bj-hit]");
  const bjStandBtn = blackjack.querySelector("[data-bj-stand]");
  const bjResetBtn = blackjack.querySelector("[data-bj-reset]");
  const bjResultEl = blackjack.querySelector("[data-bj-result]");
  const bjStatusEl = blackjack.querySelector("[data-bj-status]");
  const bjPlayerCardsEl = blackjack.querySelector("[data-bj-player-cards]");
  const bjDealerCardsEl = blackjack.querySelector("[data-bj-dealer-cards]");
  const bjPlayerScoreEl = blackjack.querySelector("[data-bj-player-score]");
  const bjDealerScoreEl = blackjack.querySelector("[data-bj-dealer-score]");

  const BJ_SUITS = ["♠", "♥", "♦", "♣"];
  const BJ_RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

  let bjDeck = [];
  let bjPlayerHand = [];
  let bjDealerHand = [];
  let bjGameOver = false;

  function bjDealCard() {
    if (bjDeck.length === 0) {
      bjDeck = BJ_SUITS.flatMap((s) => BJ_RANKS.map((r) => ({ suit: s, rank: r }))).sort(() => Math.random() - 0.5);
    }
    return bjDeck.pop();
  }

  function calculateHandValue(hand) {
    let value = 0;
    let aces = 0;
    for (const card of hand) {
      if (card.rank === "A") { aces += 1; value += 11; }
      else if (["J", "Q", "K"].includes(card.rank)) { value += 10; }
      else { value += parseInt(card.rank, 10); }
    }
    while (value > 21 && aces > 0) { value -= 10; aces -= 1; }
    return value;
  }

  function renderBlackjack(revealDealer) {
    const isRed = (s) => s === "♥" || s === "♦";
    bjPlayerCardsEl.innerHTML = bjPlayerHand.map((c) =>
      `<div class="bj-card${isRed(c.suit) ? " bj-card-red" : ""}"><span class="bj-rank">${c.rank}</span><span class="bj-suit">${c.suit}</span></div>`
    ).join("");
    bjDealerCardsEl.innerHTML = bjDealerHand.map((c, i) =>
      i === 1 && !revealDealer
        ? '<div class="bj-card bj-card-hidden"><span class="bj-rank">?</span></div>'
        : `<div class="bj-card${isRed(c.suit) ? " bj-card-red" : ""}"><span class="bj-rank">${c.rank}</span><span class="bj-suit">${c.suit}</span></div>`
    ).join("");
    bjPlayerScoreEl.textContent = String(calculateHandValue(bjPlayerHand));
    bjDealerScoreEl.textContent = revealDealer ? String(calculateHandValue(bjDealerHand)) : "?";
  }

  function finishBlackjack(result) {
    bjGameOver = true;
    renderBlackjack(true);
    bjResultEl.textContent = result;
    bjResultEl.className = `blackjack-result ${result === "WIN" ? "is-win" : "is-game-over"}`;
    bjStatusEl.textContent = result;
    bjDealBtn.disabled = false;
    bjHitBtn.disabled = true;
    bjStandBtn.disabled = true;
  }

  function startBlackjack() {
    bjDeck = BJ_SUITS.flatMap((s) => BJ_RANKS.map((r) => ({ suit: s, rank: r }))).sort(() => Math.random() - 0.5);
    bjPlayerHand = [bjDealCard(), bjDealCard()];
    bjDealerHand = [bjDealCard(), bjDealCard()];
    bjGameOver = false;
    bjResultEl.textContent = "";
    bjResultEl.className = "blackjack-result";
    bjStatusEl.textContent = "HIT or STAND?";
    bjDealBtn.disabled = true;
    bjHitBtn.disabled = false;
    bjStandBtn.disabled = false;
    renderBlackjack(false);
    if (calculateHandValue(bjPlayerHand) === 21) finishBlackjack("WIN");
  }

  function resetBlackjack() {
    bjDeck = [];
    bjPlayerHand = [];
    bjDealerHand = [];
    bjGameOver = false;
    bjResultEl.textContent = "";
    bjResultEl.className = "blackjack-result";
    bjStatusEl.textContent = "READY";
    bjDealBtn.disabled = false;
    bjHitBtn.disabled = true;
    bjStandBtn.disabled = true;
    bjPlayerCardsEl.innerHTML = '<span class="bj-empty">deal to start</span>';
    bjDealerCardsEl.innerHTML = '<span class="bj-empty">deal to start</span>';
    bjPlayerScoreEl.innerHTML = "&#8212;";
    bjDealerScoreEl.innerHTML = "&#8212;";
  }

  function hitBlackjack() {
    if (bjGameOver) return;
    bjPlayerHand.push(bjDealCard());
    renderBlackjack(false);
    const val = calculateHandValue(bjPlayerHand);
    if (val > 21) finishBlackjack("GAME OVER");
    else if (val === 21) finishBlackjack("WIN");
  }

  function standBlackjack() {
    if (bjGameOver) return;
    while (calculateHandValue(bjDealerHand) < 17) bjDealerHand.push(bjDealCard());
    const pVal = calculateHandValue(bjPlayerHand);
    const dVal = calculateHandValue(bjDealerHand);
    finishBlackjack(dVal > 21 || pVal > dVal ? "WIN" : "GAME OVER");
  }

  bjDealBtn?.addEventListener("click", startBlackjack);
  bjHitBtn?.addEventListener("click", hitBlackjack);
  bjStandBtn?.addEventListener("click", standBlackjack);
  bjResetBtn?.addEventListener("click", resetBlackjack);
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
setMode(getSavedMode() || "selector");
