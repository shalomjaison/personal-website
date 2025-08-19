// Add this function to check screen size
function isMobile() {
    return window.innerWidth <= 768; // Match your CSS media query
}

// ===== LOADING SCREEN ANIMATIONS =====
function initLoadingScreen() {
    const loading_texts = document.querySelectorAll(".hello-text");
    const shalom = document.getElementById("shalom");
    const tl = gsap.timeline({defaults: {duration: 0.5, ease: 'power2.out'}});

    loading_texts.forEach((text, i) => {
        // Start with scale 0
        gsap.set(text, { scale: 0.98, opacity: 0 });
        
        // Elastic pop in
        tl.to(text, { 
            scale: 1, 
            opacity: 1, 
            duration: 0.2,
            ease: "power3.out" // ← Much better performance, still snappy
        }, i * 0.17);
        
        // if(text.id !== 'shalom'){
            // Quick fade out with scale down
            tl.to(text, { 
                scale: 1, 
                opacity: 0, 
                duration: 0.1
            }, i * 0.17 + 0.18); // ← Change to match the IN timing
        // }
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
    tl.from("#first-name", { x: isMobile() ? "19vw" : "9.1vw", duration: 2, ease: "power2.out" });
    tl.from("#last-name", { opacity: 0, x: isMobile() ? "12vw" : "10vw", duration: 2}, "<+0.1");

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
    // no scrollerProxy, no rAF loop – just ONE driver
    const lenis = new Lenis({ lerp: 0.15, smoothWheel: true });
  
    gsap.ticker.add((t) => lenis.raf(t * 1000));   // single driver
    // do NOT call gsap.ticker.lagSmoothing(0)
    // (leave default smoothing or omit entirely)
  
    // keep ScrollTrigger in sync with Lenis
    lenis.on('scroll', ScrollTrigger.update);
  
    // expose for quick sanity checks
    window.lenis = lenis;
}
  

// ===== PARALLAX EFFECTS =====
function initParallaxEffects() {
  gsap.registerPlugin(ScrollTrigger, Observer);

    // Intro section parallax
    gsap.to("#intro", {
        y: isMobile() ? "2vh" : "10vh",
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
        y: isMobile() ? "-15vh" : "-28vh",
        ease: "none",
        scrollTrigger: {
            trigger: "#main",
            start: "top top",
            end: "bottom top",
            scrub: 1,
        }
    });

    // Hero shape parallax
    if (!isMobile()) {
        gsap.fromTo('#hero-shape', {
            width: "35vw",
            height: "15vw",
            left: "33%",
            top: "3%",
            borderRadius: "50%",
        }, {
            width: "100vw",
            height: "100vw",
            left: "0%",
            top: "0%",
            borderRadius: "0%",
            scrollTrigger: {
                trigger: "#intro",
                start: "top top",
                end: "70% top",
                scrub: 1,
            }
        });
    } else {
        gsap.fromTo('#hero-shape', {
            width: "85vw",
            height: "65vw",
            left: "10%",
            top: "15%",
            opacity: 0.6,
            borderRadius: "50%",
        }, {
            width: "100vw",
            height: "120vh",
            left: "0%",
            top: "0%",
            opacity: 0.7,
            borderRadius: "0%",
            scrollTrigger: {
                // Use the scrolling content as the trigger (intro is fixed)
                trigger: "#main",
                start: "top top",
                // Complete the expansion within ~80% of one viewport height
                end: () => "+=" + Math.round(window.innerHeight * 0.25),
                scrub: 1,
            },
            overwrite: "auto"
        });
    }
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
    gsap.to('.stars-container', {
        '--star-offset': '-100vh', // This moves all stars
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
        trigger: isMobile() ? "#page3" : "#page4", // Use page3 on mobile since page4 is shorter
        start: isMobile() ? "bottom 65%" : "top 30%", // Trigger earlier on mobile
        onEnter: () => {
            // Footer should already be visible here, do nothing
            if (footer) {
                footer.style.visibility = "visible";
                gsap.to(footer, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
                footer.style.pointerEvents = "auto";
            }
        },
        onLeave: () => {
            // Footer disappears when scrolling up
            if (footer) {
                gsap.to(footer, { opacity: 0, y: 50, duration: 0.8, ease: "power2.out" });
                // footer.style.visibility = "hidden";
                footer.style.pointerEvents = "none";
            }
        },
        onEnterBack: () => {
            // Footer appears when scrolling back down
            if (footer) {
                footer.style.visibility = "visible";
                gsap.to(footer, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
                footer.style.pointerEvents = "auto";
            }
        },
        onLeaveBack: () => {
            // Footer disappears when scrolling up past trigger point
            if (footer) {
                gsap.to(footer, { opacity: 0, y: 50, duration: 0.8, ease: "power2.out" });
                // footer.style.visibility = "hidden";
                footer.style.pointerEvents = "none";
            }
        }
    });
    
}

function revealProjectsWithScramble() {
    if (isMobile()) return;
    const projects = document.querySelectorAll(".project");
  
    projects.forEach((project, i) => {
      const h2 = project.querySelector("h2");
      if (!h2) return;
  
      const finalText = h2.textContent;
      
      // Start with random characters
      h2.textContent = ' '.repeat(finalText.length);
      
      ScrollTrigger.create({
        trigger: project,
        start: "top 80%",
        onEnter: () => {
          // One-time custom scramble reveal - completely free!
          const scrambleDuration = 1.5;
          const scrambleInterval = 50; // 50ms between each character reveal
          const totalSteps = Math.ceil(scrambleDuration * 1000 / scrambleInterval);
          let currentStep = 0;
          
          const scrambleTimer = setInterval(() => {
            currentStep++;
            const progress = currentStep / totalSteps;
            const revealCount = Math.floor(progress * finalText.length);
            
            // Build the revealed text with some random characters
            let revealedText = '';
            for (let j = 0; j < finalText.length; j++) {
              if (j < revealCount) {
                revealedText += finalText[j];
              } else {
                // Add random scramble characters
                const scrambleChars = finalText;
                revealedText += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
              }
            }
            
            h2.textContent = revealedText;
            
            // Stop when complete
            if (currentStep >= totalSteps) {
              clearInterval(scrambleTimer);
              h2.textContent = finalText; // Ensure final text is perfect
            }
          }, scrambleInterval);
        },
        once: true // Only trigger once
      });
    });
}
// ===== FLOATING EFFECTS =====
function initFloatingFooter(){
    function floatIt(el, intensity = 1) {
        const randomX = gsap.utils.random(-5, 5) * intensity;
        const randomY = gsap.utils.random(-6, 6) * intensity;
        const randomRotX = gsap.utils.random(-0.3, 0.3) * intensity;
        const randomRotY = gsap.utils.random(-3, 3) * intensity;
        const duration = gsap.utils.random(2, 4);
        
        // Use pre-calculated values instead of function calls
        gsap.to(el, {
            x: isMobile() ? 0 : randomX,
            y: randomY,
            rotationX: isMobile() ? 0 : randomRotX,
            rotationY: randomRotY,
            duration: duration,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
        });
    }

    // Get all the elements first and check if they exist
    const footerUpperH1 = document.querySelector("#footer-upper h1");
    const footerUpperP = document.querySelector("#footer-upper p");
    const footerBottom = document.querySelector("#footer-bottom");
    const hero6 = document.querySelector("#hero-6");
    
    // Only apply floating effects if elements exist
    if (footerUpperH1) {
        console.log("Found footer-upper h1, applying float");
        floatIt(footerUpperH1, 1.2);
    } else {
        console.log("footer-upper h1 not found");
    }
    
    if (footerUpperP) {
        console.log("Found footer-upper p, applying float");
        floatIt(footerUpperP, 0.8);
    } else {
        console.log("footer-upper p not found");
    }
    
    if (footerBottom) {
        console.log("Found footer-bottom, applying float");
        floatIt(footerBottom, 3);
    } else {
        console.log("footer-bottom not found");
    }
    
    if (hero6) {
        console.log("Found hero-6, applying float");
        floatIt(hero6, 6);
    } else {
        console.log("hero-6 not found");
    }
}

// ===== HOVER CARD =====
function initHoverCard(){
    const projectSection = document.getElementById("page3-projects");
    const hoverCard = document.getElementById("hover-card");
    const mediaMount = hoverCard.querySelector('.hc-media');
    let panelLock = false;
    const hc = {
        title: hoverCard.querySelector('#hc-title'),
        tag: hoverCard.querySelector('#hc-tag'),
        year: hoverCard.querySelector('#hc-year'),
        tech: hoverCard.querySelector('#hc-tech'),
        b1: hoverCard.querySelector('#hc-b1'),
        b2: hoverCard.querySelector('#hc-b2'),
        cta: hoverCard.querySelector('#hc-cta'),
    }
    
    const videoElem = hoverCard.querySelector('#hc-video');
    const imgElem = document.createElement('img');
    imgElem.style.width = '100%';
    imgElem.style.height = '100%';
    imgElem.style.objectFit = 'cover';
    imgElem.style.objectPosition = 'center';
    imgElem.style.borderRadius = '10px';
    
    function setChild(node){
        if (mediaMount.firstChild !== node) {
          mediaMount.textContent = '';
          mediaMount.appendChild(node);
        }
      }
      
    function mountVideo(src, poster){
        setChild(videoElem);
        if (poster) videoElem.poster = poster;
        
        // Only change src if it's different (prevents unnecessary reloads)
        if (videoElem.src !== src) { 
            videoElem.preload = 'metadata'; // Just load metadata, not full video
            videoElem.src = src; 
        }
        
        videoElem.loop = true; 
        videoElem.playbackRate = 1.2;
        
        // Desktop: autoplay on hover (original behavior)
        videoElem.play().catch(()=>{});
    }
    
    function clearVideo() {
        videoElem.pause();
        videoElem.removeAttribute('src');
        videoElem.load();
    }
    
    function showImage(src, alt=''){
        clearVideo();
        imgElem.src = src; imgElem.alt = alt;
        setChild(imgElem);
    }

    function showCard(){
        hoverCard.classList.add('visible')
        videoElem.play().catch(() => {});
    }

    function hideCard(){
        hoverCard.classList.remove('visible');
        clearVideo();
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

    function populateFrom(project){
        const title  = project.dataset.title || '';
        const tag = project.dataset.tag || '';
        const year = project.dataset.year || '';
        const tech = project.dataset.tech || '';
        const b1 = project.dataset.b1 || '';
        const b2 = project.dataset.b2 || '';

        const live = project.dataset.live;
        const article = project.dataset.article;
        
        if (live || article) {
            hc.cta.href = live || article;
            hc.cta.textContent = live ? 'View Live Site' : 'View Article';
            hc.cta.target = '_blank'; hc.cta.rel = 'noopener';
            hc.cta.style.display = 'block'; hc.cta.setAttribute('tabindex','0');
        } else {
            hc.cta.style.display = 'none'; hc.cta.setAttribute('tabindex','-1');
        }

        //Media
        const poster = project.dataset.poster || '';
        const video = project.dataset.video;

        if (video) {
            mountVideo(video);
        } else if (poster) {
            showImage(poster, `${title} preview`);
        } else            { 
            clearVideo(); 
            mediaMount.textContent = ''; 
        }

        hc.title.textContent = title;
        hc.tag.textContent = tag;
        hc.year.textContent = year;
        hc.tech.textContent = tech;
        hc.b1.textContent = b1;
        hc.b2.textContent = b2;

        // Change the attribute to trigger CSS animations
        hoverCard.setAttribute('data-content', title[0]);
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
            // Only redirect on desktop, not on mobile
            if (!isMobile()) {
                const repo = project.dataset.repo;
                if (repo) window.open(repo, '_blank', 'noopener');
            }
        };
        project.addEventListener('click', openPrimary);
        project.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPrimary(); }
        });
    })
}

