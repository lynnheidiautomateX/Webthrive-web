// ===== COUNTDOWN TO MAY 9, 2026 =====
(function() {
  var launchDate = new Date('2026-05-09T09:00:00-04:00').getTime();

  function updateCountdown() {
    var now = new Date().getTime();
    var diff = launchDate - now;

    if (diff <= 0) {
      document.getElementById('cd-days').textContent = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-mins').textContent = '00';
      document.getElementById('cd-secs').textContent = '00';
      return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var secs = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cd-days').textContent = days < 10 ? '0' + days : days;
    document.getElementById('cd-hours').textContent = hours < 10 ? '0' + hours : hours;
    document.getElementById('cd-mins').textContent = mins < 10 ? '0' + mins : mins;
    document.getElementById('cd-secs').textContent = secs < 10 ? '0' + secs : secs;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

// ===== WAITLIST FORM =====
function handleWaitlist(e, formId) {
  e.preventDefault();

  var emailInput = document.getElementById(formId === 'hero' ? 'heroEmail' : 'waitlistEmail');
  var btn = document.getElementById(formId === 'hero' ? 'heroBtn' : 'waitlistBtn');
  var email = emailInput.value.trim();

  btn.textContent = 'Joining...';
  btn.disabled = true;

  // Send to Google Sheets webhook
  var SHEETS_WEBHOOK = 'https://script.google.com/macros/s/AKfycbxz_Nt9WLtOl8T2LBCiu38CrJhf6K8dpLEhqTAa4xtDUyuF6Uy2KNbNYCFbqXTX9Tv1/exec';
  var payload = {
    email: email,
    source: formId,
    submittedAt: new Date().toISOString()
  };

  if (SHEETS_WEBHOOK.indexOf('script.google.com') !== -1) {
    var url = SHEETS_WEBHOOK + '?email=' + encodeURIComponent(payload.email) + '&source=' + encodeURIComponent(payload.source) + '&submittedAt=' + encodeURIComponent(payload.submittedAt);
    fetch(url, { method: 'GET', mode: 'no-cors' }).catch(function() {});
  }

  console.log('Waitlist signup:', payload);

  // Show success
  if (formId === 'hero') {
    document.getElementById('heroForm').style.display = 'none';
    document.getElementById('heroSuccess').style.display = 'block';
  } else {
    document.getElementById('waitlistForm').style.display = 'none';
    document.getElementById('waitlistSuccess').style.display = 'block';
  }

  // Bump counter
  var count = parseInt(document.getElementById('waitlistCount').textContent) + 1;
  document.getElementById('waitlistCount').textContent = count;
  document.getElementById('waitlistCount2').textContent = count;

  return false;
}

// ===== SHARE =====
function shareOn(platform) {
  var url = 'https://thrivemom.app';
  var text = 'I just joined the ThriveMom waitlist. An app built for ADHD moms, by an ADHD mom. Relief in 60 seconds. Check it out:';

  if (platform === 'twitter') {
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url), '_blank');
  } else if (platform === 'facebook') {
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url), '_blank');
  } else if (platform === 'copy') {
    navigator.clipboard.writeText(url).then(function() {
      var btns = document.querySelectorAll('.share-btn.copy');
      btns.forEach(function(b) { b.textContent = '\u2713'; });
      setTimeout(function() {
        btns.forEach(function(b) { b.innerHTML = '&#128279;'; });
      }, 2000);
    });
  }
}

// ===== FAQ =====
function toggleFaq(btn) {
  var item = btn.parentElement;
  var wasOpen = item.classList.contains('open');

  document.querySelectorAll('.faq-item').forEach(function(i) {
    i.classList.remove('open');
    i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
  });

  if (!wasOpen) {
    item.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
}

// ===== CLOSE MOBILE NAV ON LINK CLICK OR ESCAPE =====
document.querySelectorAll('.nav-links a').forEach(function(link) {
  link.addEventListener('click', function() {
    document.getElementById('navLinks').classList.remove('open');
  });
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.getElementById('navLinks').classList.remove('open');
  }
});

// ===== SCROLL ANIMATIONS =====
(function() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.problem-card, .feature-card, .step, .proof-card, .stat, .faq-item').forEach(function(el) {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });
})();

// ===== LANGUAGE TOGGLE =====
var LANG_KEY = 'thrivemom_web_lang';
var currentLang = localStorage.getItem(LANG_KEY) || 'en';

