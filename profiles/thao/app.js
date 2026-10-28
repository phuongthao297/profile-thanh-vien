// Gravity and damping keep the photo moving like a hanging card.
const pendulum=document.querySelector('#pendulum');
const photo=document.querySelector('#photo-card');
let angle=-.025,velocity=0,dragging=false,lastTime=0,elapsed=0,landed=false;
let pointer=null,lastPointerTime=0;
function setAngle(){pendulum.style.transform=`rotate(${angle*180/Math.PI}deg)`;}
function pointAngle(e){
  const r=pendulum.parentElement.getBoundingClientRect();
  const x=r.left+pendulum.offsetLeft+pendulum.offsetWidth/2;
  const y=r.top+pendulum.offsetTop;
  return Math.max(-.5,Math.min(.5,-Math.atan2(e.clientX-x,Math.max(80,e.clientY-y))));
}
photo.addEventListener('pointerdown',e=>{
  dragging=true;landed=true;pointer={x:e.clientX,y:e.clientY};velocity=0;
  lastPointerTime=e.timeStamp;photo.setPointerCapture(e.pointerId);
});
photo.addEventListener('pointermove',e=>{
  if(!dragging)return;
  if(pointer&&Math.hypot(e.clientX-pointer.x,e.clientY-pointer.y)<3)return;
  const next=pointAngle(e),dt=Math.max(.008,(e.timeStamp-lastPointerTime)/1000);
  velocity=.65*velocity+.35*Math.max(-1.2,Math.min(1.2,(next-angle)/dt));
  angle=next;lastPointerTime=e.timeStamp;setAngle();
});
function release(){dragging=false;pointer=null}
photo.addEventListener('pointerup',release);photo.addEventListener('pointercancel',release);
photo.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();landed=true;velocity+=e.key==='ArrowLeft'?.32:-.32}});
function animate(time){
  const dt=lastTime?Math.min((time-lastTime)/1000,.032):0;lastTime=time;elapsed+=dt;
  if(!landed&&elapsed>=.79){landed=true;velocity=.23;}
  if(!dragging){
    velocity+=(-5.2*Math.sin(angle)-.68*velocity)*dt;
    angle+=velocity*dt;
    if(landed&&Math.abs(angle)<.0001&&Math.abs(velocity)<.0001){angle=0;velocity=0;}
    setAngle();
  }
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('active',a.hash==='#'+entry.target.id))}),{rootMargin:'-20% 0px -45% 0px'});
document.querySelectorAll('main>section').forEach(s=>observer.observe(s));