// ===== MOBILE PROJECT POPULATION =====
function populateMobileProjects() {
    // Only run on mobile
    if (!isMobile()) return;
    
    const projects = document.querySelectorAll('.list-item');
    
    projects.forEach((project) => {
        // Get all the data attributes
        const title = project.dataset.title || '';
        const tag = project.dataset.tag || '';
        const year = project.dataset.year || '';
        const tech = project.dataset.tech || '';
        const b1 = project.dataset.b1 || '';
        const b2 = project.dataset.b2 || '';
        const live = project.dataset.live || '';
        const article = project.dataset.article || '';
        const poster = project.dataset.poster || '';
        const video = project.dataset.video || '';
        
        // Find the mobile elements within this project
        const projectTitle = project.querySelector('#project-title');
        const projectTag = project.querySelector('#project-tag');
        const projectYear = project.querySelector('#project-year');
        const projectTech = project.querySelector('#project-tech');
        const projectB1 = project.querySelector('#project-b1');
        const projectB2 = project.querySelector('#project-b2');
        const projectCta = project.querySelector('#project-cta');
        const projectVideo = project.querySelector('#project-video');
        
        // Populate the title (this is already in the h2, but let's make sure)
        if (projectTitle) {
            projectTitle.textContent = title;
        }
        
        // Populate the tag
        if (projectTag) {
            projectTag.textContent = tag;
        }
        
        // Populate the year chip
        if (projectYear) {
            projectYear.textContent = year;
        }
        
        // Populate the tech chip
        if (projectTech) {
            projectTech.textContent = tech;
        }
        
        // Populate the bullet points
        if (projectB1) {
            projectB1.textContent = b1;
        }
        if (projectB2) {
            projectB2.textContent = b2;
        }
        
        // Set up the CTA link
        if (projectCta) {
            if (live || article) {
                projectCta.href = live || article;
                projectCta.textContent = live ? 'View Live Site' : 'View Article';
                projectCta.target = '_blank';
                projectCta.rel = 'noopener';
                projectCta.style.display = 'block';
                projectCta.setAttribute('tabindex', '0');
            } else {
                projectCta.style.display = 'none';
                projectCta.setAttribute('tabindex', '-1');
            }
        }
        
        // Set up the mobile repository button
        const mobileRepoBtn = project.querySelector('.mobile-repo-btn');
        if (mobileRepoBtn) {
            const repo = project.dataset.repo;
            if (repo) {
                mobileRepoBtn.href = repo;
                mobileRepoBtn.style.display = 'flex';
                mobileRepoBtn.setAttribute('tabindex', '0');
            } else {
                mobileRepoBtn.style.display = 'none';
                mobileRepoBtn.setAttribute('tabindex', '-1');
            }
        }
        
        // Handle media (video or poster)
        if (projectVideo) {
            if (video) {
                // Set up video for mobile - NO autoplay, tap-to-play instead
                projectVideo.src = video;
                projectVideo.preload = 'metadata'; // Just load metadata, not full video
                projectVideo.loop = true;
                projectVideo.muted = true;
                projectVideo.playsInline = true;
                projectVideo.style.display = 'block';
                
                // Remove existing event listeners to prevent duplicates
                projectVideo.removeEventListener('click', projectVideo._clickHandler);
                projectVideo.removeEventListener('play', projectVideo._playHandler);
                projectVideo.removeEventListener('pause', projectVideo._pauseHandler);
                projectVideo.removeEventListener('ended', projectVideo._endedHandler);
                
                // Create handler functions and store references
                projectVideo._clickHandler = function() {
                    if (projectVideo.paused) {
                        projectVideo.play().catch(() => {
                            console.log(`Could not play video for ${title}`);
                        });
                    } else {
                        projectVideo.pause();
                    }
                };
                
                projectVideo._playHandler = function() {
                    projectVideo.classList.add('playing');
                };
                
                projectVideo._pauseHandler = function() {
                    projectVideo.classList.remove('playing');
                };
                
                projectVideo._endedHandler = function() {
                    projectVideo.classList.remove('playing');
                };
                
                // Add event listeners
                projectVideo.addEventListener('click', projectVideo._clickHandler);
                projectVideo.addEventListener('play', projectVideo._playHandler);
                projectVideo.addEventListener('pause', projectVideo._pauseHandler);
                projectVideo.addEventListener('ended', projectVideo._endedHandler);
                
                // Add visual indicator that video is tappable
                projectVideo.style.cursor = 'pointer';
                projectVideo.title = 'Tap to play/pause';
                
                // Don't autoplay - let user control it
                // projectVideo.play().catch(() => {
                //     console.log(`Could not autoplay video for ${title}`);
                // });
            } else if (poster) {
                // Create and set poster image
                const posterImg = document.createElement('img');
                posterImg.src = poster;
                posterImg.alt = `${title} preview`;
                
                // Replace video with poster image
                projectVideo.style.display = 'none';
                projectVideo.parentNode.appendChild(posterImg);
            } else {
                // No media available
                projectVideo.style.display = 'none';
            }
        }
        
        console.log(`Populated mobile project: ${title} (${video ? 'video' : poster ? 'poster' : 'no media'})`);
    });
}

function init() {
    initLoadingScreen();
    initSmoothScrolling();
    initParallaxEffects();
    createStars();
    initStarParallax();
    initScrollTriggers();
    // scrambleProjects();
    // revealProjectsProgressive();
    revealProjectsWithScramble();
    initFloatingFooter();
    initHoverCard();
    populateMobileProjects(); // Add this line
}

// ===== START EVERYTHING =====
document.addEventListener('DOMContentLoaded', init);
