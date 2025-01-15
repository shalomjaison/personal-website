// Working part
// Initial setup
gsap.set("#name-screen .container li", {
    opacity: 0
  });
  
  gsap.registerPlugin(ScrollTrigger);
  
  // Initial animation timeline
  const initialTl = gsap.timeline({
    defaults: { duration: 1, ease: "power2.out" }
  });
  
  initialTl
    .from("#name-screen .container h1", {
      opacity: 0,
      y: 100,
      delay: 1.5
    })
    .to("#name-screen .container li", {
      opacity: 1,
      stagger: 0.3
    });
  
  // Create scroll-triggered animation
  ScrollTrigger.create({
    trigger: "body",
    start: "top top",
    end: "50% top", // Reduced scroll distance needed
    scrub: 1,       // Smoother scrubbing
    pin: true,
    onUpdate: (self) => {
      const progress = self.progress;
      gsap.to("#name-screen .container", {
        scale: 1 + (progress * 4), // Scale from 1 to 5
        opacity: 1 - progress,     // Fade from 1 to 0
        duration: 0.1
      });
    },
    onLeave: () => {
      document.getElementById("name-screen").style.display = "none";
      document.getElementById("main-content").style.display = "block";

      window.scrollTo(0,0);
      ScrollTrigger.getAll().forEach(st => st.kill()); // Clean up scroll triggers
    }
  });

