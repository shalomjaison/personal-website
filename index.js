// ===== LOADING SCREEN ANIMATIONS =====
function initLoadingScreen() {
    const loading_texts = document.querySelectorAll(".hello-text");
    const shalom = document.getElementById("shalom");
    const tl = gsap.timeline({defaults: {duration: 0.5, ease: 'power2.out'}});

    loading_texts.forEach((text, i) => {
        // Start with scale 0
        gsap.set(text, { scale: 0, opacity: 0 });
        
        // Elastic pop in
        tl.to(text, { 
            scale: 1, 
            opacity: 1, 
            duration: 0.3,
            ease: "elastic.out(1, 0.95)" 
        }, i * 0.2);
        
        if(text.id !== 'shalom'){
            // Quick fade out with scale down
            tl.to(text, { 
                scale: 0.9, 
                opacity: 0, 
                duration: 0.1
            }, i * 0.2 + 0.2);
        }
    });

    tl.to('#loading-screen', {opacity: 1, duration: 0.5, onComplete: () => {
        document.getElementById('loading-screen').style.opacity = 0;
    }}, loading_texts.length * 0.2 + 0.3);

    tl.to('#loading-screen', {delay: 1, onComplete: () => {
        document.getElementById('loading-screen').style.display = "none";
    }});

    tl.to('#intro', { opacity: 1, duration: 0.3 }, loading_texts.length * 0.3);

    // Pause slightly
    tl.to({}, { duration: 0.5 });

    // Slide "Shalom" left & fade in "Jaison"
    tl.from("#first-name", { x: "9.1vw", duration: 2, ease: "power2.out" });
    tl.from("#last-name", { opacity: 0, x: "10vw", duration: 2}, "<+0.1");

    // Fade in titles one by one
    tl.from("#roles h2", {
        opacity: 0,
        y: 20,
        duration: 2,
        stagger: 0.5,
        ease: "power2.out"
    });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
  const lenis = new Lenis();

  // GSAP drives Lenis for perfect sync
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // Keep ScrollTrigger updated
  lenis.on('scroll', ScrollTrigger.update);
}

// ===== PARALLAX EFFECTS =====
function initParallaxEffects() {
  gsap.registerPlugin(ScrollTrigger, Observer);

    // Intro section parallax
    gsap.to("#intro", {
        y: "10vh",
        ease: "none",
        scrollTrigger: {
            trigger: "#intro",
            start: "top top",
            end: "bottom top",
            scrub: 1,
        }
    });

    // Roles parallax
    gsap.to('#roles', {
        y: "-28vh",
        ease: "none",
        scrollTrigger: {
            trigger: "#main",
            start: "top top",
            end: "bottom top",
            scrub: 1,
        }
    });

    // Hero shape parallax
    gsap.fromTo('#hero-shape', {
        width: "35vw",
        height: "15vw",
        left: "33%",
        top: "3%",
    }, {
        width: "100vw",
        height: "100vw",
        left: "0%",
        top: "0%",
        scrollTrigger: {
            trigger: "#intro",
            start: "top top",
            end: "70% top",
            scrub: 1,
        }
    });
}

// ===== STAR FIELD GENERATION =====
function createStars() {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-container';
    document.body.appendChild(starsContainer);

    // Generate 200 stars
    for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        
        // Random size for depth effect
        const sizes = ['small', 'medium', 'large'];
        star.classList.add(sizes[Math.floor(Math.random() * sizes.length)]);
        
        // Random animation delay
        star.style.animationDelay = Math.random() * 3 + 's';
        
        starsContainer.appendChild(star);
    }
}

function initStarParallax() {
    // True parallax effect - move stars at different speeds based on size
    gsap.to('.star.small', {
        y: "-40vh", // Far stars move slower
        ease: "none",
        scrollTrigger: {
            trigger: "#main",
            start: "top top",
            end: "bottom top",
            scrub: 1,
        }
    });

    gsap.to('.star.medium', {
        y: "-60vh", // Medium stars move faster
        ease: "none",
        scrollTrigger: {
            trigger: "#main",
            start: "top top",
            end: "bottom top",
            scrub: 1,
        }
    });

    gsap.to('.star.large', {
        y: "-100vh", // Close stars move fastest
        ease: "none",
        scrollTrigger: {
            trigger: "#main",
            start: "top top",
            end: "bottom top",
            scrub: 1,
        }
    });
}

