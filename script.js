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
    fetch(SHEETS_WEBHOOK, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(function() {});
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

// ===== CLOSE MOBILE NAV ON LINK CLICK =====
document.querySelectorAll('.nav-links a').forEach(function(link) {
  link.addEventListener('click', function() {
    document.getElementById('navLinks').classList.remove('open');
  });
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

// Add scroll animation CSS dynamically
(function() {
  var style = document.createElement('style');
  style.textContent = '.animate-on-scroll { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease; } .animate-on-scroll.visible { opacity: 1; transform: translateY(0); } .animate-on-scroll:nth-child(2) { transition-delay: 0.1s; } .animate-on-scroll:nth-child(3) { transition-delay: 0.2s; } .animate-on-scroll:nth-child(4) { transition-delay: 0.3s; } .animate-on-scroll:nth-child(5) { transition-delay: 0.4s; } .animate-on-scroll:nth-child(6) { transition-delay: 0.5s; }';
  document.head.appendChild(style);
})();
