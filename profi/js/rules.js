export function filterByEvidence(ghosts, evidenceState) {
  return ghosts.filter(g => {
    for (const [ev, st] of Object.entries(evidenceState)) {
      if (st === "yes" && !g.evidence.includes(ev)) return false;
      if (st === "no" && g.evidence.includes(ev)) return false;
    }
    return true;
  });
}

export function filterBySanity(ghosts, selectedSanity) {
  if (selectedSanity == null) return ghosts;
  // Nutzerregel: Sanity X -> alle Geister, die unter X jagen, raus
  return ghosts.filter(g => (typeof g.huntAt === "number" ? g.huntAt : 0) >= selectedSanity);
}

export function applyQuestionAnswer(ghosts, answer) {
  if (!answer) return ghosts;
  if (answer.excludeGhosts?.length) {
    const ex = new Set(answer.excludeGhosts);
    return ghosts.filter(g => !ex.has(g.id));
  }
  return ghosts;
}

export function shouldShowQuestion(question, remainingGhosts) {
  const ids = new Set(remainingGhosts.map(g => g.id));
  const list = question.showIfAnyGhost || [];
  return list.length ? list.some(id => ids.has(id)) : true;
}
