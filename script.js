/* ==================================================================
   BIRTHDAY WEBSITE — SCRIPT.JS
   Organized by feature. Search for "EDIT:" comments to find the
   easiest places to personalize content.
================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ================================================================
     0. UTILITIES
  ================================================================ */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  /* ================================================================
     1. LOADING SCREEN
  ================================================================ */
  (function loadingScreen(){
    const loader = $('#loader');
    const fill = $('#loaderFill');
    const percentEl = $('#loaderPercent');
    const heartsWrap = $('#loaderHearts');
    const circumference = 2 * Math.PI * 52;
    fill.style.strokeDasharray = circumference;
    fill.style.strokeDashoffset = circumference;

    // floating hearts on the loader
    for (let i = 0; i < 14; i++) {
      const h = document.createElement('span');
      h.textContent = pick(['💗','💜','✨','⭐']);
      h.style.left = rand(0, 100) + '%';
      h.style.animationDuration = rand(5, 10) + 's';
      h.style.animationDelay = rand(0, 6) + 's';
      heartsWrap.appendChild(h);
    }

    let progress = 0;
    const tick = setInterval(() => {
      progress += rand(4, 12);
      if (progress >= 100) {
        progress = 100;
        clearInterval(tick);
        setTimeout(() => loader.classList.add('hide'), 500);
      }
      const offset = circumference - (progress / 100) * circumference;
      fill.style.strokeDashoffset = offset;
      percentEl.textContent = Math.floor(progress) + '%';
    }, 220);
  })();

  /* ================================================================
     2. CUSTOM CURSOR
  ================================================================ */
  (function customCursor(){
    const dot = $('#cursorDot');
    const ring = $('#cursorRing');
    if (window.matchMedia('(hover: none)').matches) return;
    let rx = 0, ry = 0, mx = 0, my = 0;
    window.addEventListener('mousemove', (e) => {
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
      mx = e.clientX; my = e.clientY;
    });
    (function loop(){
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(loop);
    })();
    $$('a, button, .gallery-item, .flip-card, .gift-box, .openwhen-card, .wish, .map-pin').forEach(el => {
      el.addEventListener('mouseenter', () => { ring.style.width = '54px'; ring.style.height = '54px'; ring.style.borderColor = 'var(--pink-deep)'; });
      el.addEventListener('mouseleave', () => { ring.style.width = '34px'; ring.style.height = '34px'; });
    });
  })();

  /* ================================================================
     3. SCROLL PROGRESS + BACK TO TOP
  ================================================================ */
  const scrollProgress = $('#scrollProgress');
  const toTopBtn = $('#toTop');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
    toTopBtn.classList.toggle('show', h.scrollTop > 600);
  });
  toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ================================================================
     4. THEME TOGGLE (Dreamy <-> Midnight)
  ================================================================ */
  $('#themeBtn').addEventListener('click', () => {
    const isMidnight = document.documentElement.getAttribute('data-theme') === 'midnight';
    document.documentElement.setAttribute('data-theme', isMidnight ? '' : 'midnight');
  });

  /* ================================================================
     5. MUSIC CONTROL
     EDIT: swap assets/music/music.mp3 with the real song file.
  ================================================================ */
  const bgMusic = $('#bgMusic');
  const musicBtn = $('#musicBtn');
  let musicStarted = false;
  function playMusic(){
    bgMusic.volume = 0.5;
    bgMusic.play().catch(() => {/* autoplay blocked, ignore silently */});
    musicStarted = true;
    musicBtn.classList.remove('muted');
  }
  musicBtn.addEventListener('click', () => {
    if (bgMusic.paused) { playMusic(); }
    else { bgMusic.pause(); musicBtn.classList.add('muted'); }
  });

  /* ================================================================
     6. HERO — floating hearts / flowers + open surprise button
  ================================================================ */
  (function heroAmbience(){
    const heartsWrap = $('#heroHearts');
    const flowersWrap = $('#heroFlowers');
    for (let i = 0; i < 16; i++) {
      const h = document.createElement('span');
      h.textContent = pick(['💗','💕','💜']);
      h.style.left = rand(0,100) + '%';
      h.style.animationDuration = rand(8,16) + 's';
      h.style.animationDelay = rand(0,10) + 's';
      heartsWrap.appendChild(h);
    }
    for (let i = 0; i < 10; i++) {
      const f = document.createElement('span');
      f.textContent = pick(['🌸','🌷','🌼']);
      f.style.left = rand(0,100) + '%';
      f.style.animationDuration = rand(10,18) + 's';
      f.style.animationDelay = rand(0,10) + 's';
      flowersWrap.appendChild(f);
    }
  })();

  $('#openSurpriseBtn').addEventListener('click', () => {
    if (!musicStarted) playMusic();
    $('#letter').scrollIntoView({ behavior: 'smooth' });
    burstConfetti(40);
  });

  /* ================================================================
     7. AMBIENT FIREFLY / PARTICLE LAYER (signature element)
  ================================================================ */
  (function ambientFireflies(){
    const layer = $('#ambientLayer');
    const COUNT = window.innerWidth < 700 ? 12 : 22;
    for (let i = 0; i < COUNT; i++) {
      const p = document.createElement('div');
      p.className = 'ambient-particle';
      const size = rand(3, 7);
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = rand(0, 100) + 'vw';
      p.style.top = rand(20, 100) + 'vh';
      p.style.animationDuration = rand(14, 26) + 's';
      p.style.animationDelay = rand(0, 20) + 's';
      layer.appendChild(p);
    }
  })();

  /* ================================================================
     8. SCROLL REVEAL (generic, used by several sections)
  ================================================================ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.2 });

  function observeAll(selector){ $$(selector).forEach(el => revealObserver.observe(el)); }

  /* ================================================================
     9. SECTION 1 — LETTER ENVELOPE
  ================================================================ */
  $('#envelope').addEventListener('click', function(){
    this.classList.toggle('open');
  });

  /* ================================================================
     10. SECTION 2 — TIMELINE reveal on scroll
  ================================================================ */
  observeAll('.timeline-item');

  /* ================================================================
     11. SECTION 3 — PHOTO GALLERY + LIGHTBOX
     EDIT: change PHOTO_COUNT or file names as needed.
  ================================================================ */
  const PHOTO_COUNT = 12;
  const galleryGrid = $('#galleryGrid');
  const galleryPhotos = [];
  for (let i = 1; i <= PHOTO_COUNT; i++) {
    const src = `assets/images/photo${i}.jpeg`;
    galleryPhotos.push(src);
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `<img src="${src}" alt="Photo ${i}" loading="lazy">`;
    item.addEventListener('click', () => openLightbox(i - 1));
    galleryGrid.appendChild(item);
  }
  observeAll('.gallery-item');

  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightboxImg');
  const lightboxCount = $('#lightboxCount');
  let currentPhoto = 0;

  function openLightbox(idx){
    currentPhoto = idx;
    updateLightbox();
    lightbox.classList.add('open');
  }
  function updateLightbox(){
    lightboxImg.src = galleryPhotos[currentPhoto];
    lightboxCount.textContent = `${currentPhoto + 1} / ${galleryPhotos.length}`;
  }
  $('#lightboxClose').addEventListener('click', () => lightbox.classList.remove('open'));
  $('#lightboxPrev').addEventListener('click', () => { currentPhoto = (currentPhoto - 1 + galleryPhotos.length) % galleryPhotos.length; updateLightbox(); });
  $('#lightboxNext').addEventListener('click', () => { currentPhoto = (currentPhoto + 1) % galleryPhotos.length; updateLightbox(); });
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') lightbox.classList.remove('open');
    if (e.key === 'ArrowLeft') $('#lightboxPrev').click();
    if (e.key === 'ArrowRight') $('#lightboxNext').click();
  });

  /* ================================================================
     12. SECTION 4 — THINGS I LOVE ABOUT YOU (flip cards)
     EDIT: edit this array — icon, title (front) + note (back)
  ================================================================ */
  const loveThings = [
    ['😊','Your Smile','It lights up every room you walk into.'],
    ['💛','Your Kindness','You make everyone around you feel seen.'],
    ['🤝','Your Support','You show up, always, no matter what.'],
    ['⚡','Your Energy','You turn ordinary days into adventures.'],
    ['😂','Your Laugh','Genuinely one of my favorite sounds.'],
    ['🌈','Your Positivity','You find the silver lining every time.'],
    ['🎯','Your Ambition','You chase your dreams fearlessly.'],
    ['🫶','Your Honesty','You tell me the truth, even when it’s hard.'],
    ['🎨','Your Creativity','You see the world differently, beautifully.'],
    ['🧠','Your Wisdom','Your advice always finds me at the right time.'],
    ['🕊️','Your Patience','You never rush me, even when I need time.'],
    ['🔥','Your Passion','You care about things with your whole heart.'],
    ['🎁','Your Generosity','You give more than you ever ask for.'],
    ['🌻','Your Warmth','Being around you just feels like home.'],
    ['💬','Your Humor','You make even bad days feel lighter.'],
    ['🛡️','Your Loyalty','You’ve had my back since day one.'],
    ['🌙','Your Calm','You ground me when everything feels loud.'],
    ['🎶','Your Vibe','Your playlists are somehow always perfect.'],
    ['📖','Your Curiosity','You ask questions no one else thinks to ask.'],
    ['💫','Just You','Simply put — the world’s better with you in it.']
  ];
  const loveGrid = $('#loveGrid');
  loveThings.forEach(([icon, title, note]) => {
    const card = document.createElement('div');
    card.className = 'flip-card';
    card.innerHTML = `
      <div class="flip-inner">
        <div class="flip-front"><span class="flip-icon">${icon}</span><h4>${title}</h4></div>
        <div class="flip-back"><p>${note}</p></div>
      </div>`;
    loveGrid.appendChild(card);
  });

  /* ================================================================
     13. SECTION 5 — 365 REASONS generator
     EDIT: expand/replace this list with real reasons.
  ================================================================ */
  const reasons = [
    'Because your laugh is genuinely my favorite sound.',
    'Because you remember the tiny details I forget I even said.',
    'Because you make ordinary Tuesdays feel like an event.',
    'Because you never let me spiral without a reality check.',
    'Because you celebrate my wins louder than I do.',
    'Because you show up, even at 2am.',
    'Because your hugs fix almost everything.',
    'Because you make people feel important.',
    'Because you’re brave in ways you don’t even notice.',
    'Because your playlists always know what I need.',
    'Because you never make me feel like "too much."',
    'Because you’re the friend everyone wishes they had.',
    'Because you say what you mean, and mean what you say.',
    'Because you make the group chat unbearably funny.',
    'Because your advice is annoyingly always right.',
    'Because you cry at movies and don’t even care.',
    'Because you send memes at exactly the right moment.',
    'Because you’d drop everything if I needed you.',
    'Because you make every trip an adventure.',
    'Because your excitement for my life is so genuine.',
    'Because you never judge, only understand.',
    'Because you make me want to be a better friend too.',
    'Because you remember birthdays, anniversaries, everything.',
    'Because you dance like nobody’s watching, always.',
    'Because you make quiet nights in feel special.',
    'Because you’re endlessly, wonderfully you.',
    'Because your texts always have exactly the right emoji.',
    'Because you turn my bad days around effortlessly.',
    'Because you believe in me even when I don’t.',
    'Because — simply — you’re irreplaceable.'
  ];
  let lastReasonIdx = -1;
  const reasonNumberEl = $('#reasonNumber');
  const reasonTextEl = $('#reasonText');
  const reasonCard = $('#reasonCard');
  $('#reasonBtn').addEventListener('click', () => {
    let idx;
    do { idx = Math.floor(Math.random() * reasons.length); } while (idx === lastReasonIdx && reasons.length > 1);
    lastReasonIdx = idx;
    reasonNumberEl.textContent = '#' + (idx + 1);
    reasonTextEl.textContent = reasons[idx];
    reasonCard.classList.remove('pop');
    void reasonCard.offsetWidth;
    reasonCard.classList.add('pop');
  });

  /* ================================================================
     14. SECTION 6 — DIGITAL GIFTS (redesigned: wrapped presents)
     EDIT: put your files in assets/gifts/ (any of .gif/.jpg/.png work
     since each row just points straight at a filename) and edit the
     title/message/icon below to match.
     Each row: [icon (fallback + box face), title, message, filename]
  ================================================================ */
  const GIFTS_FOLDER = 'assets/gifts/';
  const gifts = [
    ['💖','A Hug For You','A hug for whenever you miss me.', 'gift1.jpg'],
    ['🌸','A Little Smile','Here\u2019s a little smile for your day.', 'gift2.jpg'],
    ['🐻','A Tiny Teddy','A tiny teddy to keep you company.', 'gift3.jpg'],
    ['✨','Lots Of Happiness','Sending you lots of happiness.', 'gift4.jpg'],
    ['🎀','Pocket Of Sunshine','A pocket full of sunshine.', 'gift5.jpg'],
    ['🌈','Keep Smiling','Keep smiling always.', 'gift6.jpg'],
    ['💝','Because You Deserve It','Because you deserve cute things.', 'gift7.jpg'],
    ['🩷','One More Surprise','One more surprise just for you.', 'gift8.jpg']
  ];

  const giftGrid = $('#giftGrid');
  const giftModal = $('#giftModal');
  const giftsProgress = $('#giftsProgress');
  const giftsCelebration = $('#giftsCelebration');
  const openedGifts = new Set();

  gifts.forEach((g, i) => {
    const [icon, title] = g;
    const box = document.createElement('div');
    box.className = 'gift-box';
    box.setAttribute('role', 'button');
    box.setAttribute('tabindex', '0');
    box.setAttribute('aria-label', `Open gift: ${title}`);
    box.innerHTML = `
      <div class="gift-box-inner">
        <span class="gift-badge">✓</span>
        <span class="gift-lid"></span>
        <span class="gift-ribbon-v"></span>
        <span class="gift-ribbon-h"></span>
        <span class="gift-bow"><span class="gift-bow-knot"></span></span>
        <span class="gift-box-icon">${icon}</span>
        <span class="gift-box-sparkle">✨</span>
        <div class="gift-burst"></div>
      </div>
      <p class="gift-box-label">${title}</p>`;
    box.addEventListener('click', () => handleGiftClick(box, i));
    box.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleGiftClick(box, i); } });
    giftGrid.appendChild(box);
  });

  function handleGiftClick(box, i){
    // 1. shake, then 2–4. ribbon unties / lid opens (pure CSS, driven by .opened)
    box.classList.add('shaking');
    setTimeout(() => box.classList.remove('shaking'), 500);

    setTimeout(() => {
      const alreadyOpened = box.classList.contains('opened');
      box.classList.add('opened');
      giftBurstFX(box.querySelector('.gift-burst'));

      if (!alreadyOpened) {
        openedGifts.add(i);
        updateGiftsProgress();
      }
      // small pause so the lid/ribbon animation is visible before the modal appears
      setTimeout(() => openGiftModal(i), 350);
    }, 220);
  }

  function updateGiftsProgress(){
    giftsProgress.textContent = `You've opened ${openedGifts.size} of ${gifts.length} gifts.`;
    if (openedGifts.size === gifts.length) {
      setTimeout(showGiftsCelebration, 500);
    }
  }

  // 5–7. confetti burst + floating hearts + sparkles, scoped to this gift box
  function giftBurstFX(container){
    const colors = ['#ff9ec7','#c9b6e4','#8b6fce','#a8d8f0','#ffd3ae','#fff3c4'];
    for (let i = 0; i < 14; i++) {
      const c = document.createElement('span');
      c.style.left = rand(20, 80) + '%';
      c.style.top = '40%';
      c.style.width = rand(5, 9) + 'px';
      c.style.height = rand(5, 9) + 'px';
      c.style.background = pick(colors);
      c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      c.style.opacity = '1';
      c.style.transition = 'transform .9s cubic-bezier(.2,.8,.3,1), opacity .9s ease';
      container.appendChild(c);
      requestAnimationFrame(() => {
        c.style.transform = `translate(${rand(-60,60)}px, ${rand(-90,-30)}px) rotate(${rand(-180,180)}deg)`;
        c.style.opacity = '0';
      });
      setTimeout(() => c.remove(), 950);
    }
    for (let i = 0; i < 5; i++) {
      const h = document.createElement('span');
      h.textContent = pick(['💗','💕','✨']);
      h.style.left = rand(30, 70) + '%';
      h.style.top = '35%';
      h.style.fontSize = rand(0.8, 1.2) + 'rem';
      h.style.opacity = '0';
      h.style.transition = 'transform 1.1s ease-out, opacity 1.1s ease-out';
      container.appendChild(h);
      requestAnimationFrame(() => {
        h.style.opacity = '1';
        h.style.transform = `translateY(${-rand(50,90)}px) translateX(${rand(-20,20)}px)`;
      });
      setTimeout(() => { h.style.opacity = '0'; }, 700);
      setTimeout(() => h.remove(), 1150);
    }
  }

  function openGiftModal(i){
    const [icon, title, message, filename] = gifts[i];
    const img = $('#giftModalImg');
    img.src = GIFTS_FOLDER + filename;
    img.alt = title;
    // graceful fallback if the file hasn't been added yet — shows a soft heart instead of a broken icon
    img.onerror = () => {
      img.onerror = null;
      img.removeAttribute('src');
      $('#giftModalMedia').innerHTML = `<span style="font-size:4rem;">${icon}</span>`;
    };
    $('#giftModalTitle').textContent = title;
    $('#giftModalMsg').textContent = message;
    giftModal.classList.add('open');
    burstConfetti(50);
    burstSparkles();
  }
  $('#giftModalClose').addEventListener('click', () => giftModal.classList.remove('open'));
  giftModal.addEventListener('click', (e) => { if (e.target === giftModal) giftModal.classList.remove('open'); });

  // 8. full-screen celebration once every gift has been opened
  function showGiftsCelebration(){
    giftModal.classList.remove('open');
    giftsCelebration.classList.add('show');
    const sky = $('#giftsCelebrationSky');
    burstConfetti(100, sky);
    burstFireworks(sky, 5);
    for (let i = 0; i < 10; i++) {
      const b = document.createElement('span');
      b.className = 'fx-balloon';
      b.textContent = pick(['🎈','🎈','🎈']);
      b.style.left = rand(0, 100) + '%';
      b.style.animationDuration = rand(10, 18) + 's';
      b.style.animationDelay = rand(0, 4) + 's';
      sky.appendChild(b);
    }
  }
  $('#giftsCelebrationClose').addEventListener('click', () => giftsCelebration.classList.remove('show'));

  /* ================================================================
     15. SECTION 7 — MESSAGE WALL
     EDIT: edit the notes array below.
  ================================================================ */
  const notes = [
    'You deserve every bit of happiness today. 🎂',
    'Here’s to a year as amazing as you are!',
    'So grateful the universe made us friends.',
    'May your birthday be as sweet as you are.',
    'Cheers to more inside jokes and late nights!',
    'You make everything better just by being there.',
    'Wishing you all the joy your heart can hold.',
    'Another year older, still just as wonderful.',
    'Thank you for being my favorite person.',
    'Happy Birthday to my ride-or-die!'
  ];
  const notesWall = $('#notesWall');
  notes.forEach(n => {
    const note = document.createElement('div');
    note.className = 'note';
    note.textContent = n;
    notesWall.appendChild(note);
  });

  /* ================================================================
     16. SECTION 8 — HEART-SHAPED COLLAGE
     Positions approximate a heart silhouette using percentage coords.
  ================================================================ */
  const heartPositions = [
    [50,10],[38,4],[62,4],[26,10],[74,10],[16,20],[84,20],[10,32],
    [90,32],[16,46],[84,46],[26,58],[74,58],[38,68],[62,68],[50,80]
  ];
  const collage = $('#heartCollage');
  heartPositions.forEach((pos, i) => {
    const img = document.createElement('img');
    img.src = `assets/images/photo${(i % 16) + 13}.jpeg`;
    img.alt = 'Us';
    img.loading = 'lazy';
    img.style.left = pos[0] + '%';
    img.style.top = pos[1] + '%';
    img.style.transform = 'translate(-50%,-50%)';
    collage.appendChild(img);
  });

  /* ================================================================
     17. SECTION 9 — COUNTDOWN since friendship began
     EDIT: change the data-friendship-date attribute in the HTML.
  ================================================================ */
  (function friendshipCountdown(){
    const dateHolder = $('[data-friendship-date]');
    const startDate = new Date(dateHolder.dataset.friendshipDate).getTime();
    const dEl = $('#cdDays'), hEl = $('#cdHours'), mEl = $('#cdMinutes'), sEl = $('#cdSeconds');
    function update(){
      const diff = Date.now() - startDate;
      if (diff < 0) return;
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      dEl.textContent = days; hEl.textContent = hours; mEl.textContent = mins; sEl.textContent = secs;
    }
    update();
    setInterval(update, 1000);
  })();

  /* ================================================================
     18. SECTION 10 — MEMORY MAP
     EDIT: edit the mapMemories array (x/y are % positions on the map)
  ================================================================ */
  const mapMemories = [
    [22,45,'Where We Met','The School Who Made Us What We Are Now'],
    [48,38,'Our Dream Trip','Chalane Unnai Le Ee Map Saripodu'],
    [65,52,'The Concert','When Will We Go To Concert Together ?'],
    [80,30,'That Random Weekend','No plans, just us — May Be In Future']
  ];
  const mapPins = $('#mapPins');
  mapMemories.forEach(([x,y,title,text]) => {
    const pin = document.createElement('div');
    pin.className = 'map-pin';
    pin.style.left = x + '%';
    pin.style.top = y + '%';
    pin.addEventListener('click', () => {
      $('#mapPopupTitle').textContent = title;
      $('#mapPopupText').textContent = text;
      $('#mapPopup').classList.add('open');
    });
    mapPins.appendChild(pin);
  });
  $('#mapPopupClose').addEventListener('click', () => $('#mapPopup').classList.remove('open'));
  $('#mapPopup').addEventListener('click', (e) => { if (e.target.id === 'mapPopup') $('#mapPopup').classList.remove('open'); });

  /* ================================================================
     19. SECTION 11 — FUN QUIZ
     EDIT: edit the quizQuestions array.
  ================================================================ */
  const quizQuestions = [
    { q: 'Where did we first meet?', options: ['School','A Party','Online','Through Friends'], correct: 0 },
    { q: 'What’s our go-to comfort food?', options: ['Pizza','Ice Cream','Noodles','Tacos'], correct: 1 },
    { q: 'What’s our dream trip together?', options: ['The Road Trip','The Sleepover','The Concert','All of the Above'], correct: 3 },
    { q: 'Which pet will i prefer?', options: ['Parrot','Cat','Dog','Rabbit'], correct: 2 },
    { q: 'What’s the one thing that never changes about us?', options: ['On vc even without talking','Always together','We love each other','All Of The Above'], correct: 3 }
  ];
  let quizIndex = 0, quizScore = 0;
  const quizQuestionWrap = $('#quizQuestionWrap');
  const quizProgressBar = $('#quizProgressBar');
  const quizBox = $('#quizBox');
  const quizResult = $('#quizResult');

  function renderQuizQuestion(){
    const item = quizQuestions[quizIndex];
    quizProgressBar.style.width = (quizIndex / quizQuestions.length * 100) + '%';
    quizQuestionWrap.innerHTML = `
      <p class="quiz-question">${item.q}</p>
      <div class="quiz-options">
        ${item.options.map((o, i) => `<button class="quiz-option" data-i="${i}">${o}</button>`).join('')}
      </div>`;
    $$('.quiz-option', quizQuestionWrap).forEach(btn => {
      btn.addEventListener('click', () => handleQuizAnswer(btn, item));
    });
  }

  function handleQuizAnswer(btn, item){
    const chosen = parseInt(btn.dataset.i, 10);
    $$('.quiz-option', quizQuestionWrap).forEach(b => b.style.pointerEvents = 'none');
    if (chosen === item.correct) { btn.classList.add('correct'); quizScore++; }
    else {
      btn.classList.add('wrong');
      $$('.quiz-option', quizQuestionWrap)[item.correct].classList.add('correct');
    }
    setTimeout(() => {
      quizIndex++;
      if (quizIndex < quizQuestions.length) renderQuizQuestion();
      else finishQuiz();
    }, 900);
  }

  function finishQuiz(){
    quizBox.style.display = 'none';
    quizResult.classList.add('show');
    $('#quizScoreText').textContent = `You scored ${quizScore} out of ${quizQuestions.length} — friendship goals!`;
    burstConfetti(70, $('#quizConfetti'));
  }

  $('#quizRestart').addEventListener('click', () => {
    quizIndex = 0; quizScore = 0;
    quizResult.classList.remove('show');
    quizBox.style.display = 'block';
    renderQuizQuestion();
  });
  renderQuizQuestion();

  /* ================================================================
     20. SECTION 12 — OPEN WHEN letters
     EDIT: edit the openWhenLetters array.
  ================================================================ */
  const openWhenLetters = [
    ['😢','Open When You’re Sad','It’s okay to not be okay. Call me, and I’ll remind you how loved you are — always.'],
    ['😄','Open When You’re Happy','Keep this feeling! You deserve every bit of this joy — let’s celebrate soon.'],
    ['🥹','Open When You Miss Me','I miss you too. We’re never really apart — just a message away.'],
    ['💪','Open When You Need Motivation','You’ve survived every hard day so far. This one is no different. You’ve got this.'],
    ['🙂','Open When You Want To Smile','Remember that time we couldn’t stop laughing over nothing? Yeah. That.']
  ];
  const openWhenGrid = $('#openWhenGrid');
  openWhenLetters.forEach(([icon, title, text]) => {
    const card = document.createElement('div');
    card.className = 'openwhen-card';
    card.innerHTML = `<span class="ow-icon">${icon}</span><h4>${title}</h4>`;
    card.addEventListener('click', () => {
      $('#openWhenTitle').textContent = title;
      $('#openWhenText').textContent = text;
      $('#openWhenModal').classList.add('open');
    });
    openWhenGrid.appendChild(card);
  });
  $('#openWhenModalClose').addEventListener('click', () => $('#openWhenModal').classList.remove('open'));
  $('#openWhenModal').addEventListener('click', (e) => { if (e.target.id === 'openWhenModal') $('#openWhenModal').classList.remove('open'); });

  /* ================================================================
     21. SECTION 13 — WISH JAR
     EDIT: edit the wishes array.
  ================================================================ */
  const wishes = [
    'May this year bring you closer to every dream you’re chasing.',
    'Wishing you sunny days and softer nights.',
    'May you always find a reason to laugh, even on hard days.',
    'Here’s to adventures we haven’t even planned yet.',
    'May you keep growing into the person you’re proud of.',
    'Wishing you people who love you as much as I do.',
    'May your birthday candles carry your quietest wish true.',
    'Here’s to a year that finally slows down for you.'
  ];
  const jarWishes = $('#jarWishes');
  wishes.forEach((w, i) => {
    const wish = document.createElement('div');
    wish.className = 'wish';
    wish.style.left = rand(8, 82) + '%';
    wish.style.top = rand(10, 80) + '%';
    wish.style.animationDelay = rand(0, 3) + 's';
    wish.addEventListener('click', (e) => {
      e.stopPropagation();
      $('#wishPopupText').textContent = w;
      $('#wishPopup').classList.add('open');
    });
    jarWishes.appendChild(wish);
  });
  $('#wishPopupClose').addEventListener('click', () => $('#wishPopup').classList.remove('open'));
  $('#wishPopup').addEventListener('click', (e) => { if (e.target.id === 'wishPopup') $('#wishPopup').classList.remove('open'); });

  /* ================================================================
     22. SECTION 14 — ANIMATED STAT COUNTERS
  ================================================================ */
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 80));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current.toLocaleString();
      }, 20);
      statObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  $$('.stat-num').forEach(el => statObserver.observe(el));

  /* ================================================================
     23. SECTION 16 — SECRET SURPRISE
     EDIT: change the password below.
  ================================================================ */
  const SECRET_PASSWORD = 'birthday';
  $('#secretBtn').addEventListener('click', unlockSecret);
  $('#secretInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') unlockSecret(); });
  function unlockSecret(){
    const val = $('#secretInput').value.trim().toLowerCase();
    if (val === SECRET_PASSWORD) {
      $('#secretLock').style.display = 'none';
      $('#secretReveal').classList.add('show');
      burstConfetti(90);
      burstFireworks($('#secretFireworks'));
    } else {
      $('#secretError').classList.add('show');
      setTimeout(() => $('#secretError').classList.remove('show'), 1800);
    }
  }

  /* ================================================================
     24. SECTION 17 — VIDEO PLAYER
     EDIT: replace assets/videos/video.mp4
  ================================================================ */
  (function videoPlayer(){
    const video = $('#mainVideo');
    const overlay = $('#videoOverlay');
    const playBtn = $('#videoPlayBtn');
    const toggleBtn = $('#videoToggle');
    const seek = $('#videoSeek');
    const timeEl = $('#videoTime');
    const muteBtn = $('#videoMute');

    function play(){ video.play().catch(()=>{}); overlay.classList.add('hide'); toggleBtn.textContent = '⏸'; }
    function pause(){ video.pause(); toggleBtn.textContent = '▶'; }

    playBtn.addEventListener('click', play);
    toggleBtn.addEventListener('click', () => video.paused ? play() : pause());
    video.addEventListener('click', () => video.paused ? play() : pause());
    video.addEventListener('ended', () => { overlay.classList.remove('hide'); toggleBtn.textContent = '▶'; });

    video.addEventListener('timeupdate', () => {
      if (!video.duration) return;
      seek.value = (video.currentTime / video.duration) * 100;
      const m = Math.floor(video.currentTime / 60);
      const s = Math.floor(video.currentTime % 60).toString().padStart(2, '0');
      timeEl.textContent = `${m}:${s}`;
    });
    seek.addEventListener('input', () => {
      if (video.duration) video.currentTime = (seek.value / 100) * video.duration;
    });
    muteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      muteBtn.textContent = video.muted ? '🔇' : '🔊';
    });
  })();

  /* ================================================================
     25. SECTION 18 — FINAL SURPRISE (fireworks / confetti / balloons)
  ================================================================ */
  const finalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        launchFinalCelebration();
        finalObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });
  finalObserver.observe($('#finalSurprise'));

  function launchFinalCelebration(){
    const sky = $('#finalSky');
    // stars
    for (let i = 0; i < 40; i++) {
      const s = document.createElement('div');
      s.style.position = 'absolute';
      s.style.width = s.style.height = rand(1,2.5) + 'px';
      s.style.borderRadius = '50%';
      s.style.background = '#fff';
      s.style.left = rand(0,100) + '%';
      s.style.top = rand(0,60) + '%';
      s.style.opacity = rand(.3,1);
      sky.appendChild(s);
    }
    burstConfetti(120, sky);
    burstFireworks(sky, 6);
    // balloons
    for (let i = 0; i < 10; i++) {
      const b = document.createElement('span');
      b.className = 'fx-balloon';
      b.textContent = pick(['🎈','🎈','🎈']);
      b.style.left = rand(0,100) + '%';
      b.style.animationDuration = rand(10,18) + 's';
      b.style.animationDelay = rand(0,4) + 's';
      sky.appendChild(b);
    }
    // butterflies
    for (let i = 0; i < 8; i++) {
      const bu = document.createElement('span');
      bu.className = 'fx-butterfly';
      bu.textContent = '🦋';
      bu.style.left = rand(0,100) + '%';
      bu.style.top = rand(40,90) + '%';
      bu.style.animationDuration = rand(6,10) + 's';
      bu.style.animationDelay = rand(0,5) + 's';
      sky.appendChild(bu);
    }
    // repeat confetti + fireworks periodically for a lively finale
    setInterval(() => { burstConfetti(40, sky); }, 3500);
    setInterval(() => { burstFireworks(sky, 2); }, 2600);
  }

  /* ================================================================
     26. SHARED FX HELPERS — confetti / fireworks / sparkles
  ================================================================ */
  function burstConfetti(count = 50, container = document.body){
    const colors = ['#ff9ec7','#c9b6e4','#8b6fce','#a8d8f0','#ffd3ae','#fff3c4'];
    for (let i = 0; i < count; i++) {
      const c = document.createElement('div');
      c.className = 'fx-confetti';
      const size = rand(6, 12);
      c.style.width = size + 'px';
      c.style.height = size * rand(0.4, 1) + 'px';
      c.style.left = rand(0, 100) + '%';
      c.style.background = pick(colors);
      c.style.animationDuration = rand(2.5, 4.5) + 's';
      c.style.zIndex = 9600;
      container.appendChild(c);
      setTimeout(() => c.remove(), 5000);
    }
  }

  function burstFireworks(container = document.body, bursts = 3){
    const colors = ['#ff9ec7','#c9b6e4','#a8d8f0','#ffd3ae','#fff3c4','#8b6fce'];
    for (let b = 0; b < bursts; b++) {
      setTimeout(() => {
        const cx = rand(15, 85), cy = rand(10, 50);
        const color = pick(colors);
        const particles = 24;
        for (let i = 0; i < particles; i++) {
          const angle = (i / particles) * Math.PI * 2;
          const dist = rand(60, 120);
          const p = document.createElement('div');
          p.className = 'fx-firework';
          p.style.left = cx + '%';
          p.style.top = cy + '%';
          p.style.width = p.style.height = '5px';
          p.style.background = color;
          p.style.boxShadow = `0 0 8px ${color}`;
          p.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
          p.style.zIndex = 9600;
          container.appendChild(p);
          requestAnimationFrame(() => {
            p.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
            p.style.opacity = '0';
          });
          setTimeout(() => p.remove(), 1100);
        }
      }, b * 500);
    }
  }

  function burstSparkles(container = document.body){
    for (let i = 0; i < 14; i++) {
      const s = document.createElement('div');
      s.textContent = '✨';
      s.style.position = 'fixed';
      s.style.left = rand(30,70) + 'vw';
      s.style.top = rand(30,60) + 'vh';
      s.style.fontSize = rand(0.8,1.4) + 'rem';
      s.style.zIndex = 9600;
      s.style.pointerEvents = 'none';
      s.style.transition = 'transform 1.2s ease-out, opacity 1.2s ease-out';
      document.body.appendChild(s);
      requestAnimationFrame(() => {
        s.style.transform = `translateY(${-rand(40,90)}px) scale(1.4)`;
        s.style.opacity = '0';
      });
      setTimeout(() => s.remove(), 1300);
    }
  }

  /* ================================================================
     27. MOUSE TRAIL SPARKLE (desktop only, lightweight)
  ================================================================ */
  (function mouseTrail(){
    if (window.matchMedia('(hover: none)').matches) return;
    let last = 0;
    window.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - last < 60) return;
      last = now;
      const dot = document.createElement('div');
      dot.style.position = 'fixed';
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
      dot.style.width = dot.style.height = '5px';
      dot.style.borderRadius = '50%';
      dot.style.background = 'var(--pink-deep)';
      dot.style.opacity = '0.6';
      dot.style.pointerEvents = 'none';
      dot.style.zIndex = 9997;
      dot.style.transition = 'transform .6s ease, opacity .6s ease';
      document.body.appendChild(dot);
      requestAnimationFrame(() => {
        dot.style.transform = 'scale(0.2) translateY(10px)';
        dot.style.opacity = '0';
      });
      setTimeout(() => dot.remove(), 650);
    });
  })();

});
