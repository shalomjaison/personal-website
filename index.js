function initialSetup() {
  gsap.set("#introduction .content #stat1", {
    opacity: 0,
    y: 100
  });

  gsap.set("#introduction .content #stat2", {
    opacity: 0,
    y: 150,
    x: 0, 
    // scale: 0
  });

  gsap.set("#introduction .content #stat3", {
    opacity: 0
  });

  gsap.set(".logo2", { // Hide the second logo initially
    opacity: 0,
    display: "none"
  });
  
  gsap.set(".logo1", { // Ensure first logo is visible
    opacity: 0,
    display: "block"
  });

  gsap.set("#nav-part2 #links a", {
    opacity: 0
  });

  gsap.set(".progress-container", {
    opacity: 0, display: "none"
  });
  
  gsap.set(".switch", {
    opacity: 0, y: 10
  });
}

function nameScreenAnimation() {
  document.body.style.overflow = 'hidden';
  gsap.set("#main-content", { 
      display: "none" 
  });
  
  gsap.set("#name-screen .container h1", { 
      opacity: 0, y: 50 
  });
  gsap.set("#name-screen .container li", { 
      opacity: 0, y: 30 
  });

  const initialTl = gsap.timeline({
      defaults: { duration: 1, ease: "power3.out" }
  });
  
  initialTl
  .to("#name-screen .container h1", {
      opacity: 1,
      y: 0,
      duration: 1.5,
      delay: 0.5
  })
  .to("#name-screen .container li", {
      opacity: 1,
      y: 0,
      duration: 3,
      stagger: 0.2,
      ease: "power2.out"
  })
  .to({}, { duration: 1 })
  .to("#name-screen .container", {
      scale: 1.2,
      opacity: 0,
      duration: 1.2,
      ease: "power2.inOut",
      onComplete: () => {
          initialSetup();
          document.getElementById("name-screen").remove();
          document.getElementById("main-content").style.display = "block";
          
          document.body.style.overflow = 'auto';
          mainContentAnimations();
      }
  });
}

function mainContentAnimations() {
  const mainContentTl = gsap.timeline({
      defaults: {
          duration: 1,
          ease: "power2.out"
      }
  });
  
  mainContentTl.to("#main-content #introduction .content #stat1", {
      opacity: 1,
      y: 0,
      duration: 1.2
  })
  .to("#main-content #introduction .content #stat2", {
      opacity: 1,
      y: 0,
      x: 0,
      duration: 1.2,
      scale: 1
  }, "=-0.4")
  .to("#main-content #introduction .content #stat3", {
      opacity: 1,
      y: 0,
      duration: 1.5,
      delay: 0.2
  })
  .to(".logo1", {
      opacity: 1,
      y: 0,
      duration: 0.7,
  }, "=-0.2")
  .to("#nav-part2 #links a", {
      opacity: 1,
      y: 0,
      duration: 0.7
  }, "=-0.7")
  .to(".switch", {
    opacity: 1,
    y:0,
    duration: 0.7
  }, "=-0.7")
  .to(".progress-container", {
      opacity: 1,
      display: "block"
  }, "=-0.7");
  navAnimations();
  scrollProgress();
  cursorAnimation();
  setupProjectsAnimation();
  setupResearchAnimation();
  contactAnimation();
}

function navAnimations() {
  
  // Create the scroll trigger animation
  ScrollTrigger.create({
      trigger: "#main-content",
      scroll: "body",
      start: "5% top", // Trigger when page is scrolled 10%
      onEnter: () => {
          // Animate logo switch
          gsap.to(".logo1", {
              opacity: 0,
              duration: 0.3,
              onComplete: () => {
                  gsap.set(".logo1", { display: "none" });
                  gsap.set(".logo2", { display: "block" });
                  gsap.to(".logo2", {
                      opacity: 1,
                      duration: 0.3
                  });
              }
          });
      },
      onLeaveBack: () => {
          // Animate back to first logo when scrolling up
          gsap.to(".logo2", {
              opacity: 0,
              duration: 0.3,
              onComplete: () => {
                  gsap.set(".logo2", { display: "none" });
                  gsap.set(".logo1", { display: "block" });
                  gsap.to(".logo1", {
                      opacity: 1,
                      duration: 0.3
                  });
              }
          });
      }
  });
}

function scrollProgress() {
  const progressBar = document.querySelector('.progress-bar');
  
  // Calculate scroll progress
  function updateProgress() {
      const winScroll = window.pageYOffset || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      
      if (progressBar) {
          progressBar.style.width = scrolled + "%";
      }
  }
  
  // Add scroll event listener
  window.addEventListener('scroll', updateProgress);
  
  // Initial call to set progress bar on page load
  updateProgress();
}

