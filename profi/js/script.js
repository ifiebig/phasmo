(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const nextTri = (v) => (v === 0 ? 1 : v === 1 ? -1 : 0);

  const EVIDENCE = [
    { key: "emf5", label: "EMF Stufe 5" },
    { key: "spiritbox", label: "Geisterbuch (Spirit Box)" },
    { key: "fingerprints", label: "Fingerabdrücke" },
    { key: "writing", label: "Geisterbuch (Schrift)" },
    { key: "freezing", label: "Gefriertemperatur" },
    { key: "orbs", label: "Geisterorbs" },
    { key: "dots", label: "D.O.T.S" },
  ];

  const GHOSTS = [
    { name: "Banshee", ev: ["orbs","fingerprints","dots"] },
    { name: "Dämon", ev: ["freezing","fingerprints","writing"] },
    { name: "Deogen", ev: ["spiritbox","writing","dots"] },
    { name: "Dschinn", ev: ["emf5","fingerprints","freezing"] },
    { name: "Goryo", ev: ["emf5","fingerprints","dots"] },
    { name: "Hantu", ev: ["freezing","fingerprints","orbs"] },
    { name: "Mare", ev: ["spiritbox","orbs","writing"] },
    { name: "Moroi", ev: ["spiritbox","writing","freezing"] },
    { name: "Myling", ev: ["emf5","fingerprints","writing"] },
    { name: "Obake", ev: ["emf5","fingerprints","orbs"] },
    { name: "Oni", ev: ["emf5","freezing","dots"] },
    { name: "Onryo", ev: ["spiritbox","orbs","freezing"] },
    { name: "Phantom", ev: ["spiritbox","fingerprints","dots"] },
    { name: "Poltergeist", ev: ["spiritbox","fingerprints","writing"] },
    { name: "Raiju", ev: ["emf5","orbs","dots"] },
    { name: "Revenant", ev: ["orbs","writing","freezing"] },
    { name: "Der Mimic", ev: ["spiritbox","fingerprints","freezing","orbs"] },
    { name: "Shade", ev: ["emf5","writing","freezing"] },
    { name: "Spirit", ev: ["emf5","spiritbox","writing"] },
    { name: "Gespenst", ev: ["emf5","spiritbox","dots"] },
    { name: "The Twins", ev: ["emf5","spiritbox","freezing"] },
    { name: "Yokai", ev: ["spiritbox","orbs","dots"] },
    { name: "Yurei", ev: ["orbs","freezing","dots"] },
  ];

  const state = Object.fromEntries(EVIDENCE.map(e => [e.key, 0]));
  const evidenceGrid = $("evidenceGrid");
  const ghostGrid = $("ghostGrid");
  const resetBtn = $("resetBtn");
  const limitHint = $("limitHint");

  const countYes = () => Object.values(state).filter(v => v === 1).length;

  function matches(ghost) {
    const yes = Object.entries(state).filter(([,v]) => v === 1).map(([k]) => k);
    const no  = Object.entries(state).filter(([,v]) => v === -1).map(([k]) => k);
    for (const y of yes) if (!ghost.ev.includes(y)) return false;
    for (const n of no) if (ghost.ev.includes(n)) return false;
    return true;
  }

  function renderEvidence() {
    evidenceGrid.innerHTML = "";
    for (const ev of EVIDENCE) {
      const row = document.createElement("div");
      row.className = "evRow";

      const name = document.createElement("div");
      name.className = "evName";
      name.textContent = ev.label;

      const btn = document.createElement("button");
      btn.className = "evBtn";
      btn.type = "button";

      const paint = () => {
        btn.dataset.state = String(state[ev.key]);
        btn.textContent = state[ev.key] === 1 ? "✓" : state[ev.key] === -1 ? "✕" : "—";
      };

      btn.addEventListener("click", () => {
        const cur = state[ev.key];
        const next = nextTri(cur);

        if (next === 1 && cur !== 1 && countYes() >= 3) {
          limitHint.textContent = "Maximal 3 Beweise auf ✓.";
          btn.animate([{transform:"scale(1)"},{transform:"scale(0.92)"},{transform:"scale(1)"}], {duration:140});
          return;
        }
        limitHint.textContent = "";
        state[ev.key] = next;
        paint();
        renderGhosts();
      });

      paint();
      row.appendChild(name);
      row.appendChild(btn);
      evidenceGrid.appendChild(row);
    }
  }

  function renderGhosts() {
    ghostGrid.innerHTML = "";
    for (const g of GHOSTS) {
      const card = document.createElement("div");
      card.className = "ghostCard";
      card.textContent = g.name;
      if (!matches(g)) card.classList.add("isOut");
      ghostGrid.appendChild(card);
    }
  }

  function resetAll() {
    for (const k of Object.keys(state)) state[k] = 0;
    limitHint.textContent = "";
    renderEvidence();
    renderGhosts();
    const qb = $("questionsBox");
    if (qb) qb.innerHTML = "";
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderEvidence();
    renderGhosts();
    resetBtn.addEventListener("click", resetAll);
  });
})();