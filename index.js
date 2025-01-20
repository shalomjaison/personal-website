function nameScreenAnimation() {
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
      stagger: 0.7
    });
    

  // Create scroll-triggered animation
  ScrollTrigger.create({
    trigger: "body",
    start: "top top",
    end: "20% top", // Reduced scroll distance needed
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
      initialSetup();

      document.getElementById("name-screen").style.display = "none";
      document.getElementById("name-screen").remove();
      document.getElementById("main-content").style.display = "block";

      window.scrollTo(0,0);
      ScrollTrigger.getAll().forEach(st => st.kill()); // Clean up scroll triggers
      setTimeout(() => {
        scrollProgress();
        mainContentAnimations();
        navAnimations();
        cursorAnimation();
      }, 100);
    }
  });

}

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
  })
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
  })
  .to("#nav-part2 #links a", {
    opacity: 1,
    y: 0,
    duration: 0.7
  })
  .to(".progress-container", {
    opacity: 1,
    display: "block"
  })
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



nameScreenAnimation();

