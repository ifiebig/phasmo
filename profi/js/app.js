import { Evidence as DEFAULT_EVIDENCE, Ghosts as DEFAULT_GHOSTS, Questions as DEFAULT_QUESTIONS } from "./data.js";
import { filterByEvidence, filterBySanity, applyQuestionAnswer, shouldShowQuestion } from "./rules.js";
import { loadOverride, saveOverride, clearOverride } from "./admin.js";

const $ = (id) => document.getElementById(id);

const state = {
  data: { Evidence: DEFAULT_EVIDENCE, Ghosts: DEFAULT_GHOSTS, Questions: DEFAULT_QUESTIONS },
  evidenceState: {},        // { evId: "neutral|yes|no" }
  selectedSanity: null,     // number|null
  questionAnswers: {},      // { questionId: answerId }
  maxYesEvidence: 3
};

function initData() {
  const ov = loadOverride();
  if (ov && ov.Evidence && ov.Ghosts && ov.Questions) state.data = ov;

  state.evidenceState = {};
  for (const ev of state.data.Evidence) state.evidenceState[ev.id] = "neutral";
}

function yesCount() {
  return Object.values(state.evidenceState).filter(v => v === "yes").length;
}

function flashHint(text) {
  const el = $("limitHint");
  if (!el) return;
  el.textContent = text;
  el.classList.add("flash");
  setTimeout(() => el.classList.remove("flash"), 350);
}

function cycleEvidence(evId) {
  const cur = state.evidenceState[evId] || "neutral";
  const next = cur === "neutral" ? "yes" : cur === "yes" ? "no" : "neutral";

  if (next === "yes" && yesCount() >= state.maxYesEvidence) {
    flashHint(`Max. ${state.maxYesEvidence} Beweise aktiv (✔).`);
    return;
  }
  state.evidenceState[evId] = next;
  renderAll();
}

function setSanity(v) {
  state.selectedSanity = (state.selectedSanity === v) ? null : v;
  renderAll();
}

function resetAll() {
  for (const k of Object.keys(state.evidenceState)) state.evidenceState[k] = "neutral";
  state.selectedSanity = null;
  state.questionAnswers = {};
  renderAll();
}

function getRemainingGhosts() {
  let ghosts = [...state.data.Ghosts];

  ghosts = filterByEvidence(ghosts, state.evidenceState);
  ghosts = filterBySanity(ghosts, state.selectedSanity);

  for (const q of state.data.Questions) {
    const chosen = state.questionAnswers[q.id];
    if (!chosen) continue;
    const ans = q.answers.find(a => a.id === chosen);
    ghosts = applyQuestionAnswer(ghosts, ans);
  }
  return ghosts;
}

function renderEvidence() {
  const grid = $("evidenceGrid");
  grid.innerHTML = "";

  for (const ev of state.data.Evidence) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "evBtn";
    btn.dataset.state = state.evidenceState[ev.id];

    const icon = document.createElement("span");
    icon.className = "evIcon";
    icon.textContent = "B";

    const label = document.createElement("span");
    label.className = "evLabel";
    label.textContent = ev.label;

    const mark = document.createElement("span");
    mark.className = "evMark";
    mark.textContent = btn.dataset.state === "yes" ? "✔" : btn.dataset.state === "no" ? "✖" : "";

    btn.append(icon, label, mark);
    btn.addEventListener("click", () => cycleEvidence(ev.id));
    grid.appendChild(btn);
  }

  $("limitHint").textContent = `✔ aktiv: ${yesCount()}/${state.maxYesEvidence}`;
}

function renderSanity() {
  const list = $("sanityList");
  list.innerHTML = "";
  for (let v = 100; v >= 0; v -= 5) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "sanityBtn";
    b.textContent = v + "%";
    if (state.selectedSanity === v) b.classList.add("active");
    b.addEventListener("click", () => setSanity(v));
    list.appendChild(b);
  }
}

function renderGhosts(remaining) {
  const grid = $("ghostGrid");
  grid.innerHTML = "";
  $("ghostCount").textContent = String(remaining.length);

  const sorted = [...remaining].sort((a,b) => a.name.localeCompare(b.name, "de"));
  for (const g of sorted) {
    const card = document.createElement("div");
    card.className = "ghostCard";
    card.textContent = g.name;
    grid.appendChild(card);
  }
}

function renderQuestions(remaining) {
  const box = $("questions");
  const hint = $("questionsHint");
  box.innerHTML = "";
  hint.textContent = "";

  const visible = state.data.Questions.filter(q => shouldShowQuestion(q, remaining));
  if (!visible.length) {
    hint.textContent = "Keine Fragen aktiv (erscheinen nur, wenn passende Geister noch möglich sind).";
    return;
  }

  for (const q of visible) {
    const card = document.createElement("div");
    card.className = "qCard";

    const title = document.createElement("div");
    title.className = "qTitle";
    title.textContent = q.label;

    const answers = document.createElement("div");
    answers.className = "qAnswers";

    for (const a of q.answers) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "qBtn";
      b.textContent = a.label;
      if (state.questionAnswers[q.id] === a.id) b.classList.add("active");

      b.addEventListener("click", () => {
        if (state.questionAnswers[q.id] === a.id) delete state.questionAnswers[q.id];
        else state.questionAnswers[q.id] = a.id;
        renderAll();
      });

      answers.appendChild(b);
    }

    card.append(title, answers);

    const chosen = state.questionAnswers[q.id];
    if (chosen) {
      const ans = q.answers.find(x => x.id === chosen);
      if (ans?.hint) {
        const p = document.createElement("div");
        p.className = "questionsHint";
        p.textContent = ans.hint;
        card.appendChild(p);
      }
    }

    box.appendChild(card);
  }
}

function openAdminIfHash() {
  const overlay = $("adminOverlay");
  const isAdmin = location.hash === "#admin";
  overlay.hidden = !isAdmin;
  if (isAdmin) setupAdminUI();
}

function setupAdminUI() {
  const ta = $("adminJson");
  const err = $("adminError");

  const current = {
    Evidence: state.data.Evidence,
    Ghosts: state.data.Ghosts,
    Questions: state.data.Questions
  };
  ta.value = JSON.stringify(current, null, 2);
  err.textContent = "";

  $("adminLoad").onclick = () => {
    ta.value = JSON.stringify({
      Evidence: state.data.Evidence,
      Ghosts: state.data.Ghosts,
      Questions: state.data.Questions
    }, null, 2);
    err.textContent = "";
  };

  $("adminSave").onclick = () => {
    try {
      const parsed = JSON.parse(ta.value);
      if (!parsed.Evidence || !parsed.Ghosts || !parsed.Questions) {
        err.textContent = "Fehler: JSON muss Evidence, Ghosts, Questions enthalten.";
        return;
      }
      saveOverride(parsed);
      err.textContent = "Gespeichert. Bitte Seite neu laden.";
    } catch (e) {
      err.textContent = "JSON ungültig: " + (e?.message || e);
    }
  };

  $("adminClear").onclick = () => {
    clearOverride();
    err.textContent = "Override gelöscht. Bitte Seite neu laden.";
  };

  $("adminClose").onclick = () => {
    location.hash = "";
  };
}

function renderAll() {
  renderEvidence();
  renderSanity();
  const remaining = getRemainingGhosts();
  renderGhosts(remaining);
  renderQuestions(remaining);
}

function boot() {
  initData();
  $("resetBtn").addEventListener("click", resetAll);

  window.addEventListener("hashchange", openAdminIfHash);
  openAdminIfHash();

  renderAll();
}

document.addEventListener("DOMContentLoaded", boot);
