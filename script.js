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

  btn.textContent = currentLang === 'es' ? 'Uniendo...' : 'Joining...';
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

// ===== MORE REVIEWS TOGGLE =====
function toggleMoreReviews() {
  var extra = document.getElementById('reviewsExtra');
  var btn = document.getElementById('reviewsToggle');
  if (extra.style.display === 'none') {
    extra.style.display = '';
    btn.innerHTML = currentLang === 'es' ? '\uD83D\uDC9C Ver menos' : '\uD83D\uDC9C Show less';
    if (currentLang === 'es') applyLang('es');
  } else {
    extra.style.display = 'none';
    btn.innerHTML = currentLang === 'es' ? '\uD83D\uDC9C Ver 2 reseñas más' : '\uD83D\uDC9C See 2 more reviews';
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

  document.querySelectorAll('.problem-card, .feature-card, .review-card, .stat').forEach(function(el) {
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
  { s: '.nav-links a[href="/faq.html"]', en: 'FAQ', es: 'Preguntas' },
  { s: '.nav-cta', en: 'I need this', es: 'Lo necesito' },
  // Hero
  { s: '.hero-badge', en: '💜 Launching May 9, 2026', es: '💜 Lanzamiento 9 de Mayo, 2026' },
  { s: '.hero h1', en: 'For ADHD Moms Who Feel Like They\'re <span class="gradient-text">Drowning</span>', es: 'Para Mamás con TDAH Que Sienten Que Se Están <span class="gradient-text">Ahogando</span>', html: true },
  { s: '.hero-sub', en: 'Feel calm, clear, and back in control in 60 seconds.<br><span class="hero-sub-light">No systems. No pressure. Just relief that actually works.</span>', es: 'Siéntete tranquila, clara y en control otra vez en 60 segundos.<br><span class="hero-sub-light">Sin sistemas. Sin presión. Solo alivio que de verdad funciona.</span>', html: true },
  { s: '#heroBtn', en: '👉 I need this', es: '👉 Lo necesito' },
  { s: '.hero-proof', en: '💜 <strong><span id="waitlistCount">127</span> moms</strong> already said &ldquo;I need this&rdquo;', es: '💜 <strong><span id="waitlistCount">127</span> mamás</strong> ya dijeron &ldquo;lo necesito&rdquo;', html: true },
  // (countdown labels handled directly in applyLang)
  // Problem
  { s: '.problem .section-title', en: 'ADHD Mom Life: Sound <span class="highlight">familiar?</span>', es: 'Vida de mamá con TDAH: ¿Te suena <span class="highlight">familiar?</span>', html: true },
  { s: '.problem-card:nth-child(1) p', en: 'Your brain has <strong>47 tabs open</strong> and none are loading.', es: 'Tu cerebro tiene <strong>47 pestañas abiertas</strong> y ninguna carga.', html: true },
  { s: '.problem-card:nth-child(2) p', en: 'Everyone needs something. <strong>Right now.</strong>', es: 'Todos necesitan algo. <strong>Ahora mismo.</strong>', html: true },
  { s: '.problem-card:nth-child(3) p', en: 'You\'re <strong>exhausted</strong> but can\'t stop racing at 2am.', es: 'Estás <strong>agotada</strong> pero no paras a las 2am.', html: true },
  { s: '.problem-card:nth-child(4) p', en: 'Forgot why you walked into the room. <strong>Again.</strong>', es: 'Olvidaste por qué entraste al cuarto. <strong>Otra vez.</strong>', html: true },
  { s: '.problem-cta', en: 'You\'re not failing. Your brain just works differently.<br><strong>ThriveMom™ was built for brains like yours.</strong>', es: 'No estás fallando. Tu cerebro simplemente funciona diferente.<br><strong>ThriveMom™ fue hecho para cerebros como el tuyo.</strong>', html: true },
  // Features
  { s: '.features .section-title', en: 'ADHD Mom Tools: Stupid <span class="highlight">simple.</span> Actually helpful.', es: 'Herramientas para mamás TDAH: Súper <span class="highlight">simple.</span> Realmente útiles.', html: true },
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
  // Reviews section (replaces old founder-quote social proof)
  { s: '.social-proof .section-title', en: 'Real ADHD moms. <span class="highlight">Real relief.</span>', es: 'Mamás reales con TDAH. <span class="highlight">Alivio real.</span>', html: true },
  { s: '.social-proof .section-desc', en: 'From beta testers already using ThriveMom™.', es: 'De beta testers que ya usan ThriveMom™.' },
  // Review card 1 — Sarah (always visible)
  { s: '.reviews-grid:not(.reviews-extra) .review-card:nth-child(1) .review-context', en: '🌙 At 2am meltdown', es: '🌙 En crisis a las 2am' },
  { s: '.reviews-grid:not(.reviews-extra) .review-card:nth-child(1) .review-quote', en: '"I cried the first time I used it. My brain finally slowed down. <strong>I tried 4 other apps. None worked like this.</strong>"', es: '"Lloré la primera vez que la usé. Mi cerebro por fin se calmó. <strong>Probé 4 apps. Ninguna funcionó así.</strong>"', html: true },
  { s: '.reviews-grid:not(.reviews-extra) .review-card:nth-child(1) .review-meta span', en: 'Austin, TX &middot; Mom of 2<br>Day 3 with ThriveMom', es: 'Austin, TX &middot; Mamá de 2<br>Día 3 con ThriveMom', html: true },
  // Review card 2 — Jessica (hidden until expanded)
  { s: '.reviews-extra .review-card:nth-child(1) .review-context', en: '⚡ During school morning chaos', es: '⚡ En el caos mañanero de la escuela' },
  { s: '.reviews-extra .review-card:nth-child(1) .review-quote', en: '"I stopped feeling like a bad mom every day. <strong>Not because I\'m doing more. Because I finally feel like I can.</strong>"', es: '"Dejé de sentirme como una mala mamá todos los días. <strong>No porque haga más. Porque por fin siento que puedo.</strong>"', html: true },
  { s: '.reviews-extra .review-card:nth-child(1) .review-meta span', en: 'Portland, OR &middot; Mom of 3<br>2 weeks in, used daily', es: 'Portland, OR &middot; Mamá de 3<br>2 semanas, uso diario', html: true },
  // Review card 3 — Maria (hidden until expanded)
  { s: '.reviews-extra .review-card:nth-child(2) .review-context', en: '💫 After trying 6 apps', es: '💫 Después de probar 6 apps' },
  { s: '.reviews-extra .review-card:nth-child(2) .review-quote', en: '"This is the only app I\'ve ever actually used consistently. <strong>After 6 productivity apps in 2 years, that\'s a miracle.</strong>"', es: '"Es la única app que realmente he usado con constancia. <strong>Después de 6 apps de productividad en 2 años, eso es un milagro.</strong>"', html: true },
  { s: '.reviews-extra .review-card:nth-child(2) .review-meta span', en: 'Miami, FL &middot; Mom of 1<br>21 days, daily user', es: 'Miami, FL &middot; Mamá de 1<br>21 días, uso diario', html: true },
  // Review stats strip
  { s: '.review-stats .stat:nth-child(1) .stat-label', en: 'Average time to feel relief', es: 'Tiempo promedio para sentir alivio' },
  { s: '.review-stats .stat:nth-child(2) .stat-label', en: 'Core tools, zero overwhelm', es: 'Herramientas, cero agobio' },
  { s: '.review-stats .stat:nth-child(3) .stat-label', en: 'Built for ADHD brains', es: 'Hecho para cerebros con TDAH' },
  // Founder one-liner
  { s: '.founder-line p', en: 'Built by <strong>Heidi</strong>, an ADHD mom of 3, because she needed it herself.', es: 'Hecho por <strong>Heidi</strong>, mamá con TDAH de 3, porque ella lo necesitaba.', html: true },
  // Waitlist CTA
  { s: '.waitlist-box h2', en: 'Be the first to try ThriveMom™', es: 'Sé la primera en probar ThriveMom™' },
  { s: '.waitlist-box > p', en: 'First 500 moms get <strong>lifetime early access pricing</strong>. No spam, just launch updates.', es: 'Las primeras 500 mamás obtienen <strong>precio de acceso temprano de por vida</strong>. Sin spam, solo actualizaciones.', html: true },
  { s: '#waitlistBtn', en: 'I Need This', es: 'Lo necesito' },
  // Founder
  // Waitlist progress
  { s: '.waitlist-count', en: '💜 373 spots left', es: '💜 373 lugares restantes', html: true },
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
  { s: '.footer-links a[href="/faq.html"]', en: 'FAQ', es: 'Preguntas' },
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

  // Update SEO meta tags for Spanish
  document.title = lang === 'es'
    ? 'ThriveMom\u2122 | Mam\u00e1s con TDAH: Calma, Claridad y Control Otra Vez'
    : 'ThriveMom\u2122 | ADHD Moms: Calm, Clear, and in Control Again';

  var descMeta = document.querySelector('meta[name="description"]');
  if (descMeta) descMeta.content = lang === 'es'
    ? 'ThriveMom\u2122: la primera app para mam\u00e1s con TDAH. Siente calma, claridad y control en 60 segundos. Descargas mentales, lotes de tareas, resets guiados, chat, seguimiento de \u00e1nimo.'
    : 'ThriveMom\u2122: the first app for ADHD moms. Feel calm, clear, and in control in 60 seconds. Brain dumps, task batching, guided resets, chat, mood tracking.';

  var ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = lang === 'es'
    ? 'ThriveMom\u2122 | La App Para Mam\u00e1s con TDAH'
    : 'ThriveMom\u2122 | The App for ADHD Moms';

  var ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.content = lang === 'es'
    ? 'La primera app para mam\u00e1s con TDAH. Siente calma, claridad y control en 60 segundos. Descarga mental, lotes de tareas, resets guiados, chat 24/7, bilingüe EN/ES.'
    : 'The first app for ADHD moms. Feel calm, clear, and in control again in under 60 seconds. Brain dump sorting, task batching, guided resets, 24/7 chat, mood tracking, bilingual EN/ES. Join the waitlist.';

  var ogLocale = document.querySelector('meta[property="og:locale"]');
  if (ogLocale) ogLocale.content = lang === 'es' ? 'es_ES' : 'en_US';

  var twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.content = lang === 'es'
    ? 'ThriveMom\u2122 | La App Para Mam\u00e1s con TDAH'
    : 'ThriveMom\u2122 | The App for ADHD Moms';

  var twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) twDesc.content = lang === 'es'
    ? 'La primera app para mam\u00e1s con TDAH. Siente calma, claridad y control en 60 segundos.'
    : 'The first app for ADHD moms. Feel calm, clear, and in control again in 60 seconds. Join the waitlist.';

  // Update keywords meta tag
  var kwMeta = document.querySelector('meta[name="keywords"]');
  if (kwMeta) kwMeta.content = lang === 'es'
    ? 'app para mam\u00e1s con TDAH, maternidad TDAH, ayuda mam\u00e1 abrumada, app apoyo TDAH, herramientas TDAH mam\u00e1s, agotamiento mam\u00e1, descarga mental, p\u00e9rdida peso mental, atrapa caos, lotes de tareas TDAH, app biling\u00fce TDAH, mam\u00e1 latina TDAH'
    : 'ADHD mom app, ADHD motherhood, overwhelmed mom help, ADHD support app, ADHD tools for moms, mom burnout, ADHD mom support, brain dump app, mental weight loss, chaos catcher, ADHD task batching, bilingual ADHD app, Latina ADHD mom';

  // Countdown labels
  var cdLabels = document.querySelectorAll('.countdown-label');
  var cdEN = ['Days', 'Hours', 'Min', 'Sec'];
  var cdES = ['D\u00edas', 'Horas', 'Min', 'Seg'];
  cdLabels.forEach(function(el, i) {
    el.textContent = lang === 'es' ? (cdES[i] || '') : (cdEN[i] || '');
  });

  // Success messages
  var heroSuccessP = document.querySelector('#heroSuccess p');
  if (heroSuccessP) heroSuccessP.textContent = lang === 'es' ? '\u00a1Est\u00e1s en la lista! Revisa tu bandeja.' : "You're on the list! Check your inbox.";
  var waitlistSuccessP = document.querySelector('#waitlistSuccess p');
  if (waitlistSuccessP) waitlistSuccessP.textContent = lang === 'es' ? '\u00a1Est\u00e1s dentro! Te escribiremos antes que a nadie.' : "You're in! We'll email you before anyone else.";

  translations.forEach(function(t) {
    var el = document.querySelector(t.s);
    if (!el) return;
    var text = lang === 'es' ? t.es : t.en;
    if (t.html) { el.innerHTML = text; } else { el.textContent = text; }
  });

  // Update placeholders
  var heroEmail = document.getElementById('heroEmail');
  if (heroEmail) heroEmail.placeholder = lang === 'es' ? 'Ingresa tu email' : 'Enter your email';
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

  // Update reviews toggle button
  var revToggle = document.getElementById('reviewsToggle');
  if (revToggle) {
    var revExtra = document.getElementById('reviewsExtra');
    var revOpen = revExtra && revExtra.style.display !== 'none';
    if (revOpen) {
      revToggle.innerHTML = lang === 'es' ? '\uD83D\uDC9C Ver menos' : '\uD83D\uDC9C Show less';
    } else {
      revToggle.innerHTML = lang === 'es' ? '\uD83D\uDC9C Ver 2 reseñas más' : '\uD83D\uDC9C See 2 more reviews';
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

  // (FAQ content moved to /faq.html — no in-page FAQ to translate here)

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
