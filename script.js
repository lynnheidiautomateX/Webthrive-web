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
  var text = 'I just joined the ThriveMom™ waitlist. An app built for ADHD moms, by an ADHD mom. Relief in 60 seconds. Check it out:';

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

// ===== MORE FEATURES TOGGLE =====
function toggleMoreFeatures() {
  var extra = document.getElementById('featuresExtra');
  var btn = document.getElementById('featuresToggle');
  if (extra.style.display === 'none') {
    extra.style.display = '';
    btn.textContent = currentLang === 'es' ? 'Ver menos' : 'Show less';
    // Re-apply translations to newly visible cards
    if (currentLang === 'es') applyLang('es');
  } else {
    extra.style.display = 'none';
    btn.textContent = currentLang === 'es' ? '+ 3 herramientas más' : '+ 3 more tools';
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

  document.querySelectorAll('.problem-card, .feature-card, .proof-card, .stat, .faq-item').forEach(function(el) {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });
})();

// ===== LANGUAGE TOGGLE =====
var LANG_KEY = 'thrivemom_web_lang';
// Check URL param first (?lang=es), then localStorage, then default to 'en'
var urlLang = new URLSearchParams(window.location.search).get('lang');
var currentLang = urlLang === 'es' ? 'es' : (localStorage.getItem(LANG_KEY) || 'en');

