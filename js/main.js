// ================================
// CONSTANTES
// ================================

const BREAKPOINT_DESKTOP       = 768;
const HERO_AUTOPLAY_DELAY      = 6000;
const SEO_MASK_FADE_SPEED      = 3.5;
const SEO_TEXT_FADE_SPEED      = 4.5;
const CONTENT_REVEAL_OFFSET    = 0.2;
const CONTENT_REVEAL_SPEED     = 2.5;
const CONTENT_START_Y          = 5;
const HERO_SCALE_REDUCTION     = 0.1;
const HERO_MAX_RADIUS          = 6;
const MOBILE_AUTO_SCROLL_DELAY = 800;
const MOBILE_AUTO_SCROLL_POS   = 1.95;
const AUTO_ANIM_DURATION       = 600;
const ROTATING_TEXT_INTERVAL   = 2000;


// ================================
// UTILS
// ================================

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

const onScrollRAF = (handler) => {
    let ticking = false;
    return () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handler();
                ticking = false;
            });
            ticking = true;
        }
    };
};


// ================================
// HERO SLIDER
// ================================

const initHeroSlider = () => {
    const heroSection = document.querySelector('.mdl-herodesktop');
    if (!heroSection) return;

    const swiperContainer = heroSection.querySelector('.swiper');
    const slides          = heroSection.querySelectorAll('.swiper-slide');
    const nextBtn         = heroSection.querySelector('.swiper-button-next');
    const prevBtn         = heroSection.querySelector('.swiper-button-prev');

    if (slides.length > 1) {
        new Swiper(swiperContainer, {
            slidesPerView : 1,
            loop          : true,
            effect        : 'fade',
            fadeEffect    : { crossFade: true },
            autoplay      : { delay: HERO_AUTOPLAY_DELAY, disableOnInteraction: false },
            navigation    : { nextEl: nextBtn, prevEl: prevBtn },
        });
    } else {
        if (nextBtn) nextBtn.style.display = 'none';
        if (prevBtn) prevBtn.style.display = 'none';
    }
};


// ================================
// WOW EFFECTS
// ================================

const initWowEffects = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.wow-up').forEach(el => observer.observe(el));
};


// ================================
// SCROLL ANIMATION
// ================================

const initMasterScrollAnimation = () => {
    const heroSection  = document.querySelector('.mdl-herodesktop');
    const maskLayer    = document.querySelector('.js-seo-mask');
    const initialText  = document.querySelector('.js-seo-initial');
    const contentLayer = document.querySelector('.js-seo-content');

    if (!heroSection || !maskLayer || !contentLayer) return;

    let isDesktop       = window.innerWidth >= BREAKPOINT_DESKTOP;
    let lastMaskOpacity = 1;
    let hasAutoScrolled = false;
    let lastScrollY     = 0;

    let animRafId        = null;
    let animStartTime    = null;
    let animFromProgress = 0;
    let animToProgress   = 1;

    const setContentState = (progress) => {
        const y = Math.max(0, CONTENT_START_Y - progress * CONTENT_START_Y);
        contentLayer.style.opacity   = progress;
        contentLayer.style.transform = `translateY(${y}rem)`;
    };

    const startAutoAnim = (from, to) => {
        if (animRafId) {
            cancelAnimationFrame(animRafId);
            animRafId = null;
        }

        animFromProgress = from;
        animToProgress   = to;
        animStartTime    = null;

        const step = (timestamp) => {
            if (!animStartTime) animStartTime = timestamp;
            const elapsed  = timestamp - animStartTime;
            const t        = clamp(elapsed / AUTO_ANIM_DURATION, 0, 1);
            const progress = animFromProgress + (animToProgress - animFromProgress) * t;

            setContentState(progress);

            if (t < 1) {
                animRafId = requestAnimationFrame(step);
            } else {
                animRafId = null;
            }
        };

        animRafId = requestAnimationFrame(step);
    };

    const handleScroll = () => {
        const scrollY        = window.scrollY;
        const windowHeight   = window.innerHeight;
        const scrollingDown  = scrollY >= lastScrollY;
        lastScrollY          = scrollY;

        const heroProgress = clamp(scrollY / windowHeight, 0, 1);
        const heroScale    = isDesktop ? 1 - heroProgress * HERO_SCALE_REDUCTION : 1;
        const heroRadius   = isDesktop ? heroProgress * HERO_MAX_RADIUS : 0;

        heroSection.style.transform               = `translateY(-${heroProgress * 100}vh) scale(${heroScale})`;
        heroSection.style.borderBottomLeftRadius  = `${heroRadius}rem`;
        heroSection.style.borderBottomRightRadius = `${heroRadius}rem`;
        heroSection.style.pointerEvents           = heroProgress > 0.9 ? 'none' : 'auto';

        const seoScrollY     = Math.max(0, scrollY - windowHeight);
        const maxScroll      = document.documentElement.scrollHeight - windowHeight;
        const seoTotalScroll = Math.max(maxScroll - windowHeight, windowHeight);
        const seoProgress    = clamp(seoScrollY / seoTotalScroll, 0, 1);

        if (!isDesktop && scrollY >= windowHeight && !hasAutoScrolled) {
            hasAutoScrolled = true;
            setTimeout(() => {
                window.scrollTo({ top: windowHeight * MOBILE_AUTO_SCROLL_POS, behavior: 'smooth' });
            }, MOBILE_AUTO_SCROLL_DELAY);
        }

        if (isDesktop) {
            const maskOpacity = Math.max(0, 1 - seoProgress * SEO_MASK_FADE_SPEED);

            maskLayer.style.transform     = `scale(${1 + seoProgress})`;
            maskLayer.style.opacity       = maskOpacity;
            maskLayer.style.pointerEvents = maskOpacity <= 0 ? 'none' : 'auto';

            if (initialText) {
                initialText.style.opacity = Math.max(0, 1 - seoProgress * SEO_TEXT_FADE_SPEED);
            }

            if (maskOpacity <= 0 && lastMaskOpacity > 0) {
                startAutoAnim(0, 1);
            } else if (maskOpacity > 0 && lastMaskOpacity <= 0) {
                startAutoAnim(1, 0);
            } else if (maskOpacity > 0 && !animRafId) {
                const contentProgress = clamp((seoProgress - CONTENT_REVEAL_OFFSET) * CONTENT_REVEAL_SPEED, 0, 1);
                setContentState(contentProgress);
            }

            lastMaskOpacity = maskOpacity;

        } else if (scrollingDown) {
            const contentStart    = CONTENT_REVEAL_OFFSET;
            const contentProgress = clamp((seoProgress - contentStart) / (1 - contentStart), 0, 1);
            const maskVisible     = seoProgress < contentStart;

            maskLayer.style.transform     = `translateY(-${seoProgress * 30}vh) scale(${1 + seoProgress * 35})`;
            maskLayer.style.opacity       = maskVisible ? '1' : '0';
            maskLayer.style.pointerEvents = maskVisible ? 'auto' : 'none';

            if (initialText) {
                initialText.style.opacity = maskVisible ? '1' : '0';
            }

            setContentState(contentProgress);
        }
    };

    window.addEventListener('scroll', onScrollRAF(handleScroll), { passive: true });

    window.addEventListener('resize', () => {
        isDesktop = window.innerWidth >= BREAKPOINT_DESKTOP;
        hasAutoScrolled = false;
    }, { passive: true });
};


