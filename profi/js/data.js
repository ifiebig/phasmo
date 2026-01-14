export const DATA_VERSION = 1;

export const Evidence = [
  { id: "emf", label: "EMF" },
  { id: "orbs", label: "Orbs" },
  { id: "spiritbox", label: "Spirit Box" },
  { id: "uv", label: "UV" },
  { id: "freezing", label: "Gefriertemperatur" },
  { id: "book", label: "Geisterbuch" },
  { id: "dots", label: "DOTS" },
];

/*
  Hinweis:
  - Profi nutzt 3 Beweise (✔) max.
  - Für echte Phasmophobia-Geister: hier Ghosts-Liste vollständig pflegen.
  - Alles ist datengetrieben, damit Admin später easy ist.
*/
export const Ghosts = [
  { id:"dschinn", name:"Dschinn", evidence:["emf","uv","freezing"], huntAt:50 },

  { id:"obambo", name:"Obambo", evidence:["orbs","book","dots"], huntAt:60 },
  { id:"dajan", name:"Dajan", evidence:["emf","spiritbox","uv"], huntAt:40 },
  { id:"gallu", name:"Gallu", evidence:["orbs","freezing","uv"], huntAt:30 },
  { id:"banshee", name:"Banshee", evidence:["uv","orbs","dots"], huntAt:50 },
  { id:"gespenst", name:"Gespenst", evidence:["spiritbox","book","dots"], huntAt:50 },

  { id:"geist", name:"Geist", evidence:["spiritbox","book","dots"], huntAt:50 },
  { id:"der_mimik", name:"Der Mimik", evidence:["spiritbox","uv","freezing","orbs"], huntAt:50 },
];

export const Questions = [
  {
    id: "saltStepped",
    label: "Ist der Geist in Salz getreten?",
    showIfAnyGhost: ["gespenst","gallu"],
    answers: [
      { id:"salt_yes", label:"Ja", next:"saltHowOften" },
      { id:"salt_no", label:"Nein", excludeGhosts:["gallu"] }
    ]
  },
  {
    id: "saltHowOften",
    label: "Wie oft ist der Geist in Salz getreten?",
    showIfAnyGhost: ["gespenst","gallu"],
    answers: [
      { id:"salt_once", label:"Einmal", hint:"Es könnte Gallu oder Gespenst sein." },
      { id:"salt_more", label:"Mehr als einmal", excludeGhosts:["gallu","gespenst"] }
    ]
  },
  {
    id: "gender",
    label: "War der Geist weiblich?",
    showIfAnyGhost: ["dajan","banshee"],
    answers: [
      { id:"gender_yes", label:"Ja" },
      { id:"gender_no", label:"Nein (männlich)", excludeGhosts:["dajan","banshee"] }
    ]
  }
];