// Translation map: CSS selector -> { en, es }
var translations = [
  // Nav
  { s: '.nav-links a[href="#features"]', en: 'Features', es: 'Funciones' },
  { s: '.nav-links a[href="#proof"]', en: 'About', es: 'Nosotras' },
  { s: '.nav-links a[href="#faq"]', en: 'FAQ', es: 'Preguntas' },
  { s: '.nav-cta', en: 'Get Early Access', es: 'Acceso Anticipado' },
  // Hero
  { s: '.hero-badge', en: 'Pre-Launch: May 9, 2026', es: 'Pre-Lanzamiento: 9 de Mayo, 2026' },
  { s: '.hero h1', en: 'The First App Built for ADHD Moms<br>Who Can\'t Keep Up<span class="gradient-text">... and Are Done<br>Feeling Like Failures.</span>', es: 'La Primera App Para Mamás con TDAH<br>Que No Pueden Más<span class="gradient-text">... y Están Cansadas<br>de Sentirse un Fracaso.</span>', html: true },
  { s: '.hero-sub', en: 'So You Can Finally Feel Calm, Clear, and in Control Again.', es: 'Para que por fin te sientas tranquila, clara, y en control otra vez.' },
  { s: '#heroBtn', en: 'Get Early Access', es: 'Obtén Acceso Anticipado' },
  { s: '.hero-proof', en: '💜 <span id="waitlistCount">127</span> moms already on the waitlist', es: '💜 <span id="waitlistCount">127</span> mamás ya en la lista', html: true },
  // Countdown
  { s: '.countdown-label:nth-of-type(1)', en: 'Days', es: 'Días' },
  // Problem
  { s: '.problem .section-title', en: 'Sound <span class="highlight">familiar?</span>', es: '¿Te suena <span class="highlight">familiar?</span>', html: true },
  { s: '.problem-card:nth-child(1) p', en: 'Your brain has <strong>47 tabs open</strong> and none of them are loading.', es: 'Tu cerebro tiene <strong>47 pestañas abiertas</strong> y ninguna está cargando.', html: true },
  { s: '.problem-card:nth-child(2) p', en: 'Everyone needs something from you. <strong>Right now.</strong>', es: 'Todos necesitan algo de ti. <strong>Ahora mismo.</strong>', html: true },
  { s: '.problem-card:nth-child(3) p', en: 'You\'re <strong>exhausted</strong> but your mind won\'t stop racing at 2am.', es: 'Estás <strong>agotada</strong> pero tu mente no para a las 2am.', html: true },
  { s: '.problem-card:nth-child(4) p', en: 'You forgot why you walked into the room. <strong>Again.</strong>', es: 'Olvidaste por qué entraste al cuarto. <strong>Otra vez.</strong>', html: true },
  { s: '.problem-cta', en: 'You\'re not failing. Your brain just works differently.<br><strong>ThriveMom™ was built for brains like yours.</strong>', es: 'No estás fallando. Tu cerebro simplemente funciona diferente.<br><strong>ThriveMom™ fue hecho para cerebros como el tuyo.</strong>', html: true },
  // Features
  { s: '.features .section-title', en: 'Stupid <span class="highlight">simple.</span> Tools that actually help.', es: 'Súper <span class="highlight">simple.</span> Herramientas que realmente ayudan.', html: true },
  { s: '.features .section-desc', en: 'No tutorials. No setup wizard. No 47-step onboarding. Just relief. Every feature built for how your brain actually works.', es: 'Sin tutoriales. Sin asistente de configuración. Sin 47 pasos. Solo alivio. Cada función diseñada para cómo tu cerebro realmente funciona.' },
  { s: '.feature-card:nth-child(1) h3', en: 'Mental Weight Tracker', es: 'Medidor de Peso Mental' },
  { s: '.feature-card:nth-child(1) p', en: '"I cleared 47 lbs of mental clutter today." Track how much you\'ve unloaded, see your clarity score, and share it on socials.', es: '"Liberé 47 lbs de desorden mental hoy." Mide cuánto liberaste, ve tu puntaje de claridad, y compártelo en redes.' },
  { s: '.feature-card:nth-child(2) h3', en: 'Sparkle Sessions', es: 'Sesiones Sparkle' },
  { s: '.feature-card:nth-child(2) p', en: 'Tiny task batches that feel doable. Towel load. Clear the island. 5 minutes, step by step, with confetti when you\'re done.', es: 'Pequeñas tandas de tareas que se sienten posibles. Carga de toallas. Limpiar la isla. 5 minutos, paso a paso, con confeti cuando termines.' },
  { s: '.feature-card:nth-child(3) h3', en: 'The Chaos Catcher', es: 'El Atrapa Caos' },
  { s: '.feature-card:nth-child(3) p', en: 'Brain full? Dump it all out by voice or text. We sort your chaos into action categories: groceries, kids, admin, self-care. One button: "Sort My Chaos."', es: '¿Cerebro lleno? Saca todo por voz o texto. Organizamos tu caos en categorías: compras, niños, admin, autocuidado. Un botón: "Ordena Mi Caos."' },
  { s: '.features-grid:not(.features-extra) .feature-card:nth-child(4) h3', en: 'Your 2am Friend', es: 'Tu Amiga de las 2am' },
  { s: '.features-grid:not(.features-extra) .feature-card:nth-child(4) p', en: '24/7 judgment-free chat that understands your ADHD mom brain. Real strategies, real talk, whenever you need it. Available in English and Spanish.', es: 'Chat 24/7 sin juicios que entiende tu cerebro de mamá con TDAH. Estrategias reales, conversación real. Disponible en inglés y español.' },
  { s: '.features-grid:not(.features-extra) .feature-card:nth-child(5) h3', en: 'Bilingual: EN + ES', es: 'Bilingüe: EN + ES' },
  { s: '.features-grid:not(.features-extra) .feature-card:nth-child(5) p', en: 'Full Spanish support for Latina ADHD moms. Switch between English and Spanish anytime. Because every mama deserves support in her language.', es: 'Soporte completo en español para mamás latinas con TDAH. Cambia entre inglés y español cuando quieras. Porque toda mamá merece apoyo en su idioma.' },
  { s: '.features-grid:not(.features-extra) .feature-card:nth-child(6) h3', en: 'Ask for Help', es: 'Pide Ayuda' },
  { s: '.features-grid:not(.features-extra) .feature-card:nth-child(6) p', en: 'Can\'t find the words? We wrote them. Pre-written messages to your partner or mom friend. Customize or send as-is. One tap to text.', es: '¿No encuentras las palabras? Ya las escribimos. Mensajes pre-escritos para tu pareja o amiga. Personaliza o envía tal cual. Un toque.' },
  // (extra feature cards + FAQ handled directly in applyLang)
  // Mental Weight
  { s: '#mental-weight .section-title', en: 'Your new flex: <span class="highlight">Mental Weight Loss</span>', es: 'Tu nuevo logro: <span class="highlight">Pérdida de Peso Mental</span>', html: true },
  { s: '#mental-weight .section-desc', en: 'Every brain dump tracks how much mental clutter you cleared. Share your stats. Watch other moms say "I need this."', es: 'Cada descarga mental mide cuánto desorden liberaste. Comparte tus stats. Mira a otras mamás decir "necesito esto."' },
  // Mental Weight detail items
  { s: '.mw-detail-item:nth-child(1) strong', en: 'Auto-generated share card', es: 'Tarjeta para compartir auto-generada' },
  { s: '.mw-detail-item:nth-child(1) p', en: 'Beautiful, branded image ready for Instagram Stories, TikTok, or Facebook. One tap.', es: 'Imagen bonita y con marca lista para Instagram Stories, TikTok o Facebook. Un toque.' },
  { s: '.mw-detail-item:nth-child(2) strong', en: 'Track your progress', es: 'Sigue tu progreso' },
  { s: '.mw-detail-item:nth-child(2) p', en: 'See your lifetime stats: total dumps, total weight cleared, daily streaks.', es: 'Ve tus estadísticas: total de descargas, peso total liberado, rachas diarias.' },
  { s: '.mw-detail-item:nth-child(3) strong', en: 'The community loop', es: 'El efecto comunidad' },
  { s: '.mw-detail-item:nth-child(3) p', en: 'When moms share their Mental Weight Loss, their friends download the app. Growth that feels like community, not marketing.', es: 'Cuando las mamás comparten su Pérdida de Peso Mental, sus amigas descargan la app. Crecimiento que se siente como comunidad, no marketing.' },
  { s: '.mw-fitbit', en: 'Moms are already calling it <strong>"Fitbit for my brain."</strong>', es: 'Las mamás ya lo llaman <strong>"Fitbit para mi cerebro."</strong>', html: true },
  // Mental Weight share card
  { s: '.mw-card-unit', en: 'lbs of mental clutter <strong>cleared</strong>', es: 'lbs de desorden mental <strong>liberadas</strong>', html: true },
  { s: '.mw-card-clarity', en: 'Brain clarity: <strong>85%</strong>', es: 'Claridad mental: <strong>85%</strong>', html: true },
  { s: '.mw-card-quote', en: '"Today I chose myself for 60 seconds."', es: '"Hoy me elegí a mí misma por 60 segundos."' },
  { s: '.mw-card-tags', en: '#MentalWeightLoss \u00a0 #ADHDMom \u00a0 #ThriveMom', es: '#PérdidaDePesoMental \u00a0 #MamáTDAH \u00a0 #ThriveMom' },
  // (How it works section removed, content merged into features header)
  // Social proof
  { s: '.social-proof .section-title', en: 'Built by a mom <span class="highlight">who gets it</span>', es: 'Hecha por una mamá <span class="highlight">que entiende</span>', html: true },
  { s: '.proof-quote', en: '"I built ThriveMom™ because I needed it myself. As an ADHD mom of 3, I was tired of apps that felt like another chore. ThriveMom™ meets you where you are, even if that\'s hiding in the bathroom for 60 seconds of peace."', es: '"Construí ThriveMom™ porque yo misma lo necesitaba. Como mamá con TDAH de 3 hijos, estaba cansada de apps que se sentían como otra tarea. ThriveMom™ te encuentra donde estás, aunque sea escondida en el baño por 60 segundos de paz."' },
  { s: '.stat:nth-child(1) .stat-label', en: 'Average time to feel relief', es: 'Tiempo promedio para sentir alivio' },
  { s: '.stat:nth-child(2) .stat-label', en: 'Core tools, zero overwhelm', es: 'Herramientas, cero agobio' },
  { s: '.stat:nth-child(3) .stat-label', en: 'Built for ADHD brains', es: 'Hecho para cerebros con TDAH' },
  // Waitlist CTA
  { s: '.waitlist-box h2', en: 'Be the first to try ThriveMom™', es: 'Sé la primera en probar ThriveMom™' },
  { s: '.waitlist-box > p', en: 'First 500 moms get <strong>lifetime early access pricing</strong>. No spam, just launch updates.', es: 'Las primeras 500 mamás obtienen <strong>precio de acceso temprano de por vida</strong>. Sin spam, solo actualizaciones.', html: true },
  { s: '#waitlistBtn', en: 'Save My Spot', es: 'Guardar Mi Lugar' },
  // FAQ title
  { s: '.faq .section-title', en: 'Quick <span class="highlight">answers</span>', es: 'Respuestas <span class="highlight">rápidas</span>', html: true },
  // Founder
  { s: '.proof-author strong', en: 'Heidi', es: 'Heidi' },
  { s: '.proof-author span', en: 'Founder, ADHD Mom of 3', es: 'Fundadora, Mamá con TDAH de 3' },
  // Waitlist progress
  { s: '.waitlist-count', en: '💜 <span id="waitlistCount2">127</span> of 500 early access spots claimed', es: '💜 <span id="waitlistCount2">127</span> de 500 lugares de acceso temprano ocupados', html: true },
  { s: '.waitlist-badge', en: 'Early Access', es: 'Acceso Temprano' },
  // Chaos Catcher phone mockup
  { s: '.chaos-screen .chaos-title', en: 'The Chaos Catcher', es: 'El Atrapa Caos' },
  { s: '.chaos-screen .chaos-subtitle', en: 'Get it all out. I\'m here.', es: 'Saca todo. Aquí estoy.' },
  { s: '.chaos-screen .chaos-mic-label', en: 'Talk it out', es: 'Habla sin filtro' },
  { s: '.chaos-screen .mock-card-title', en: 'SORT MY CHAOS', es: 'ORDENA MI CAOS' },
  { s: '.chaos-screen .mock-card-desc', en: 'Voice or type. We sort it into action.', es: 'Voz o texto. Lo ordenamos en acción.' },
  { s: '.chaos-screen .mock-card-btn', en: 'Let\'s Go', es: 'Vamos' },
  // Chaos bubble words
  { s: '.chaos-word:nth-child(1)', en: 'buy milk', es: 'comprar leche' },
  { s: '.chaos-word:nth-child(2)', en: 'laundry', es: 'ropa sucia' },
  { s: '.chaos-word:nth-child(3)', en: 'call mom', es: 'llamar a mamá' },
  { s: '.chaos-word:nth-child(4)', en: 'I\'m tired', es: 'estoy cansada' },
  { s: '.chaos-word:nth-child(5)', en: 'school form', es: 'formulario escuela' },
  { s: '.chaos-word:nth-child(6)', en: 'prep dinner', es: 'preparar cena' },
  // Footer
  { s: '.footer-brand p', en: 'For ADHD moms, by an ADHD mom.<br>Built with love by a mama who gets it.', es: 'Para mamás con TDAH, por una mamá con TDAH.<br>Hecha con amor por una mamá que entiende.', html: true },
  { s: '.footer-links a[href="mailto:support@thrivemom.app"]', en: 'Contact', es: 'Contacto' },
  { s: '.footer-links a[href="/privacy.html"]', en: 'Privacy Policy', es: 'Política de Privacidad' },
  { s: '.footer-links a[href="/terms.html"]', en: 'Terms & Conditions', es: 'Términos y Condiciones' },
  // (footer-bottom handled directly in applyLang)
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

  // Update features toggle button
  var featToggle = document.getElementById('featuresToggle');
  if (featToggle) {
    var extra = document.getElementById('featuresExtra');
    var isOpen = extra && extra.style.display !== 'none';
    if (isOpen) {
      featToggle.textContent = lang === 'es' ? 'Ver menos' : 'Show less';
    } else {
      featToggle.textContent = lang === 'es' ? '+ 3 herramientas más' : '+ 3 more tools';
    }
  }

  // Extra feature cards (direct DOM access since selector approach fails on hidden container)
  var extraCards = document.querySelectorAll('.features-extra .feature-card');
  var extraData = [
    { en_h: 'Mood Tracking', es_h: 'Seguimiento de Ánimo', en_p: 'Daily check-ins, weekly mood maps, wins jar, and streaks. Zero effort logging with ADHD micro-lessons.', es_p: 'Check-ins diarios, mapas de ánimo semanales, frasco de victorias y rachas. Registro sin esfuerzo con micro-lecciones de TDAH.' },
    { en_h: 'Quick Reset', es_h: 'Reset Rápido', en_p: 'Mood-specific breathing exercises. Personalized to what you actually need right now.', es_p: 'Ejercicios de respiración según tu ánimo. Personalizado a lo que realmente necesitas ahora.' },
    { en_h: 'Focus Timer', es_h: 'Temporizador de Enfoque', en_p: 'Breaks tasks into tiny, doable chunks. With celebration when you finish.', es_p: 'Divide tareas en pedacitos posibles. Con celebración cuando terminas.' }
  ];
  extraCards.forEach(function(card, i) {
    if (!extraData[i]) return;
    var h3 = card.querySelector('h3');
    var p = card.querySelector('p');
    if (h3) h3.textContent = lang === 'es' ? extraData[i].es_h : extraData[i].en_h;
    if (p) p.textContent = lang === 'es' ? extraData[i].es_p : extraData[i].en_p;
  });

  // FAQ questions and answers (direct DOM access)
  var faqItems = document.querySelectorAll('.faq-item');
  var faqData = [
    { en_q: 'When does ThriveMom™ launch?', es_q: '¿Cuándo se lanza ThriveMom™?', en_a: 'May 9, 2026. Join the waitlist to get notified the moment it goes live. Early waitlist members get priority access and special pricing.', es_a: '9 de mayo, 2026. Únete a la lista de espera para recibir notificación en cuanto esté disponible. Los primeros en la lista obtienen acceso prioritario y precio especial.' },
    { en_q: 'Is this only for moms with an ADHD diagnosis?', es_q: '¿Es solo para mamás con diagnóstico de TDAH?', en_a: 'Not at all. Whether you have a formal diagnosis, suspect you might have ADHD, or just feel chronically overwhelmed as a mom, ThriveMom™ is designed for you. If the "47 tabs open" feeling resonated, you\'re in the right place.', es_a: 'Para nada. Ya sea que tengas un diagnóstico formal, sospeches que podrías tener TDAH, o simplemente te sientas crónicamente abrumada como mamá, ThriveMom™ es para ti. Si lo de las "47 pestañas abiertas" te resonó, estás en el lugar correcto.' },
    { en_q: 'Is it free?', es_q: '¿Es gratis?', en_a: 'ThriveMom™ will have a free tier with core features. Early waitlist members (first 500) get lifetime early access pricing on the full version. We believe every mom deserves support, regardless of budget.', es_a: 'ThriveMom™ tendrá un plan gratuito con funciones principales. Los primeros en la lista (primeros 500) obtienen precio de acceso temprano de por vida en la versión completa. Creemos que toda mamá merece apoyo, sin importar el presupuesto.' },
    { en_q: 'What makes ThriveMom™ different?', es_q: '¿Qué hace diferente a ThriveMom™?', en_a: 'Most apps are built for neurotypical brains. ThriveMom™ is specifically designed for ADHD: low friction, instant gratification, no guilt trips, no 30-day programs you\'ll abandon on day 3. Everything takes under 60 seconds to start.', es_a: 'La mayoría de las apps están hechas para cerebros neurotípicos. ThriveMom™ está diseñada específicamente para TDAH: poca fricción, gratificación instantánea, sin culpas, sin programas de 30 días que abandonarás el día 3. Todo toma menos de 60 segundos para empezar.' },
    { en_q: 'What\'s the Chaos Catcher?', es_q: '¿Qué es el Atrapa Caos?', en_a: 'It\'s a brain dump tool. Talk or type everything that\'s swirling in your head: groceries, guilt, school forms, exhaustion. Hit "Sort My Chaos" and it instantly organizes everything into action categories. It also tracks your "Mental Weight" so you can see how many pounds of mental clutter you\'ve cleared and share it.', es_a: 'Es una herramienta de descarga mental. Habla o escribe todo lo que da vueltas en tu cabeza: compras, culpa, formularios del colegio, agotamiento. Presiona "Ordena Mi Caos" y organiza todo instantáneamente en categorías de acción. También rastrea tu "Peso Mental" para que veas cuántas libras de desorden mental has liberado y lo compartas.' },
    { en_q: 'What are Sparkle Sessions?', es_q: '¿Qué son las Sesiones Sparkle?', en_a: 'Tiny, step-by-step task batches designed for ADHD brains. Instead of "clean the house" (impossible), you get "The Towel Load: grab all towels, put in washer, press start." Each one takes just a few minutes, and you get confetti when you finish.', es_a: 'Pequeñas tandas de tareas paso a paso diseñadas para cerebros con TDAH. En vez de "limpiar la casa" (imposible), recibes "La Carga de Toallas: agarra todas las toallas, ponlas en la lavadora, presiona inicio." Cada una toma solo unos minutos, y recibes confeti cuando terminas.' },
    { en_q: 'Is ThriveMom™ available in Spanish?', es_q: '¿ThriveMom™ está disponible en español?', en_a: 'Yes! ThriveMom™ has full bilingual support (English and Spanish). Switch anytime with one tap. Built specifically for Latina ADHD moms who deserve support in their language. Voice input in the Chaos Catcher also works in Spanish.', es_a: '¡Sí! ThriveMom™ tiene soporte bilingüe completo (inglés y español). Cambia en cualquier momento con un toque. Hecho específicamente para mamás latinas con TDAH que merecen apoyo en su idioma. La entrada de voz en el Atrapa Caos también funciona en español.' }
  ];
  faqItems.forEach(function(item, i) {
    if (!faqData[i]) return;
    var btn = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer-inner');
    if (btn) {
      var icon = btn.querySelector('.faq-icon');
      var qText = lang === 'es' ? faqData[i].es_q : faqData[i].en_q;
      // Replace all text nodes, keep the icon span
      while (btn.firstChild && btn.firstChild !== icon) {
        btn.removeChild(btn.firstChild);
      }
      btn.insertBefore(document.createTextNode(qText + ' '), icon);
    }
    if (answer) answer.textContent = lang === 'es' ? faqData[i].es_a : faqData[i].en_a;
  });

  // Footer bottom lines (direct DOM)
  var footerPs = document.querySelectorAll('.footer-bottom p');
  if (footerPs[0]) footerPs[0].innerHTML = lang === 'es' ? '&copy; 2026 ThriveMom™. Todos los derechos reservados.' : '&copy; 2026 ThriveMom™. All rights reserved.';
  if (footerPs[1]) footerPs[1].textContent = lang === 'es' ? 'Hecho con cafeína, caos, y mucho amor.' : 'Made with caffeine, chaos, and a whole lot of love.';
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