// Translation map: CSS selector -> { en, es }
var translations = [
  // Nav
  { s: '.nav-links a[href="#features"]', en: 'Features', es: 'Funciones' },
  { s: '.nav-links a[href="#how-it-works"]', en: 'How It Works', es: 'Cómo Funciona' },
  { s: '.nav-links a[href="#faq"]', en: 'FAQ', es: 'Preguntas' },
  { s: '.nav-cta', en: 'Join Waitlist', es: 'Únete' },
  // Hero
  { s: '.hero-badge', en: 'Pre-Launch: May 9, 2026', es: 'Pre-Lanzamiento: 9 de Mayo, 2026' },
  { s: '.hero h1', en: 'Your brain is full.<br><span class="gradient-text">Dump it. We\'ll sort it.</span>', es: 'Tu cerebro está lleno.<br><span class="gradient-text">Sácalo. Nosotros lo ordenamos.</span>', html: true },
  { s: '.hero-sub', en: 'The Chaos Catcher: speak or type everything in your head.<br>AI sorts it into action. Relief in 60 seconds. Built by an ADHD mom.', es: 'El Atrapa Caos: habla o escribe todo lo que tienes en la cabeza.<br>Lo ordenamos en acción. Alivio en 60 segundos. Hecho por una mamá con TDAH.', html: true },
  { s: '#heroBtn', en: 'Join the Waitlist', es: 'Únete a la Lista' },
  { s: '.hero-proof', en: '💜 <span id="waitlistCount">127</span> moms already on the waitlist', es: '💜 <span id="waitlistCount">127</span> mamás ya en la lista', html: true },
  // Countdown
  { s: '.countdown-label:nth-of-type(1)', en: 'Days', es: 'Días' },
  // Problem
  { s: '.problem .section-title', en: 'Sound <span class="highlight">familiar?</span>', es: '¿Te suena <span class="highlight">familiar?</span>', html: true },
  { s: '.problem-card:nth-child(1) p', en: 'Your brain has <strong>47 tabs open</strong> and none of them are loading.', es: 'Tu cerebro tiene <strong>47 pestañas abiertas</strong> y ninguna está cargando.', html: true },
  { s: '.problem-card:nth-child(2) p', en: 'Everyone needs something from you. <strong>Right now.</strong>', es: 'Todos necesitan algo de ti. <strong>Ahora mismo.</strong>', html: true },
  { s: '.problem-card:nth-child(3) p', en: 'You\'re <strong>exhausted</strong> but your mind won\'t stop racing at 2am.', es: 'Estás <strong>agotada</strong> pero tu mente no para a las 2am.', html: true },
  { s: '.problem-card:nth-child(4) p', en: 'You forgot why you walked into the room. <strong>Again.</strong>', es: 'Olvidaste por qué entraste al cuarto. <strong>Otra vez.</strong>', html: true },
  { s: '.problem-cta', en: 'You\'re not failing. Your brain just works differently.<br><strong>ThriveMom was built for brains like yours.</strong>', es: 'No estás fallando. Tu cerebro simplemente funciona diferente.<br><strong>ThriveMom fue hecho para cerebros como el tuyo.</strong>', html: true },
  // Features
  { s: '.features .section-title', en: '9 tools. Zero <span class="highlight">overwhelm.</span>', es: '9 herramientas. Cero <span class="highlight">agobio.</span>', html: true },
  { s: '.features .section-desc', en: 'Every feature built for how your brain actually works. Not how apps think it should.', es: 'Cada función diseñada para cómo tu cerebro realmente funciona. No como las apps creen que debería.' },
  { s: '.feature-card:nth-child(1) h3', en: 'The Chaos Catcher', es: 'El Atrapa Caos' },
  { s: '.feature-card:nth-child(1) p', en: 'Brain full? Dump it all out by voice or text. Our AI sorts your chaos into action categories: groceries, kids, admin, self-care. One button: "Sort My Chaos."', es: 'Cerebro lleno? Saca todo por voz o texto. Organizamos tu caos en categorías: compras, niños, admin, autocuidado. Un botón: "Ordena Mi Caos."' },
  { s: '.feature-card:nth-child(2) h3', en: 'Sparkle Sessions', es: 'Sesiones Sparkle' },
  { s: '.feature-card:nth-child(2) p', en: 'Tiny task batches that feel doable. Towel load. Clear the island. 5 minutes, step by step, with confetti when you\'re done. 60+ sessions across 18 categories.', es: 'Pequeñas tandas de tareas que se sienten posibles. Carga de toallas. Limpiar la isla. 5 minutos, paso a paso, con confeti cuando termines. 60+ sesiones en 18 categorías.' },
  { s: '.feature-card:nth-child(3) h3', en: 'Your 2am Friend', es: 'Tu Amiga de las 2am' },
  { s: '.feature-card:nth-child(3) p', en: '24/7 judgment-free chat that understands your ADHD mom brain. Real strategies, real talk, whenever you need it. Available in English and Spanish.', es: 'Chat 24/7 sin juicios que entiende tu cerebro de mamá con TDAH. Estrategias reales, conversación real. Disponible en inglés y español.' },
  { s: '.feature-card:nth-child(4) h3', en: 'Quick Reset', es: 'Reset Rápido' },
  { s: '.feature-card:nth-child(4) p', en: 'Mood-specific breathing exercises. Feeling overwhelmed? Different reset than feeling anxious. Personalized to what you actually need right now.', es: 'Ejercicios de respiración según tu estado de ánimo. ¿Abrumada? Reset diferente a cuando estás ansiosa. Personalizado a lo que realmente necesitas.' },
  { s: '.feature-card:nth-child(5) h3', en: 'Ask for Help', es: 'Pide Ayuda' },
  { s: '.feature-card:nth-child(5) p', en: 'Can\'t find the words? We wrote them. Pre-written messages to your partner or mom friend. Customize or send as-is. One tap to text.', es: '¿No encuentras las palabras? Ya las escribimos. Mensajes pre-escritos para tu pareja o amiga. Personaliza o envía tal cual. Un toque.' },
  { s: '.feature-card:nth-child(6) h3', en: 'Mood Tracking', es: 'Seguimiento de Ánimo' },
  { s: '.feature-card:nth-child(6) p', en: 'Spot your patterns. Daily check-ins, weekly mood maps, wins jar, and streaks. Zero effort logging with daily ADHD micro-lessons.', es: 'Descubre tus patrones. Check-ins diarios, mapas de ánimo semanales, frasco de victorias y rachas. Registro sin esfuerzo con micro-lecciones diarias.' },
  { s: '.feature-card:nth-child(7) h3', en: 'Focus Timer', es: 'Temporizador de Enfoque' },
  { s: '.feature-card:nth-child(7) p', en: 'ADHD-friendly timer that breaks tasks into tiny, doable chunks. With celebration when you finish.', es: 'Temporizador amigable con el TDAH que divide tareas en pedacitos posibles. Con celebración cuando terminas.' },
  { s: '.feature-card:nth-child(8) h3', en: 'Bilingual: EN + ES', es: 'Bilingüe: EN + ES' },
  { s: '.feature-card:nth-child(8) p', en: 'Full Spanish support for Latina ADHD moms. Switch between English and Spanish anytime. Because every mama deserves support in her language.', es: 'Soporte completo en español para mamás latinas con TDAH. Cambia entre inglés y español cuando quieras. Porque toda mamá merece apoyo en su idioma.' },
  // Mental Weight
  { s: '#mental-weight .section-title', en: 'Your new flex: <span class="highlight">Mental Weight Loss</span>', es: 'Tu nuevo logro: <span class="highlight">Pérdida de Peso Mental</span>', html: true },
  { s: '#mental-weight .section-desc', en: 'Every time you brain dump, ThriveMom tracks how much mental clutter you cleared. Share your stats. Watch other moms say "I need this."', es: 'Cada vez que haces un descarga mental, ThriveMom mide cuánto desorden mental liberaste. Comparte tus stats. Mira a otras mamás decir "necesito esto."' },
  { s: '#mental-weight p[style*="text-align: center"]', en: 'Moms are already calling it <strong>"Fitbit for my brain."</strong>', es: 'Las mamás ya lo llaman <strong>"Fitbit para mi cerebro."</strong>', html: true },
  // How it works
  { s: '.how-it-works .section-title', en: 'Stupid <span class="highlight">simple</span>', es: 'Súper <span class="highlight">simple</span>', html: true },
  { s: '.how-it-works .section-desc', en: 'No tutorials. No setup wizard. No 47-step onboarding. Just relief.', es: 'Sin tutoriales. Sin asistente de configuración. Sin 47 pasos. Solo alivio.' },
  { s: '.step:nth-child(1) h3', en: 'Dump your chaos', es: 'Saca tu caos' },
  { s: '.step:nth-child(1) p', en: 'Talk or type everything on your mind. Groceries, kids, guilt, laundry. All of it.', es: 'Habla o escribe todo lo que tienes en mente. Compras, niños, culpa, ropa. Todo.' },
  { s: '.step:nth-child(3) h3', en: 'AI sorts it', es: 'Lo ordenamos' },
  { s: '.step:nth-child(3) p', en: 'One tap: "Sort My Chaos." It organizes everything into categories with next steps.', es: 'Un toque: "Ordena Mi Caos." Organiza todo en categorías con próximos pasos.' },
  { s: '.step:nth-child(5) h3', en: 'Share your wins', es: 'Comparte tus logros' },
  { s: '.step:nth-child(5) p', en: '"I cleared 47 lbs of mental clutter today." Share your Mental Weight Loss on socials.', es: '"Liberé 47 lbs de desorden mental hoy." Comparte tu Pérdida de Peso Mental en redes.' },
  // Social proof
  { s: '.social-proof .section-title', en: 'Built by a mom <span class="highlight">who gets it</span>', es: 'Hecha por una mamá <span class="highlight">que entiende</span>', html: true },
  { s: '.proof-quote', en: '"I built ThriveMom because I needed it myself. As an ADHD mom of 3, I was tired of apps that felt like another chore. ThriveMom meets you where you are, even if that\'s hiding in the bathroom for 60 seconds of peace."', es: '"Construí ThriveMom porque yo misma lo necesitaba. Como mamá con TDAH de 3 hijos, estaba cansada de apps que se sentían como otra tarea. ThriveMom te encuentra donde estás, aunque sea escondida en el baño por 60 segundos de paz."' },
  { s: '.stat:nth-child(1) .stat-label', en: 'Average time to feel relief', es: 'Tiempo promedio para sentir alivio' },
  { s: '.stat:nth-child(2) .stat-label', en: 'Core tools, zero overwhelm', es: 'Herramientas, cero agobio' },
  { s: '.stat:nth-child(3) .stat-label', en: 'Built for ADHD brains', es: 'Hecho para cerebros con TDAH' },
  // Waitlist CTA
  { s: '.waitlist-box h2', en: 'Be the first to try ThriveMom', es: 'Sé la primera en probar ThriveMom' },
  { s: '.waitlist-box > p', en: 'First 500 moms get <strong>lifetime early access pricing</strong>. No spam, just launch updates.', es: 'Las primeras 500 mamás obtienen <strong>precio de acceso temprano de por vida</strong>. Sin spam, solo actualizaciones.', html: true },
  { s: '#waitlistBtn', en: 'Save My Spot', es: 'Guardar Mi Lugar' },
  // FAQ
  { s: '.faq .section-title', en: 'Quick <span class="highlight">answers</span>', es: 'Respuestas <span class="highlight">rápidas</span>', html: true },
  // Footer
  { s: '.footer-brand p', en: 'For ADHD moms, by an ADHD mom.<br>Built with love by a mama who gets it.', es: 'Para mamás con TDAH, por una mamá con TDAH.<br>Hecha con amor por una mamá que entiende.', html: true },
];

