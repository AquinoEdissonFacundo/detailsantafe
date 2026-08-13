// ---------- Loader ----------
function hideLoader() {
  const loader = document.getElementById('loader');
  if (!loader || loader.classList.contains('hide')) return;
  loader.classList.add('hide');
  document.body.style.overflow = '';
  revealCheck();
}

function scheduleHideLoader(delay = 1100) {
  setTimeout(hideLoader, delay);
}

document.body.style.overflow = 'hidden';

if (document.readyState === 'complete') {
  scheduleHideLoader(1100);
} else {
  window.addEventListener('load', () => scheduleHideLoader(1100), { once: true });
}

// Fallback por si load no dispara (recursos bloqueados en mobile, caché, etc.)
setTimeout(hideLoader, 3500);

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
  if (!heroImg || window.innerWidth < 768) return;
  const y = window.scrollY;
  if (y < window.innerHeight) heroImg.style.transform = `translateY(${y * 0.06}px)`;
}, { passive: true });

// ---------- WhatsApp form helper ----------
const WA_NUMBER = "5493424062146";
function waOpen(text){
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
}
function shakeField(el){
  el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); el.focus();
}

function bindQuoteForm(form) {
  const submitBtn = form.querySelector('[data-quote-submit]');
  if (!submitBtn) return;

  submitBtn.addEventListener('click', () => {
    const nombre = form.querySelector('[data-field="nombre"]');
    if (!nombre || !nombre.value.trim()) {
      if (nombre) shakeField(nombre);
      return;
    }
    const autoEl = form.querySelector('[data-field="auto"]');
    const servicioEl = form.querySelector('[data-field="servicio"]');
    const zonasEl = form.querySelector('[data-field="zonas"]');
    const auto = autoEl?.value || 'A confirmar';
    const servicio = servicioEl?.value || 'A confirmar';
    const zonas = zonasEl?.value || '-';
    const text = `Hola! Quiero cotizar un servicio en Detail Santa Fe 🚘\n\nNombre: ${nombre.value}\nAuto: ${auto}\nServicio: ${servicio}\nQué quiero cubrir: ${zonas}`;
    waOpen(text);
  });
}

document.querySelectorAll('.quote-form').forEach(bindQuoteForm);

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

// ---------- Before / After slider ----------
(function initBeforeAfter() {
  const slider = document.getElementById('ba-slider');
  const handle = document.getElementById('ba-handle');
  if (!slider || !handle) return;

  let dragging = false;

  function setPosition(ratio) {
    const clamped = Math.min(0.92, Math.max(0.08, ratio));
    slider.style.setProperty('--ba', clamped);
    handle.setAttribute('aria-valuenow', Math.round(clamped * 100));
  }

  function positionFromClientX(clientX) {
    const rect = slider.getBoundingClientRect();
    setPosition((clientX - rect.left) / rect.width);
  }

  handle.addEventListener('pointerdown', (e) => {
    dragging = true;
    handle.setPointerCapture(e.pointerId);
    positionFromClientX(e.clientX);
  });

  handle.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    positionFromClientX(e.clientX);
  });

  handle.addEventListener('pointerup', () => { dragging = false; });
  handle.addEventListener('pointercancel', () => { dragging = false; });

  handle.addEventListener('keydown', (e) => {
    const current = parseFloat(getComputedStyle(slider).getPropertyValue('--ba')) || 0.5;
    if (e.key === 'ArrowLeft') { e.preventDefault(); setPosition(current - 0.05); }
    if (e.key === 'ArrowRight') { e.preventDefault(); setPosition(current + 0.05); }
  });

  slider.addEventListener('click', (e) => {
    if (e.target === handle || handle.contains(e.target)) return;
    positionFromClientX(e.clientX);
  });
})();