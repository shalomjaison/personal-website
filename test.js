
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
    duration: 0.3, // Reduced from 0.5 to 0.3
    ease: "elastic.out(1, 0.95)" 
  }, i * 0.2); // Increased spacing for longer stay
  
  if(text.id !== 'shalom'){
    // Quick fade out with scale down
    tl.to(text, { 
      scale: 0.9, 
      opacity: 0, 
      duration: 0.1 // Much faster fade out
    }, i * 0.2 + 0.2); // Increased stay time (0.4s instead of 0.3s)
  }
});

tl.to('#loading-screen', {opacity: 1, duration: 0.5, onComplete: () => {
  document.getElementById('loading-screen').style.opacity = 0;
}}, loading_texts.length * 0.2 + 0.3); // Reduced from 1s to 0.5s

tl.to('#loading-screen', {delay: 1, onComplete: () => { // Reduced from 1s to 0.5s
  document.getElementById('loading-screen').style.display = "none";
}});

tl.to('#intro', { opacity: 1, duration: 0.3 }, loading_texts.length * 0.3);

// 3. Pause slightly
tl.to({}, { duration: 0.5 });

// 4. Slide "Shalom" left & fade in "Jaison"
// tl.to(shalom, { x: "-10vw", duration: 2, ease: "power2.out" });
// tl.to("#intro", { opacity: 1, duration: 0.01 }, "<"); // show intro container
tl.from("#first-name", { x: "9.1vw", duration: 2, ease: "power2.out" });
tl.from("#last-name", { opacity: 0, x: "10vw", duration: 2}, "<+0.1");

// 5. Fade in titles one by one
tl.from("#roles h2", {
  opacity: 0,
  y: 20,
  duration: 2,
  stagger: 0.5,
  ease: "power2.out"
});

const lenis = new Lenis();

// Use requestAnimationFrame to continuously update the scroll
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Add parallax effect to intro section
gsap.registerPlugin(ScrollTrigger);

// Create a smooth parallax effect for the intro section
gsap.to("#intro", {
  y: "10vh", // Move down by 20% of viewport height
  ease: "none",
  scrollTrigger: {
    trigger: "#intro",
    start: "top top", // Start when top of intro hits top of viewport
    end: "bottom top", // End when bottom of intro hits top of viewport
    scrub: 1, // Smooth scrubbing effect
  }
});

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


// New approach: Generate actual stars and create true parallax
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

// Create stars when page loads
createStars();

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

gsap.fromTo('#hero-shape', {
  width: "35vw",
  height: "15vw",
  left: "33%",
  top: "3%",
  }, 
  {
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