function applyLang(lang) {
  currentLang = lang;
  try { localStorage.setItem(LANG_KEY, lang); } catch(e) {}
  document.body.classList.toggle('es', lang === 'es');
  document.documentElement.lang = lang;

  translations.forEach(function(t) {
    var el = document.querySelector(t.s);
    if (!el) return;
    var text = lang === 'es' ? t.es : t.en;
    if (t.html) { el.innerHTML = text; } else { el.textContent = text; }
  });

  // Update placeholders
  var heroEmail = document.getElementById('heroEmail');
  if (heroEmail) heroEmail.placeholder = lang === 'es' ? 'mama@abrumada.com' : 'mama@overwhelmed.com';
  var waitlistEmail = document.getElementById('waitlistEmail');
  if (waitlistEmail) waitlistEmail.placeholder = lang === 'es' ? 'Tu mejor email' : 'Your best email';
}

function toggleLang() {
  applyLang(currentLang === 'es' ? 'en' : 'es');
}

// Apply saved language on load
if (currentLang === 'es') applyLang('es');

// Add scroll animation CSS dynamically
(function() {
  var style = document.createElement('style');
  style.textContent = '.animate-on-scroll { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease; } .animate-on-scroll.visible { opacity: 1; transform: translateY(0); } .animate-on-scroll:nth-child(2) { transition-delay: 0.1s; } .animate-on-scroll:nth-child(3) { transition-delay: 0.2s; } .animate-on-scroll:nth-child(4) { transition-delay: 0.3s; } .animate-on-scroll:nth-child(5) { transition-delay: 0.4s; } .animate-on-scroll:nth-child(6) { transition-delay: 0.5s; }';
  document.head.appendChild(style);
})();
