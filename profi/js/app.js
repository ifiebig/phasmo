const evidences = ["EMF","Spirit Box","Fingerabdrücke","Gefriertemperatur"];
const ghosts = [
  {name:"Banshee", evidence:["EMF","Fingerabdrücke"]},
  {name:"Dschinn", evidence:["EMF","Spirit Box"]},
  {name:"Obambo", evidence:["Spirit Box","Fingerabdrücke"]}
];

const state = {};

const evDiv = document.getElementById("evidence");
evidences.forEach(e=>{
  const b=document.createElement("button");
  b.textContent=e;
  b.onclick=()=>{
    state[e]=!state[e];
    filter();
  };
  evDiv.appendChild(b);
});

const gDiv=document.getElementById("ghosts");
function render(){
  gDiv.innerHTML="";
  ghosts.forEach(g=>{
    const d=document.createElement("div");
    d.className="ghost";
    d.textContent=g.name;
    d.dataset.ev=JSON.stringify(g.evidence);
    gDiv.appendChild(d);
  });
}
function filter(){
  document.querySelectorAll(".ghost").forEach(g=>{
    const ev=JSON.parse(g.dataset.ev);
    let ok=true;
    for(let e in state){
      if(state[e] && !ev.includes(e)) ok=false;
    }
    g.classList.toggle("hidden",!ok);
  });
}
document.getElementById("reset").onclick=()=>{
  for(let k in state) delete state[k];
  filter();
}
render();
