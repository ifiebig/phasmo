const evidenceState = {};

const evidenceContainer = document.getElementById("evidenceButtons");
const ghostList = document.getElementById("ghostList");
const resetBtn = document.getElementById("resetBtn");

evidences.forEach(ev => {
  evidenceState[ev] = 0;
  const btn = document.createElement("button");
  btn.textContent = ev;
  btn.onclick = () => {
    evidenceState[ev] = (evidenceState[ev] + 1) % 3;
    btn.style.textDecoration = evidenceState[ev] === 2 ? "line-through" : "none";
    renderGhosts();
  };
  evidenceContainer.appendChild(btn);
});

function renderGhosts() {
  ghostList.innerHTML = "";
  ghosts.forEach(g => {
    let hidden = false;
    for (let ev in evidenceState) {
      if (evidenceState[ev] === 1 && !g.evidence.includes(ev)) hidden = true;
      if (evidenceState[ev] === 2 && g.evidence.includes(ev)) hidden = true;
    }
    const div = document.createElement("div");
    div.className = "ghost" + (hidden ? " hidden" : "");
    div.textContent = g.name;
    ghostList.appendChild(div);
  });
}

resetBtn.onclick = () => {
  for (let ev in evidenceState) evidenceState[ev] = 0;
  document.querySelectorAll("#evidenceButtons button").forEach(b => b.style.textDecoration = "none");
  renderGhosts();
};

renderGhosts();
