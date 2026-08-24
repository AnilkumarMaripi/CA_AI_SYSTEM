import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const heroData = {
  why: {
    words: ["We", "drive", "growth", "to", "your", "business"],
    subtitle: "Unlock your brand's potential with our proven marketing expertise. From strategy to execution, we drive growth."
  },
  about: {
    words: ["Built", "by", "operators", "who", "shipped", "real", "brands"],
    subtitle: "Six years in-house at growth-stage startups taught us what actually moves a number. Now we run that playbook for you."
  },
  portfolio: {
    words: ["Forty", "launches.", "Eleven", "rebrands.", "Three", "IPOs."],
    subtitle: "Selected work across SaaS, consumer, and fintech. Every project earned a number we can show you on a call."
  }
};

const testimonials = [
  {
    p1: "The final product exceeded my expectations.",
    p2: "Impressed with the results!",
    initials: "AS.",
    avatars: [12, 47]
  },
  {
    p1: "Best agency we've ever worked with.",
    p2: "ROI through the roof in six weeks.",
    initials: "MK.",
    avatars: [32, 68]
  },
  {
    p1: "They understood our vision and shipped it fast.",
    p2: "Felt like an extension of our team.",
    initials: "JR.",
    avatars: [52, 60]
  }
];

export default function LandingHero() {
  const [activeTab, setActiveTab] = useState('why');
  const [currentWords, setCurrentWords] = useState(heroData.why.words);
  const [currentSubtitle, setCurrentSubtitle] = useState(heroData.why.subtitle);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const stat1Ref = useRef(null);
  const stat2Ref = useRef(null);
  const headlineRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaBigRef = useRef(null);
  const tagsContainerRef = useRef(null);
  const testimonialContainerRef = useRef(null);

  // Initial Intro Animations
  useEffect(() => {
    document.body.classList.add('js-ready');

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(".top-bar", { opacity: 1, duration: 0.4 })
      .from(".top-bar", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.8,
        ease: "power2.inOut"
      }, "<")
      .to("nav", { opacity: 1, duration: 0.4 }, "-=0.3")
      .from("nav", { y: -20, scale: 0.95, duration: 0.7, ease: "back.out(1.5)" }, "<")
      .to(".headline .word, .headline .arrow", { opacity: 1, duration: 0.4, stagger: 0.06 }, "-=0.3")
      .from(".headline .word", {
        y: 40,
        rotateX: -50,
        duration: 0.8,
        stagger: 0.06,
        ease: "back.out(1.4)"
      }, "<")
      .from(".headline .arrow", {
        scale: 0,
        rotation: -90,
        duration: 0.7,
        ease: "back.out(2)"
      }, "-=0.4")
      .to(".subtitle", { opacity: 1, duration: 0.5 }, "-=0.3")
      .from(".subtitle", { y: 14, duration: 0.55 }, "<")
      .to(".cta-yellow", { opacity: 1, duration: 0.4 }, "-=0.3")
      .from(".cta-yellow", {
        y: 24,
        scale: 0.85,
        duration: 0.7,
        ease: "back.out(1.7)"
      }, "<")
      .to(".card-base, .stat-half", { opacity: 1, duration: 0.4, stagger: 0.1 }, "-=0.2")
      .from(".card-base, .stat-half", {
        y: 30,
        scale: 0.96,
        duration: 0.7,
        stagger: 0.1,
        ease: "back.out(1.4)"
      }, "<")
      .to(".tag", { opacity: 1, duration: 0.3, stagger: 0.06 }, "-=0.5")
      .from(".tag", {
        scale: 0.3,
        duration: 0.7,
        stagger: 0.06,
        ease: "back.out(2)"
      }, "<");

    // Continuous loops
    gsap.to(".headline .arrow", {
      y: -5,
      rotation: 3,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 2.5
    });

    gsap.to(".cta-yellow", {
      scale: 1.02,
      duration: 1.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 3
    });

    // Counters initial animation
    animateCounter(stat1Ref.current, 1.2, "M+", 1.6, "");
    animateCounter(stat2Ref.current, 3, "M", 1.6, "$");

  }, []);

  // Counter helper
  const animateCounter = (el, target, suffix, duration, prefix = "") => {
    if (!el) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: duration,
      ease: "power2.out",
      onUpdate: () => {
        let displayVal = target >= 1 ? obj.val.toFixed(target % 1 === 0 ? 0 : 1) : obj.val.toFixed(1);
        el.textContent = prefix + displayVal + suffix;
      }
    });
  };

  // Nav Tab Switching Handler
  const handleTabChange = (tab) => {
    if (tab === activeTab || !heroData[tab]) return;

    setActiveTab(tab);
    const data = heroData[tab];

    // Fade out headline & subtitle
    gsap.to(".headline .word, .headline .arrow", {
      opacity: 0,
      y: -10,
      duration: 0.25,
      stagger: 0.02,
      ease: "power2.in",
      onComplete: () => {
        setCurrentWords(data.words);
        gsap.set(".headline .word, .headline .arrow", { opacity: 0, y: 15 });
        gsap.to(".headline .word, .headline .arrow", {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.04,
          ease: "back.out(1.4)"
        });
      }
    });

    gsap.to(subtitleRef.current, {
      opacity: 0,
      y: -6,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        setCurrentSubtitle(data.subtitle);
        gsap.set(subtitleRef.current, { opacity: 0, y: 8 });
        gsap.to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out"
        });
      }
    });
  };

  // Shuffle Tags Handler
  const shuffleTags = (clickedTag) => {
    if (!tagsContainerRef.current) return;
    const tags = tagsContainerRef.current.querySelectorAll(".tag");

    const slots = [
      { top: 5, left: 25 },
      { top: 18, left: 0 },
      { top: 18, left: 55 },
      { top: 42, left: 12 },
      { top: 42, left: 58 },
      { top: 70, left: 4 },
      { top: 70, left: 50 },
      { top: 88, left: 25 }
    ];
    const shuffled = [...slots].sort(() => Math.random() - 0.5);

    tags.forEach((tag, i) => {
      const slot = shuffled[i] || shuffled[0];
      const rotation = Math.random() * 14 - 7;
      gsap.to(tag, {
        top: slot.top + "%",
        left: slot.left + "%",
        rotation: rotation,
        duration: 0.7,
        ease: "back.out(1.4)",
        delay: i * 0.03
      });
    });

    if (clickedTag) {
      gsap.fromTo(
        clickedTag,
        { scale: 1 },
        {
          scale: 1.25,
          duration: 0.18,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut"
        }
      );
    }
  };

  // Testimonial Carousel Auto-Cycle
  const cycleTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      cycleTestimonial();
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Animate testimonial transition on index change
  useEffect(() => {
    if (!testimonialContainerRef.current) return;
    const el = testimonialContainerRef.current;
    gsap.fromTo(
      el.children,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.05, ease: "power3.out" }
    );
  }, [testimonialIndex]);

  // Book a Call interactions
  const handleCtaClick = () => {
    if (!ctaBigRef.current) return;
    gsap.fromTo(
      ctaBigRef.current,
      { scale: 0.94 },
      { scale: 1, duration: 0.6, ease: "elastic.out(1.2, 0.4)" }
    );
    gsap.fromTo(
      ".headline .arrow",
      { scale: 1 },
      {
        scale: 1.3,
        rotation: 15,
        duration: 0.4,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      }
    );
  };

  const handleNavBookClick = () => {
    if (ctaBigRef.current) {
      ctaBigRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        gsap.fromTo(
          ctaBigRef.current,
          { scale: 1 },
          {
            scale: 1.08,
            duration: 0.4,
            yoyo: true,
            repeat: 2,
            ease: "power2.inOut"
          }
        );
      }, 400);
    }
  };

  const currentTestimonial = testimonials[testimonialIndex];

  return (
    <>
      <div className="top-bar"></div>

      <div className="page">
        {/* ============= NAV ============= */}
        <nav>
          <div className="nav-pill">
            <a href="#" className="logo">FirstPlace</a>
            <button
              className={`nav-link ${activeTab === 'why' ? 'active' : ''}`}
              onClick={() => handleTabChange('why')}
            >
              Why Us
            </button>
            <button
              className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => handleTabChange('about')}
            >
              About Us
            </button>
            <button
              className={`nav-link ${activeTab === 'portfolio' ? 'active' : ''}`}
              onClick={() => handleTabChange('portfolio')}
            >
              Portfolio
            </button>
            <button className="book-cta" onClick={handleNavBookClick}>Book a call</button>
          </div>
        </nav>

        {/* ============= HERO ============= */}
        <main className="hero">
          <h1 className="headline" id="headline" ref={headlineRef}>
            {currentWords.map((word, idx) => (
              <React.Fragment key={idx}>
                <span className="word">{word}</span>{" "}
              </React.Fragment>
            ))}
            <span className="arrow">
              <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 6 38 L 18 26 L 26 32 L 38 16" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 30 14 L 40 14 L 40 24" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </h1>

          <p className="subtitle" id="subtitle" ref={subtitleRef}>
            {currentSubtitle}
          </p>

          <button className="cta-yellow" id="ctaBig" ref={ctaBigRef} onClick={handleCtaClick}>
            Book a call
            <span className="cta-circle">
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M 5 11 L 11 5 M 7 5 L 11 5 L 11 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </main>

        {/* ============= CARDS GRID ============= */}
        <section className="cards-grid">

          {/* Services */}
          <div className="card-base services-card" id="servicesCard">
            <h2 className="card-title">Services</h2>
            <div className="tags-container" id="tagsContainer" ref={tagsContainerRef}>
              <span
                className="tag black"
                data-tag="web"
                style={{ top: '20%', left: '18%', transform: 'rotate(-4deg)' }}
                onClick={(e) => shuffleTags(e.currentTarget)}
              >
                Web Design
              </span>
              <span
                className="tag white"
                data-tag="social"
                style={{ top: '42%', left: '0%', transform: 'rotate(-3deg)' }}
                onClick={(e) => shuffleTags(e.currentTarget)}
              >
                Social Media
              </span>
              <span
                className="tag black"
                data-tag="marketing"
                style={{ top: '42%', left: '55%', transform: 'rotate(-5deg)' }}
                onClick={(e) => shuffleTags(e.currentTarget)}
              >
                Marketing
              </span>
              <span
                className="tag white"
                data-tag="paid"
                style={{ top: '62%', left: '14%', transform: 'rotate(2deg)' }}
                onClick={(e) => shuffleTags(e.currentTarget)}
              >
                <span className="tag-icon">
                  <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 6 1 L 7.2 4.8 L 11 6 L 7.2 7.2 L 6 11 L 4.8 7.2 L 1 6 L 4.8 4.8 Z" fill="currentColor" />
                  </svg>
                </span>
                Paid Ads
              </span>
              <span
                className="tag white"
                data-tag="branding"
                style={{ top: '62%', left: '55%', transform: 'rotate(4deg)' }}
                onClick={(e) => shuffleTags(e.currentTarget)}
              >
                Branding
              </span>
              <span
                className="tag black"
                data-tag="content"
                style={{ top: '84%', left: '6%', transform: 'rotate(-2deg)' }}
                onClick={(e) => shuffleTags(e.currentTarget)}
              >
                Content Creation
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-card">
            <div
              className="stat-half stat-dark"
              id="statTop"
              onClick={() => animateCounter(stat1Ref.current, 1.2, "M+", 1.2, "")}
            >
              <div>
                <div className="stat-number" id="stat1Num" ref={stat1Ref}>1.2M+</div>
              </div>
              <p className="stat-desc">users have interacted with websites built by us.</p>
            </div>
            <div
              className="stat-half stat-light"
              id="statBottom"
              onClick={() => animateCounter(stat2Ref.current, 3, "M", 1.2, "$")}
            >
              <div>
                <div className="stat-number" id="stat2Num" ref={stat2Ref}>$3M</div>
              </div>
              <p className="stat-desc">in funding raised by start-ups we've worked with.</p>
            </div>
          </div>

          {/* Testimonial */}
          <div className="card-base testimonial-card" ref={testimonialContainerRef}>
            <div className="quote-mark">&ldquo;</div>
            <div className="testimonial-text" id="testimonialText">
              <p id="testimonialP1">{currentTestimonial.p1}</p>
              <p id="testimonialP2">{currentTestimonial.p2}</p>
            </div>
            <div
              className="testimonial-avatars"
              id="testimonialAvatars"
              style={{ cursor: 'pointer' }}
              onClick={cycleTestimonial}
            >
              {currentTestimonial.avatars.map((imgId, idx) => (
                <span className="avatar-mini" key={idx}>
                  <svg className="fb" viewBox="0 0 32 32">
                    <circle cx="16" cy="12" r="5" fill="rgba(255,255,255,0.4)" />
                    <path d="M 4 30 Q 4 20 16 20 Q 28 20 28 30 Z" fill="rgba(255,255,255,0.4)" />
                  </svg>
                  <img src={`https://i.pravatar.cc/80?img=${imgId}`} alt="Avatar" />
                </span>
              ))}
              <span className="author-label" id="authorInitials">{currentTestimonial.initials}</span>
            </div>
          </div>

        </section>
      </div>
    </>
  );
}