// ================================
// MOBILE MOCK NAV
// ================================

const initMockNav = () => {
    const heroSection = document.querySelector('.mdl-herodesktop');
    const seoSection  = document.querySelector('.mdl-seodesktop');
    const navHero     = document.querySelector('.mobile-mock-nav-hero');
    const navSeo      = document.querySelector('.mobile-mock-nav-seo');

    if (!heroSection || !seoSection || !navHero || !navSeo) return;

    let isMobile = window.innerWidth < BREAKPOINT_DESKTOP;

    const update = () => {
        if (!isMobile) {
            navHero.classList.remove('is-visible');
            navSeo.classList.remove('is-visible');
            return;
        }

        if (window.scrollY === 0) {
            navHero.classList.add('is-visible');
            navSeo.classList.remove('is-visible');
            return;
        }

        const isInSeo = seoSection.getBoundingClientRect().top < window.innerHeight / 2;
        navHero.classList.toggle('is-visible', !isInSeo);
        navSeo.classList.toggle('is-visible',   isInSeo);
    };

    window.addEventListener('scroll', onScrollRAF(update), { passive: true });

    window.addEventListener('resize', () => {
        isMobile = window.innerWidth < BREAKPOINT_DESKTOP;
        update();
    }, { passive: true });

    update();
};


// ================================
// MOBILE ROTATING TEXT
// ================================

const initMobileRotatingText = () => {
    const texts             = document.querySelectorAll('.mobile-rotating-text');
    const progressBar       = document.querySelector('.mobile-progress-bar');
    const progressContainer = document.querySelector('.mobile-progress-container');
    const trigger           = document.querySelector('.mobile-version');

    if (!texts.length || !progressBar || !progressContainer || !trigger) return;

    let index      = 0;
    let intervalId = null;
    const total    = texts.length;

    const show = (i) => {
        texts.forEach((el, idx) => el.classList.toggle('active', idx === i));
        progressBar.style.width = `${((i + 1) / total) * 100}%`;
    };

    const stop = () => {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    };

    const startFrom = (i) => {
        stop();
        index = i;
        show(index);
        intervalId = setInterval(() => {
            index = (index + 1) % total;
            show(index);
        }, ROTATING_TEXT_INTERVAL);
    };

    const reset = () => {
        stop();
        index = 0;
        show(0);
    };

    const goToClientX = (clientX) => {
        const rect    = progressContainer.getBoundingClientRect();
        const percent = (clientX - rect.left) / rect.width;
        startFrom(clamp(Math.floor(percent * total), 0, total - 1));
    };

    progressContainer.addEventListener('click', (e) => goToClientX(e.clientX));
    progressContainer.addEventListener('touchstart', (e) => {
        e.preventDefault();
        goToClientX(e.touches[0].clientX);
    }, { passive: false });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
                startFrom(0);
            } else {
                reset();
            }
        });
    }, { threshold: [0, 0.6] });

    observer.observe(trigger);

    const mq = window.matchMedia(`(min-width: ${BREAKPOINT_DESKTOP}px)`);
    mq.addEventListener('change', (e) => { if (e.matches) stop(); });

    show(0);
    progressBar.style.width = `${(1 / total) * 100}%`;
};


// ================================
// INIT
// ================================

document.addEventListener('DOMContentLoaded', () => {
    initHeroSlider();
    initWowEffects();
    initMasterScrollAnimation();
    initMockNav();
    initMobileRotatingText();
});