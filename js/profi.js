// Profi Grundlogik – Schritt 1
const beweise=['EMF','Orbs','Spirit Box','UV','Gefriertemperatur','Geisterbuch','DOTS'];
const geister=[
{name:'Banshee',beweise:['UV','Orbs','DOTS']},
{name:'Dschinn',beweise:['EMF','UV','Gefriertemperatur']},
{name:'Der Mimik',beweise:['Orbs','Spirit Box','Gefriertemperatur']}
];

const bWrap=document.getElementById('beweise');
const gWrap=document.getElementById('geister');

beweise.forEach(b=>{
 const btn=document.createElement('button');
 btn.textContent=b;
 btn.dataset.state=0;
 btn.onclick=()=>toggle(btn);
 bWrap.appendChild(btn);
});

function render(){
 gWrap.innerHTML='';
 geister.forEach(g=>{
  const d=document.createElement('div');
  d.className='geist';
  d.textContent=g.name;
  gWrap.appendChild(d);
 });
}
function toggle(btn){
 btn.dataset.state=(+btn.dataset.state+1)%3;
}
document.getElementById('reset').onclick=()=>{
 document.querySelectorAll('#beweise button').forEach(b=>b.dataset.state=0);
};
render();
