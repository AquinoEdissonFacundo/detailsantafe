// ---------- Loader ----------
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hide');
    document.body.style.overflow = '';
    revealCheck();
  }, 1100);
});
document.body.style.overflow = 'hidden';
setTimeout(()=>{ document.body.style.overflow = ''; }, 2000);

// ---------- Nav scroll state ----------
const nav = document.getElementById('nav');
const onScroll = () => {
  const scrolled = window.scrollY > 40;
  nav.classList.toggle('scrolled', scrolled);
  document.getElementById('wa-float').classList.toggle('show', window.scrollY > 400);
};
document.addEventListener('scroll', onScroll, {passive:true});
onScroll();

// ---------- Mobile menu ----------
const burger = document.getElementById('burger');
const mmenu = document.getElementById('mmenu');
burger.addEventListener('click', () => {
  mmenu.classList.toggle('open');
  const lines = burger.querySelectorAll('.mline');
  lines[0].style.transform = mmenu.classList.contains('open') ? 'translateY(3.5px) rotate(45deg)' : '';
  lines[1].style.transform = mmenu.classList.contains('open') ? 'translateY(-3.5px) rotate(-45deg)' : '';
});
document.querySelectorAll('.mnav-link').forEach(a => a.addEventListener('click', () => {
  mmenu.classList.remove('open');
  burger.querySelectorAll('.mline').forEach(l => l.style.transform = '');
}));

// ---------- Scroll reveal ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold:0.15, rootMargin:'0px 0px -60px 0px' });
function revealCheck(){
  document.querySelectorAll('.reveal, .reveal-pop, .stagger').forEach(el => io.observe(el));
}
revealCheck();

// ---------- Lightbox ----------
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
function openLightbox(src, title){
  lightboxImg.src = src;
  lightboxImg.alt = title || '';
  lightboxTitle.textContent = title || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox(){
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
document.querySelectorAll('[data-lightbox]').forEach(el => {
  el.addEventListener('click', () => openLightbox(el.getAttribute('data-lightbox'), el.getAttribute('data-lightbox-title')));
});
document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if(e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeLightbox(); });

document.querySelectorAll('.hero-line').forEach((el,i) => {
  setTimeout(()=> el.classList.add('in'), 1200 + i*110);
});

// ---------- Light parallax on hero ----------
const heroImg = document.querySelector('.hero-img');
document.addEventListener('scroll', () => {
  const y = window.scrollY;
  if(y < window.innerHeight) heroImg.style.transform = `translateY(${y*0.15}px) scale(${1.04 + y*0.00006})`;
}, {passive:true});

// ---------- WhatsApp form helper ----------
const WA_NUMBER = "5493424062146";
function waOpen(text){
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
}
function shakeField(el){
  el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); el.focus();
}

document.getElementById('pf-submit').addEventListener('click', () => {
  const nombre = document.getElementById('pf-nombre');
  if(!nombre.value.trim()){ shakeField(nombre); return; }
  const auto = document.getElementById('pf-auto').value || 'A confirmar';
  const servicio = document.getElementById('pf-servicio').value;
  const zonas = document.getElementById('pf-zonas').value || '-';
  const text = `Hola! Quiero cotizar un servicio en Detail Santa Fe 🚘\n\nNombre: ${nombre.value}\nAuto: ${auto}\nServicio: ${servicio}\nPiezas a cubrir: ${zonas}`;
  waOpen(text);
});

// smooth-scroll for in-page anchors
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id=a.getAttribute('href');
    if(id.length>1){
      const target=document.querySelector(id);
      if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth', block:'start'}); }
    }
  });
});