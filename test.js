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
  gsap.registerPlugin(ScrollTrigger);

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
        footer.style.visibility = "visible"; // Keep visible for GSAP to animate
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
            console.log("ENTER page4 - hiding roles, showing footer");
            if (roles) roles.style.visibility = "hidden";
            if (footer) gsap.to(footer, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
        },
        onLeave: () => {
            console.log("LEAVE page4 - showing roles, hiding footer");
            if (roles) roles.style.visibility = "visible";
            if (footer) gsap.to(footer, { opacity: 0, y: 50, duration: 0.8, ease: "power2.out" });
        },
        onEnterBack: () => {
            console.log("ENTER BACK page4 - hiding roles, showing footer");
            if (roles) roles.style.visibility = "hidden";
            if (footer) gsap.to(footer, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
        },
        onLeaveBack: () => {
            console.log("LEAVE BACK page4 - showing roles, hiding footer");
            if (roles) roles.style.visibility = "visible";
            if (footer) gsap.to(footer, { opacity: 0, y: 50, duration: 0.8, ease: "power2.out" });
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
    start: "top -7.5%",
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




// ===== MAIN INITIALIZATION =====
function init() {
    initLoadingScreen();
    initSmoothScrolling();
    initParallaxEffects();
    createStars();
    initStarParallax();
    initScrollTriggers();
    scrambleProjects();
    initFloatingFooter();
}

// ===== START EVERYTHING =====
document.addEventListener('DOMContentLoaded', init);