function cursorAnimation() {
  gsap.set("#cursor", {
      scale: 0,
      transform: 'translate(-50%, -50%)'
  });
  
  document.addEventListener("mousemove", function(dets) {
      gsap.to("#cursor", {
          left: dets.x,
          top: dets.y,
          duration: 0.3
      });
  })
  
  document.querySelector("#main-content #introduction .content").addEventListener("mouseenter", function () {
      document.querySelector("#cursor").classList.add("active");
      gsap.to("#cursor", {
          scale: 1,
          transform: 'translate(-50%, -50%) scale(1)',
          opacity: 0.4
      });
      
      document.querySelector("#main-content #introduction .content").addEventListener("mouseleave", function () {
          document.querySelector("#cursor").classList.remove("active");
          gsap.to("#cursor", {
              scale: 0,
              transform: 'translate(-50%, -50%)'
          });
      });
  });
  
}

function setupProjectsAnimation() {
  // Initial setup
  gsap.to("#tech-projects .container2 h1", {
      xPercent: -170, // Move fully off screen to the left
      ease: "none",   // Linear animation for smooth scrolling
      scrollTrigger: {
          trigger: "#tech-projects",
          start: "top 0%", // Start when section hits top
          end: "+=100%",    // End after scrolling 100% of section height
          pin: true,        // Pin the section
          scrub: 3,      // Smooth scrubbing
          anticipatePin: 2,  // Helps prevent jank when pinning
          invalidateOnRefresh: true, // Recalculate on resize
          // markers: true,    // Helpful for debugging - remove in production
          onUpdate: (self) => {
              // Optional: add any per-frame updates here
              console.log("Progress:", self.progress);
          },
          onEnter: () => {
              // Optional: add any animations when entering the section
              gsap.to(".card", { duration: 0.3, opacity: 1 });
          }
      }
  });
  
  // Optional: Add a subtle parallax effect to the cards
  const cards = gsap.utils.toArray('.card');
  cards.forEach((card, i) => {
      gsap.to(card, {
          xPercent: 4,
          ease: "none",
          scrollTrigger: {
              trigger: "#tech-projects",
              start: "top top",
              end: "+=100%",
              scrub: true
          }
      });
  });
}

function setupResearchAnimation() {
  // Initial setup
  gsap.to("#res-experience .container2 h1", {
      xPercent: -230, // Move fully off screen to the left
      ease: "none",   // Linear animation for smooth scrolling
      scrollTrigger: {
          trigger: "#res-experience",
          start: "top 0%", // Start when section hits top
          end: "+=100%",    // End after scrolling 100% of section height
          pin: true,        // Pin the section
          scrub: 3,      // Smooth scrubbing
          anticipatePin: 1,  // Helps prevent jank when pinning
          invalidateOnRefresh: true, // Recalculate on resize
          // markers: true,    // Helpful for debugging - remove in production
          onUpdate: (self) => {
              // Optional: add any per-frame updates here
              console.log("Progress:", self.progress);
          },
          onEnter: () => {
              // Optional: add any animations when entering the section
              gsap.to(".card", { duration: 0.3, opacity: 1 });
          }
      }
  });
  
  // Optional: Add a subtle parallax effect to the cards
  const cards = gsap.utils.toArray('.card');
  cards.forEach((card, i) => {
      gsap.to(card, {
          xPercent: 4,
          ease: "none",
          scrollTrigger: {
              trigger: "#res-experience",
              start: "top top",
              end: "+=100%",
              scrub: true
          }
      });
  });
}

function contactAnimation() {
  gsap.from("#contact .container3 h1", {
      opacity: 0,
      y: 50,
      duration: 2, // Smooth and extended duration
      ease: "power4.inOut",
      scrollTrigger: {
          trigger: "#contact",
          start: "top 60%", // Starts when the section is in view
          toggleActions: "play none none none"
      }
  });

  gsap.from("#contact p", {
      opacity: 0,
      y: 50,
      duration: 2, // Smooth and extended duration
      ease: "power4.inOut",
      scrollTrigger: {
          trigger: "#contact",
          start: "top 60%", // Starts when the section is in view
          toggleActions: "play none none none"
      }
  });

  gsap.from("#contact .container4", {
      opacity: 0,
      y: 50,
      duration: 2, // Smooth and extended duration
      ease: "power4.inOut",
      scrollTrigger: {
          trigger: "#contact",
          start: "top 60%", // Starts when the section is in view
          toggleActions: "play none none none"
      }
  });
}


document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);
  nameScreenAnimation();
});