// ===== SCROLL TRIGGERS =====
function initScrollTriggers() {
    // Set initial state - footer should be hidden initially
    const footer = document.getElementById("footer");
    const roles = document.getElementById("roles");
    
    if (footer) {
        footer.style.visibility = "hidden"; // Keep visible for GSAP to animate
        gsap.set(footer, { opacity: 0, y: 50 }); // Start hidden and slightly below
    }
    if (roles) {
        roles.style.visibility = "visible"; // Keep visible for GSAP to animate
    }
    
    // Hide roles when on page4
    ScrollTrigger.create({
        trigger: "#page4",
        start: "top center",
        onEnter: () => {
            if (roles) roles.style.visibility = "hidden";
        },
        onLeave: () => {
            if (roles) roles.style.visibility = "visible";
        },
        onEnterBack: () => {
            if (roles) roles.style.visibility = "hidden";
        },
        onLeaveBack: () => {
            if (roles) roles.style.visibility = "visible";
        }
    });

    // Separate trigger to hide footer earlier when scrolling up
    ScrollTrigger.create({
        trigger: "#page4",
        start: "top 30%",
        onEnter: () => {
            // Footer should already be visible here, do nothing
            if (footer) {
                footer.style.visibility = "visible";
                gsap.to(footer, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
                footer.style.pointerEvents = "auto";
            }
        },
        onLeave: () => {
            // Footer disappears when top of page4 hits 10% of viewport
            if (footer) {
                gsap.to(footer, { opacity: 0, y: 50, duration: 0.8, ease: "power2.out" });
                // footer.style.visibility = "hidden";
                footer.style.pointerEvents = "none";
            }
        },
        onEnterBack: () => {
            // Footer appears when scrolling back down to page4
            if (footer) {
                footer.style.visibility = "visible";
                gsap.to(footer, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
                footer.style.pointerEvents = "auto";
            }
        },
        onLeaveBack: () => {
            // Footer disappears when scrolling up past 10% point
            if (footer) {
                gsap.to(footer, { opacity: 0, y: 50, duration: 0.8, ease: "power2.out" });
                // footer.style.visibility = "hidden";
                footer.style.pointerEvents = "none";
            }
        }
    });
    
}
// global flag so we can stop scrambling once #page3 is fully in view
let stopScramble = false;

function scrambleProjects() {
  const projects = document.querySelectorAll(".project");
  const h2s = [];

  projects.forEach((project, i) => {
    const h2 = project.querySelector("h2");
    if (!h2) return;

    const finalText = h2.textContent;
    h2.dataset.finalText = finalText; // for later finalize
    h2s.push(h2);

    const poolBase = finalText.toLowerCase().replace(/[^a-z]/g, "");
    const pool = poolBase.length ? poolBase : "abcdefghijklmnopqrstuvwxyz";
    const isFixed = (ch) => /\s|[^A-Za-z]/.test(ch);

    let lastTick = 0;
    const isLast = i === projects.length - 1;

    ScrollTrigger.create({
      trigger: project,
      start: "top 90%",
      // last project finishes early (shorter range)
      end: isLast ? "top 5%" : "bottom 20%",
      scrub: 1,
      // markers: true,
      onUpdate(self) {
        if (stopScramble) { h2.textContent = finalText; return; }

        // accelerate reveal for the last card so it completes earlier
        const prog = isLast ? Math.min(1, self.progress * 1.8) : self.progress;

        const now = performance.now();
        if (now - lastTick < 40) return; // ~25fps throttle
        lastTick = now;

        const reveal = Math.floor(prog * finalText.length);

        let out = "";
        for (let j = 0; j < finalText.length; j++) {
          const ch = finalText[j];
          if (j < reveal || isFixed(ch)) out += ch;
          else out += pool[(Math.random() * pool.length) | 0];
        }
        h2.textContent = out;
      },
      onLeave() { h2.textContent = finalText; },
      onLeaveBack() { if (!stopScramble) h2.textContent = finalText; },
    });
  });

  // As soon as #page3 hits the viewport top, stop all scrambling & lock final text
  ScrollTrigger.create({
    trigger: "#page3",
    start: "top -5%",
    // start: "bottom 96%",
    onEnter: () => {
      stopScramble = true;
      h2s.forEach(h2 => (h2.textContent = h2.dataset.finalText));
    },
    onLeaveBack: () => { // allow scrambling again only when scrolling above #page3
      stopScramble = false;
    }
  });
}

// ===== FLOATING EFFECTS =====
function initFloatingFooter(){
    function floatIt(el, intensity = 1) {
        // position float
        gsap.to(el, {
            x: () => gsap.utils.random(-5, 5) * intensity,
            y: () => gsap.utils.random(-6, 6) * intensity,
            rotationX: () => gsap.utils.random(-0.3, 0.3) * intensity,
            rotationY: () => gsap.utils.random(-3, 3) * intensity,
            duration: () => gsap.utils.random(2, 4),
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
        });
    }

  // -------- Apply floats
  floatIt("#footer-upper h1", 1.2);
  floatIt("#footer-upper p", 0.8);
  let footerButtons = document.querySelector("#footer-bottom");
  floatIt(footerButtons, 3);
  floatIt("#hero-6", 6);
}

// ===== HOVER CARD =====
function initHoverCard(){
    function showCard(){
        hoverCard.classList.add('visible')
        const v = hoverCard.querySelector('video');
         if (v) v.play();
    }

    function hideCard(){
        hoverCard.classList.remove('visible');
        const v = hoverCard.querySelector('video');
        if (v) v.pause()
    }

    const projectSection = document.getElementById("page3-projects");
    const hoverCard = document.getElementById("hover-card");
    const mediaMount = hoverCard.querySelector('.hc-media');
    const panelLock = false;
    const hc = {
        title: hoverCard.querySelector('#hc-title'),
        tag: hoverCard.querySelector('#hc-tag'),
        year: hoverCard.querySelector('#hc-year'),
        tech: hoverCard.querySelector('#hc-tech'),
        b1: hoverCard.querySelector('#hc-b1'),
        b2: hoverCard.querySelector('#hc-b2'),
        cta: hoverCard.querySelector('#hc-cta'),
    }

    hoverCard.addEventListener('mouseenter', () => {
        panelLock = true;
    });

    hoverCard.addEventListener('mouseleave', () => {
        panelLock = false;
    });

    projectSection.addEventListener('mouseleave', () => {
        if(!hoverCard.matches(':hover')) hideCard();
    });

    hoverCard.addEventListener('mouseleave', () => {
        if(!projectSection.matches(':hover')) hideCard();
    });

    function showVideo(src) {
        mediaMount.innerHTML = '';
        const v = document.createElement('video');
        v.src = src;
        v.muted = true;
        v.autoplay = true;
        v.loop = true;
        v.playbackRate = 1.2;
        v.playsInline = true;
        v.style.width = '100%';
        v.style.height = '100%';
        v.style.objectFit = 'cover';
        v.style.objectPosition = 'center';
        v.style.borderRadius = '10px';
        mediaMount.appendChild(v);
    }

    function showImage(src, alt=''){
        mediaMount.innerHTML = '';
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.objectPosition = 'center';
        img.style.borderRadius = '10px';
        mediaMount.appendChild(img);
    }
    function populateFrom(project){
        const title  = project.dataset.title || '';
        const tag = project.dataset.tag || '';
        const year = project.dataset.year || '';
        const tech = project.dataset.tech || '';
        const b1 = project.dataset.b1 || '';
        const b2 = project.dataset.b2 || '';

        const live = project.dataset.live;
        if (live) {
            hc.cta.href = live;
            hc.cta.textContent = 'View Live Site';
            hc.cta.target = '_blank';
            hc.cta.rel = 'noopener';
            hc.cta.style.display = 'block';
            hc.cta.setAttribute('tabindex','0');
        }

        const article = project.dataset.article;
        if (article) {
            hc.cta.href = article;
            hc.cta.textContent = 'View Article';
            hc.cta.target = '_blank';
            hc.cta.rel = 'noopener';
            hc.cta.style.display = 'block';
            hc.cta.setAttribute('tabindex','0');
        }
        if (!live && !article) {
            hc.cta.style.display = 'none';
            hc.cta.setAttribute('tabindex','-1');
        }

        const poster = project.dataset.poster || '';
        const video = project.dataset.video;

        if (video) {
            showVideo(video);
        } else if (poster) {
            showImage(poster, `${title} preview`);
        } else {
            mediaMount.innerHTML = '';
        }

        hc.title.textContent = title;
        hc.tag.textContent = tag;
        hc.year.textContent = year;
        hc.tech.textContent = tech;
        hc.b1.textContent = b1;
        hc.b2.textContent = b2;

    }
    // let hoverTimer = null;
    // function withIntent(fn){
    //     clearTimeout(hoverTimer);
    //     hoverTimer = setTimeout(fn, 110); 
    // }

    const projects = document.querySelectorAll(".list-item");
    projects.forEach((project) => {
        project.addEventListener('mouseenter', () => {
            if (panelLock) return;
            populateFrom(project);
            showCard();
            // withIntent(() => {
            //   if (panelLock) return; 
            // });
          });
        const openPrimary = () => {
            const repo   = project.dataset.repo;
            if (repo) window.open(repo, '_blank', 'noopener');
        };
        project.addEventListener('click', openPrimary);
        project.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPrimary(); }
        });
    })
}

function init() {
    initLoadingScreen();
    initSmoothScrolling();
    initParallaxEffects();
    createStars();
    initStarParallax();
    initScrollTriggers();
    scrambleProjects();
    initFloatingFooter();
    initHoverCard();
}

// ===== START EVERYTHING =====
document.addEventListener('DOMContentLoaded', init);
