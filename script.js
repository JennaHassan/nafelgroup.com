// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar hide/show on scroll
let lastScrollTop = 0;
let ticking = false;

function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (navbar) {
        // Keep navbar transparent at all times
        navbar.style.background = 'transparent';
        navbar.style.backdropFilter = 'none';
        
        // Hide navbar when scrolling down, show when scrolling up
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    }
    
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick);

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.person-card, .service-card, .about-content, .section-header');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});

// Dropdown menu functionality - hover only
// The CSS handles the hover functionality, no JavaScript needed for desktop
// For mobile devices, we'll keep the click functionality
document.querySelectorAll('.dropdown').forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const content = dropdown.querySelector('.dropdown-content');
    
    // Only add click functionality for mobile devices
    if (window.innerWidth <= 768) {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const isVisible = content.style.opacity === '1';
            
            if (isVisible) {
                content.style.opacity = '0';
                content.style.visibility = 'hidden';
                content.style.transform = 'translateY(-10px)';
            } else {
                content.style.opacity = '1';
                content.style.visibility = 'visible';
                content.style.transform = 'translateY(0)';
            }
        });
    }
});

// Add loading animation to page - ensure all resources are loaded
window.addEventListener('load', () => {
    // Wait for all images to load before showing content
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    
    if (images.length === 0) {
        // No images, show content immediately
        showContent();
    } else {
        images.forEach(img => {
            if (img.complete) {
                loadedImages++;
            } else {
                img.addEventListener('load', () => {
                    loadedImages++;
                    if (loadedImages === images.length) {
                        showContent();
                    }
                });
                img.addEventListener('error', () => {
                    loadedImages++;
                    if (loadedImages === images.length) {
                        showContent();
                    }
                });
            }
        });
        
        // Fallback timeout in case some images don't load
        setTimeout(() => {
            showContent();
        }, 3000);
    }
    
    function showContent() {
        document.body.classList.add('loaded');
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add hover effects to cards
document.querySelectorAll('.person-card, .service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Form validation (if forms are added later)
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#e74c3c';
            isValid = false;
        } else {
            input.style.borderColor = '#ddd';
        }
    });
    
    return isValid;
}

// Utility function to debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add active class to current section in navigation
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// Page Transition System
class PageTransition {
    constructor() {
        this.transitionElement = null;
        this.init();
    }

    init() {
        this.createTransitionElement();
        this.bindNavigationLinks();
        this.handlePageLoad();
    }

    createTransitionElement() {
        // Create transition overlay
        const transitionDiv = document.createElement('div');
        transitionDiv.className = 'page-transition';
        transitionDiv.innerHTML = `
            <img src="nafel black logo.png" alt="Nafel Group" class="page-transition-logo">
            <div class="page-transition-text">Loading...</div>
            <div class="page-transition-spinner"></div>
        `;
        document.body.appendChild(transitionDiv);
        this.transitionElement = transitionDiv;
    }

    bindNavigationLinks() {
        // Add transition to all internal links
        document.querySelectorAll('a[href$=".html"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                this.startTransition(href);
            });
        });
    }

    startTransition(destination) {
        // Show transition overlay immediately
        this.transitionElement.classList.add('active');
        
        // Hide current page content
        const pageContent = document.querySelector('.page-content');
        if (pageContent) {
            pageContent.style.opacity = '0';
            pageContent.style.transform = 'translateY(20px)';
        }

        // Navigate after transition is visible
        setTimeout(() => {
            window.location.href = destination;
        }, 1200);
    }

    handlePageLoad() {
        // Show page content with animation when page loads
        window.addEventListener('load', () => {
            // Ensure transition overlay is hidden
            if (this.transitionElement) {
                this.transitionElement.classList.remove('active');
            }
            
            // Show page content with animation
            setTimeout(() => {
                const pageContent = document.querySelector('.page-content');
                if (pageContent) {
                    pageContent.style.opacity = '1';
                    pageContent.style.transform = 'translateY(0)';
                    pageContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                }
            }, 200);
        });
    }
}

// Initialize page transitions
document.addEventListener('DOMContentLoaded', () => {
    new PageTransition();
    
    // Show page content on initial load
    setTimeout(() => {
        const pageContent = document.querySelector('.page-content');
        if (pageContent) {
            pageContent.style.opacity = '1';
            pageContent.style.transform = 'translateY(0)';
            pageContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
        document.body.classList.add('loaded');
    }, 100);
});

// AI Translation System
class AITranslator {
    constructor() {
        this.isTranslated = false;
        this.originalContent = new Map();
        this.currentLanguage = 'en';
        this.targetLanguage = 'ar'; // Default to Arabic
        this.storageKey = 'nafel_language_state';
        this.init();
    }

    init() {
        this.bindLanguageButton();
        this.storeOriginalContent();
        this.checkLanguageState();
    }

    async checkLanguageState() {
        // Check if there's a saved language state
        const savedState = localStorage.getItem(this.storageKey);
        if (savedState === 'arabic') {
            // Page should be in Arabic, translate it
            this.isTranslated = true;
            this.updateButtonText();
            
            // Show a subtle loading indicator
            const languageBtn = document.getElementById('language-btn');
            if (languageBtn) {
                languageBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            }
            
            // Wait a bit for the page to fully load before translating
            setTimeout(async () => {
                try {
                    await this.translatePage();
                    // Update button to show English option
                    if (languageBtn) {
                        languageBtn.innerHTML = '<i class="fas fa-globe"></i> English';
                    }
                } catch (error) {
                    console.error('Auto-translation failed:', error);
                    // If auto-translation fails, reset to English
                    this.isTranslated = false;
                    localStorage.setItem(this.storageKey, 'english');
                    this.updateButtonText();
                }
            }, 500);
        } else {
            // Page should be in English, ensure it's not translated
            this.isTranslated = false;
            this.updateButtonText();
        }
    }

    updateButtonText() {
        const languageBtn = document.getElementById('language-btn');
        if (languageBtn) {
            if (this.isTranslated) {
                languageBtn.innerHTML = '<i class="fas fa-globe"></i> English';
            } else {
                languageBtn.innerHTML = '<i class="fas fa-globe"></i> اللغة العربية';
            }
        }
    }

    bindLanguageButton() {
        const languageBtn = document.getElementById('language-btn');
        if (languageBtn) {
            languageBtn.addEventListener('click', () => {
                this.toggleTranslation();
            });
        }
    }

    storeOriginalContent() {
        // Store original text content of all translatable elements
        // Use a more comprehensive approach to capture ALL text
        const allElements = document.querySelectorAll('*');
        
        allElements.forEach(element => {
            // Skip elements that shouldn't be translated
            if (this.shouldSkipElement(element)) {
                return;
            }
            
            // Get the text content
            const textContent = element.textContent?.trim();
            
            // Only store elements that have text content and no child elements with text
            if (textContent && 
                textContent.length > 0 && 
                !this.hasTextChildren(element) &&
                !this.originalContent.has(element)) {
                this.originalContent.set(element, textContent);
            }
        });
    }
    
    shouldSkipElement(element) {
        // Skip elements that shouldn't be translated
        const skipTags = ['SCRIPT', 'STYLE', 'IMG', 'VIDEO', 'CANVAS', 'SVG', 'INPUT', 'TEXTAREA', 'SELECT', 'OPTION'];
        const skipClasses = ['no-translate', 'language-btn'];
        
        if (skipTags.includes(element.tagName)) {
            return true;
        }
        
        if (skipClasses.some(cls => element.classList.contains(cls))) {
            return true;
        }
        
        // Skip if element contains media or form elements
        if (element.querySelector('img, video, canvas, svg, input, textarea, select')) {
            return true;
        }
        
        return false;
    }
    
    hasTextChildren(element) {
        // Check if element has child elements that also contain text
        const children = Array.from(element.children);
        return children.some(child => {
            const childText = child.textContent?.trim();
            return childText && childText.length > 0;
        });
    }

    async toggleTranslation() {
        const languageBtn = document.getElementById('language-btn');
        
        if (!this.isTranslated) {
            // Show loading state
            languageBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Translating...';
            languageBtn.disabled = true;
            
            try {
                await this.translatePage();
                this.isTranslated = true;
                // Save state to localStorage
                localStorage.setItem(this.storageKey, 'arabic');
                languageBtn.innerHTML = '<i class="fas fa-globe"></i> English';
            } catch (error) {
                console.error('Translation failed:', error);
                languageBtn.innerHTML = '<i class="fas fa-globe"></i> اللغة العربية';
                this.showTranslationError();
            }
        } else {
            // Restore original content
            this.restoreOriginalContent();
            this.isTranslated = false;
            // Save state to localStorage
            localStorage.setItem(this.storageKey, 'english');
            languageBtn.innerHTML = '<i class="fas fa-globe"></i> اللغة العربية';
        }
        
        languageBtn.disabled = false;
    }

    async translatePage() {
        const elementsToTranslate = Array.from(this.originalContent.keys());
        
        // Process elements in batches to avoid overwhelming the API
        const batchSize = 5;
        for (let i = 0; i < elementsToTranslate.length; i += batchSize) {
            const batch = elementsToTranslate.slice(i, i + batchSize);
            await Promise.all(batch.map(element => this.translateElement(element)));
            
            // Small delay between batches to be respectful to the API
            if (i + batchSize < elementsToTranslate.length) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
    }

    async translateElement(element) {
        const originalText = this.originalContent.get(element);
        if (!originalText) return;

        try {
            const translatedText = await this.translateText(originalText);
            element.textContent = translatedText;
        } catch (error) {
            console.error('Failed to translate element:', error);
            // Keep original text if translation fails
        }
    }

    async translateText(text) {
        // Use a free translation API (Google Translate API via proxy or similar)
        // For demo purposes, we'll use a simple translation service
        // In production, you'd want to use a proper translation API
        
        try {
            // Using LibreTranslate (free alternative to Google Translate)
            const response = await fetch('https://libretranslate.de/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: text,
                    source: this.currentLanguage,
                    target: this.targetLanguage,
                    format: 'text'
                })
            });

            if (!response.ok) {
                throw new Error('Translation service unavailable');
            }

            const data = await response.json();
            const translatedText = data.translatedText || text;
            
            // If the API translation seems incomplete or poor, use fallback
            if (translatedText === text || translatedText.length < text.length * 0.3) {
                return this.fallbackTranslation(text);
            }
            
            return translatedText;
        } catch (error) {
            console.error('Translation API error:', error);
            
            // Fallback: Use comprehensive sentence and word replacement
            return this.fallbackTranslation(text);
        }
    }

    fallbackTranslation(text) {
        // Comprehensive fallback translation with sentence-level context
        const translations = {
            // Navigation and UI
            'Home': 'الرئيسية',
            'Construction and Engineering': 'البناء والهندسة',
            'Automation and Technology': 'الأتمتة والتكنولوجيا',
            'Our Team': 'فريقنا',
            'Language': 'اللغة',
            'اللغة العربية': 'اللغة العربية',
            
            // Hero and main content
            'Leading Engineering, Automation & Construction Solutions': 'حلول رائدة في الهندسة والأتمتة والبناء',
            'Discover Our Story': 'اكتشف قصتنا',
            'About Us': 'من نحن',
            'Services': 'الخدمات',
            'Projects': 'المشاريع',
            'Contact': 'اتصل بنا',
            'Quick Links': 'روابط سريعة',
            'All rights reserved': 'جميع الحقوق محفوظة',
            
            // Company names
            'FAL Construction': 'فال للإنشاءات',
            'Emcan Engineering': 'إمكان للهندسة',
            'Emcan Consultants & Engineers': 'إمكان للاستشارات والمهندسين',
            'Nafel Co': 'نافل للمقاولات',
            'Nafel Contracting': 'نافل للمقاولات',
            'Nafel Tech': 'نافل للتكنولوجيا',
            'Fuselab Creative': 'فيوزلاب الإبداعية',
            'Fuselab Creative SA': 'فيوزلاب الإبداعية السعودية',
            'Sedrah Project Management': 'سدرة لإدارة المشاريع',
            'Bee Automations': 'بي للأتمتة',
            
            // Complete sentence translations for company descriptions
            'Professional construction services delivering quality building solutions.': 'خدمات إنشاءات مهنية تقدم حلول بناء عالية الجودة.',
            'Certified engineering consultancy for industrial architecture and MEP design.': 'استشارات هندسية معتمدة للهندسة المعمارية الصناعية وتصميم الميكانيكية والكهربائية والسباكة.',
            'Professional construction and contracting services delivering quality infrastructure and building solutions.': 'خدمات إنشاءات ومقاولات مهنية تقدم حلول البنية التحتية والبناء عالية الجودة.',
            'Advanced technology solutions and digital transformation services.': 'حلول تكنولوجية متقدمة وخدمات التحول الرقمي.',
            'UX/UI services creating transformational digital experiences using artificial intelligence and machine learning.': 'خدمات تجربة المستخدم وواجهة المستخدم لإنشاء تجارب رقمية تحويلية باستخدام الذكاء الاصطناعي والتعلم الآلي.',
            'Comprehensive project management and construction supervision services.': 'خدمات شاملة لإدارة المشاريع والإشراف على الإنشاءات.',
            'Automation solutions for coffee roasters and food producers to scale more efficiently with less waste.': 'حلول أتمتة لمحمصات القهوة ومنتجي الأغذية للتحجيم بكفاءة أكبر مع تقليل الهدر.',
            
            // About page content
            'Who We Are': 'من نحن',
            'Our Mission': 'مهمتنا',
            'Our Vision': 'رؤيتنا',
            'Our Values': 'قيمنا',
            'Integrity': 'النزاهة',
            'Innovation': 'الابتكار',
            'Collaboration': 'التعاون',
            
            // Complete About page paragraph translations
            'Nafel Group specializes in engineering, construction, and technology solutions, delivering services across industries such as electromechanical engineering, creative design, and project management. Founded on integrity, quality, and customer satisfaction, the group has grown from a single engineering firm into a diversified portfolio of companies. Its success is driven by a skilled team, a commitment to innovation, and an unwavering focus on excellence. Nafel Group continues to lead by staying ahead of industry trends and technological advancements, providing forward-thinking solutions that meet the evolving needs of its clients.': 'تتخصص مجموعة نافل في حلول الهندسة والبناء والتكنولوجيا، وتقدم الخدمات عبر الصناعات مثل الهندسة الكهربائية والميكانيكية والتصميم الإبداعي وإدارة المشاريع. تأسست على النزاهة والجودة ورضا العملاء، نمت المجموعة من شركة هندسية واحدة إلى محفظة متنوعة من الشركات. يحرك نجاحها فريق ماهر والتزام بالابتكار وتركيز لا يتزعزع على التميز. تواصل مجموعة نافل القيادة من خلال البقاء في المقدمة من الاتجاهات الصناعية والتقدم التكنولوجي، وتقديم حلول متقدمة تلبي الاحتياجات المتطورة لعملائها.',
            
            'To deliver innovative engineering, construction, and technology solutions that exceed client expectations while maintaining the highest standards of quality, safety, and environmental responsibility.': 'تقديم حلول هندسية وبناء وتكنولوجية مبتكرة تتجاوز توقعات العملاء مع الحفاظ على أعلى معايير الجودة والسلامة والمسؤولية البيئية.',
            
            'To be the leading provider of integrated solutions across engineering, construction, and technology sectors, recognized for our innovation, reliability, and commitment to sustainable development.': 'أن نكون المزود الرائد للحلول المتكاملة عبر قطاعات الهندسة والبناء والتكنولوجيا، معترف بنا لابتكارنا وموثوقيتنا والتزامنا بالتنمية المستدامة.',
            
            'We conduct business with honesty, transparency, and ethical practices in all our interactions.': 'نقوم بأعمالنا بالصدق والشفافية والممارسات الأخلاقية في جميع تفاعلاتنا.',
            
            'We embrace new technologies and creative solutions to address complex challenges.': 'نحتضن التقنيات الجديدة والحلول الإبداعية لمعالجة التحديات المعقدة.',
            
            'We work together as a team, fostering partnerships and building strong relationships.': 'نعمل معاً كفريق واحد، ونعزز الشراكات ونبني علاقات قوية.',
            
            // Team page content
            'Meet The Team': 'تعرف على الفريق',
            'Businessman & Chairman': 'رجل أعمال ورئيس',
            'Co-founder and Managing Director': 'شريك مؤسس ومدير تنفيذي',
            'Operations Manager': 'مدير العمليات',
            'Engineering Manager': 'مدير الهندسة',
            'MEP Manager': 'مدير الميكانيكية والكهربائية والسباكة',
            'Bee Automations Leader': 'قائد بي للأتمتة',
            
            // Individual word translations for context
            'Professional': 'مهني',
            'construction': 'الإنشاءات',
            'services': 'الخدمات',
            'delivering': 'تقديم',
            'quality': 'الجودة',
            'building': 'البناء',
            'solutions': 'الحلول',
            'Certified': 'معتمد',
            'engineering': 'الهندسة',
            'consultancy': 'الاستشارات',
            'for': 'لـ',
            'industrial': 'الصناعية',
            'architecture': 'الهندسة المعمارية',
            'and': 'و',
            'MEP': 'الميكانيكية والكهربائية والسباكة',
            'design': 'التصميم',
            'contracting': 'المقاولات',
            'infrastructure': 'البنية التحتية',
            'Advanced': 'متقدمة',
            'technology': 'التكنولوجيا',
            'digital': 'الرقمي',
            'transformation': 'التحول',
            'UX/UI': 'تجربة المستخدم وواجهة المستخدم',
            'creating': 'إنشاء',
            'transformational': 'تحويلية',
            'experiences': 'التجارب',
            'using': 'باستخدام',
            'artificial': 'الاصطناعي',
            'intelligence': 'الذكاء',
            'machine': 'الآلي',
            'learning': 'التعلم',
            'Comprehensive': 'شاملة',
            'project': 'المشاريع',
            'management': 'الإدارة',
            'supervision': 'الإشراف',
            'Automation': 'الأتمتة',
            'coffee': 'القهوة',
            'roasters': 'المحمصات',
            'food': 'الأغذية',
            'producers': 'المنتجين',
            'to': 'لـ',
            'scale': 'التحجيم',
            'more': 'أكثر',
            'efficiently': 'كفاءة',
            'with': 'مع',
            'less': 'أقل',
            'waste': 'هدر',
            
            // Additional context words
            'Engineering': 'الهندسة',
            'Construction': 'البناء',
            'Technology': 'التكنولوجيا',
            'Solutions': 'الحلول',
            'Services': 'الخدمات',
            'Quality': 'الجودة',
            'Innovative': 'مبتكر',
            'Reliable': 'موثوق',
            'Excellence': 'التميز',
            'Customer': 'العميل',
            'Client': 'العميل',
            'Project': 'المشروع',
            'Management': 'الإدارة',
            'Development': 'التطوير',
            'Design': 'التصميم',
            'Creative': 'إبداعي',
            'Digital': 'رقمي',
            'Experience': 'التجربة',
            'Artificial Intelligence': 'الذكاء الاصطناعي',
            'Machine Learning': 'التعلم الآلي',
            'Automation': 'الأتمتة',
            'Industrial': 'صناعي',
            'Architecture': 'الهندسة المعمارية',
            'Civil': 'المدنية',
            'MEP': 'الميكانيكية والكهربائية والسباكة',
            'Supervision': 'الإشراف',
            'Infrastructure': 'البنية التحتية',
            'Building': 'البناء',
            'Coffee': 'القهوة',
            'Food': 'الطعام',
            'Producer': 'المنتج',
            'Roaster': 'المحمص',
            'Scale': 'التحجيم',
            'Efficient': 'كفء',
            'Waste': 'الهدر',
            'Transformational': 'تحويلي',
            'Compelling': 'مقنع',
            'Interface': 'واجهة',
            'Challenges': 'التحديات',
            'Modern': 'حديث',
            'Valued': 'قيم',
            'Fast-changing': 'سريع التغير',
            'Market': 'السوق',
            'Focus': 'التركيز',
            'Experiments': 'التجارب',
            'Models': 'النماذج',
            'Personalized': 'شخصي',
            'Industries': 'الصناعات',
            'Certified': 'معتمد',
            'Consultancy': 'الاستشارات',
            'Registered': 'مسجل',
            'Modon': 'مدن',
            'ECZA': 'هيئة الاستثمار',
            'Municipalities': 'البلديات',
            'End-to-end': 'شامل',
            'Compliance': 'الامتثال',
            'Standards': 'المعايير',
            'Proven': 'مثبت',
            'Expertise': 'الخبرة',
            'Regulatory': 'تنظيمي',
            'Commitment': 'الالتزام',
            'Trusted': 'موثوق',
            'Partner': 'شريك',
            'Kingdom': 'المملكة',
            'Comprehensive': 'شامل',
            'Supervision': 'الإشراف',
            'Leading': 'رائد',
            'Provider': 'مقدم',
            'Integrated': 'متكامل',
            'Sectors': 'القطاعات',
            'Recognized': 'معترف به',
            'Reliability': 'الموثوقية',
            'Sustainable': 'مستدام',
            'Conduct': 'إجراء',
            'Business': 'الأعمال',
            'Honesty': 'الصدق',
            'Transparency': 'الشفافية',
            'Ethical': 'أخلاقي',
            'Practices': 'الممارسات',
            'Interactions': 'التفاعلات',
            'Embrace': 'احتضان',
            'Technologies': 'التقنيات',
            'Creative': 'إبداعي',
            'Address': 'معالجة',
            'Complex': 'معقد',
            'Together': 'معاً',
            'Team': 'الفريق',
            'Fostering': 'تعزيز',
            'Partnerships': 'الشراكات',
            'Building': 'بناء',
            'Strong': 'قوي',
            'Relationships': 'العلاقات',
            'Deliver': 'تقديم',
            'Exceed': 'تجاوز',
            'Expectations': 'التوقعات',
            'Maintaining': 'الحفاظ على',
            'Highest': 'أعلى',
            'Safety': 'السلامة',
            'Environmental': 'البيئي',
            'Responsibility': 'المسؤولية',
            'Leading': 'رائد',
            'Innovation': 'الابتكار',
            'Reliability': 'الموثوقية',
            'Commitment': 'الالتزام',
            'Sustainable': 'مستدام',
            'Development': 'التطوير',
            
            // Additional words for About page context
            'specializes': 'تتخصص',
            'in': 'في',
            'delivering': 'تقديم',
            'across': 'عبر',
            'industries': 'الصناعات',
            'such': 'مثل',
            'as': 'كـ',
            'electromechanical': 'الكهربائية والميكانيكية',
            'creative': 'الإبداعي',
            'Founded': 'تأسست',
            'on': 'على',
            'customer': 'العملاء',
            'satisfaction': 'الرضا',
            'group': 'المجموعة',
            'grown': 'نمت',
            'from': 'من',
            'single': 'واحدة',
            'firm': 'شركة',
            'into': 'إلى',
            'diversified': 'متنوعة',
            'portfolio': 'محفظة',
            'companies': 'الشركات',
            'Its': 'يحرك',
            'success': 'نجاحها',
            'driven': 'يحرك',
            'by': 'من',
            'skilled': 'ماهر',
            'team': 'فريق',
            'commitment': 'التزام',
            'unwavering': 'لا يتزعزع',
            'focus': 'تركيز',
            'excellence': 'التميز',
            'continues': 'تواصل',
            'lead': 'القيادة',
            'staying': 'البقاء',
            'ahead': 'في المقدمة',
            'industry': 'الصناعية',
            'trends': 'الاتجاهات',
            'technological': 'التكنولوجي',
            'advancements': 'التقدم',
            'providing': 'تقديم',
            'forward-thinking': 'متقدمة',
            'solutions': 'حلول',
            'meet': 'تلبي',
            'evolving': 'المتطورة',
            'needs': 'الاحتياجات',
            'clients': 'عملائها',
            'deliver': 'تقديم',
            'innovative': 'مبتكرة',
            'exceed': 'تتجاوز',
            'expectations': 'توقعات',
            'while': 'مع',
            'maintaining': 'الحفاظ على',
            'highest': 'أعلى',
            'standards': 'معايير',
            'safety': 'السلامة',
            'environmental': 'البيئية',
            'responsibility': 'المسؤولية',
            'be': 'أن نكون',
            'leading': 'الرائد',
            'provider': 'المزود',
            'integrated': 'المتكاملة',
            'sectors': 'القطاعات',
            'recognized': 'معترف بنا',
            'reliability': 'موثوقيتنا',
            'sustainable': 'المستدامة',
            'conduct': 'نقوم',
            'business': 'أعمالنا',
            'honesty': 'الصدق',
            'transparency': 'الشفافية',
            'ethical': 'الأخلاقية',
            'practices': 'الممارسات',
            'all': 'جميع',
            'our': 'نحن',
            'interactions': 'تفاعلاتنا',
            'embrace': 'نحتضن',
            'new': 'الجديدة',
            'technologies': 'التقنيات',
            'address': 'معالجة',
            'complex': 'المعقدة',
            'challenges': 'التحديات',
            'work': 'نعمل',
            'together': 'معاً',
            'fostering': 'نعزز',
            'partnerships': 'الشراكات',
            'building': 'نبني',
            'strong': 'قوية',
            'relationships': 'علاقات',
            
            // Company page content translations
            'Emcan is a certified engineering consultancy providing architecture, civil, and MEP designs for industrial projects across Saudi Arabia. Fully registered with Modon, ECZA, and municipalities, they deliver end-to-end engineering solutions that meet the highest standards of quality and compliance. With proven expertise and regulatory commitment, Emcan is a trusted partner for industrial development throughout the Kingdom.': 'إمكان هي استشارات هندسية معتمدة تقدم تصاميم معمارية ومدنية وميكانيكية وكهربائية وسباكة للمشاريع الصناعية عبر المملكة العربية السعودية. مسجلة بالكامل مع مدن وهيئة الاستثمار والبلديات، تقدم حلول هندسية شاملة تلبي أعلى معايير الجودة والامتثال. مع الخبرة المثبتة والالتزام التنظيمي، إمكان هي شريك موثوق للتنمية الصناعية في جميع أنحاء المملكة.',
            
            'Fuselab is a design agency of UX/UI designers who craft transformational strategies and visually compelling digital products that enhance brand and user experiences. They specialize in solving interface challenges through modern UX design, a service highly valued in today\'s fast-changing digital market. With a strong focus on AI and machine learning, the team experiments daily with new models to create personalized, innovative solutions across industries.': 'فيوزلاب هي وكالة تصميم من مصممي تجربة المستخدم وواجهة المستخدم الذين يصنعون استراتيجيات تحويلية ومنتجات رقمية مقنعة بصرياً تعزز تجارب العلامة التجارية والمستخدم. يتخصصون في حل تحديات الواجهة من خلال تصميم تجربة المستخدم الحديث، وهي خدمة عالية القيمة في السوق الرقمي سريع التغير اليوم. مع تركيز قوي على الذكاء الاصطناعي والتعلم الآلي، يجرب الفريق يومياً نماذج جديدة لإنشاء حلول شخصية ومبتكرة عبر الصناعات.',
            
            // Project titles and descriptions
            'MODON Industrial Cities': 'مدن الصناعية',
            'Engineering consultancy and design services for industrial facilities within Saudi Arabia\'s MODON industrial cities, ensuring full regulatory compliance.': 'خدمات استشارات وتصميم هندسية للمنشآت الصناعية داخل المدن الصناعية لمدن في المملكة العربية السعودية، مع ضمان الامتثال التنظيمي الكامل.',
            
            'Pharmaceutical Facilities': 'المنشآت الصيدلانية',
            'Specialized design and engineering for pharmaceutical manufacturing facilities, meeting strict regulatory requirements and industry standards.': 'تصميم وهندسة متخصصة لمنشآت التصنيع الصيدلانية، تلبي متطلبات تنظيمية صارمة ومعايير الصناعة.',
            
            'Real Estate Solutions': 'حلول العقارات',
            'The landscape of UX design for commercial and residential real estate apps has evolved significantly in recent years. Without incorporating GIS mapping tools, smooth animations and transitions, and real-time data visualizations, your application risks falling behind the competition.': 'تطورت مناظر تصميم تجربة المستخدم لتطبيقات العقارات التجارية والسكنية بشكل كبير في السنوات الأخيرة. بدون دمج أدوات رسم الخرائط الجغرافية والرسوم المتحركة السلسة والانتقالات وتصورات البيانات في الوقت الفعلي، تخاطر تطبيقك بالتخلف عن المنافسة.',
            
            'Fintech Applications': 'تطبيقات التكنولوجيا المالية',
            'The Fuselab Fintech Project centers on creating cutting-edge digital solutions aimed at improving and simplifying financial services through technology. A key factor in the effectiveness of these tools is a user-friendly and accessible UI/UX design. The fintech space covers a wide range of services, from mobile banking and digital payments to robo-advisors, peer-to-peer lending, and blockchain innovations.': 'يركز مشروع فيوزلاب للتكنولوجيا المالية على إنشاء حلول رقمية متطورة تهدف إلى تحسين وتبسيط الخدمات المالية من خلال التكنولوجيا. عامل رئيسي في فعالية هذه الأدوات هو تصميم واجهة المستخدم وتجربة المستخدم سهلة الاستخدام ومتاحة. تغطي مساحة التكنولوجيا المالية مجموعة واسعة من الخدمات، من الخدمات المصرفية المحمولة والمدفوعات الرقمية إلى المستشارين الآليين والإقراض من نظير إلى نظير وابتكارات البلوك تشين.',
            
            // Team page content
            'Sheikh Ibrahim Mohammed Falqi is a distinguished businessman, founder, and chairman of multiple industrial companies and factories. He is actively involved in charitable and cooperative associations, demonstrating strong commitment to community development and supporting young entrepreneurs.': 'الشيخ إبراهيم محمد الفلقي رجل أعمال متميز ومؤسس ورئيس لعدة شركات ومصانع صناعية. وهو مشارك بنشاط في الجمعيات الخيرية والتعاونية، مما يظهر التزاماً قوياً بتطوير المجتمع ودعم رواد الأعمال الشباب.',
            
            'Key Leadership Positions:': 'المناصب القيادية الرئيسية:',
            'Chairman, Fal Al-Janoub Industrial Company': 'رئيس، شركة فال الجنوب الصناعية',
            'Chairman, Fal Contracting Company': 'رئيس، شركة فال للمقاولات',
            'Chairman, Rafal Concrete Products Company': 'رئيس، شركة رافال لمنتجات الخرسانة',
            'Chairman, Al-Memaar Building Materials Company': 'رئيس، شركة المعمار لمواد البناء',
            'Vice Chairman, Sanabel Al-Namaa Trading Co. Ltd.': 'نائب رئيس، شركة سنابل النماء التجارية المحدودة',
            
            // Additional individual words for company and team pages
            'certified': 'معتمدة',
            'providing': 'تقدم',
            'architecture': 'معمارية',
            'civil': 'مدنية',
            'designs': 'تصاميم',
            'projects': 'مشاريع',
            'Fully': 'بالكامل',
            'registered': 'مسجلة',
            'Modon': 'مدن',
            'ECZA': 'هيئة الاستثمار',
            'municipalities': 'البلديات',
            'deliver': 'تقدم',
            'end-to-end': 'شاملة',
            'meet': 'تلبي',
            'highest': 'أعلى',
            'standards': 'معايير',
            'compliance': 'الامتثال',
            'proven': 'مثبتة',
            'expertise': 'الخبرة',
            'regulatory': 'التنظيمي',
            'trusted': 'موثوق',
            'partner': 'شريك',
            'development': 'التنمية',
            'throughout': 'في جميع أنحاء',
            'Kingdom': 'المملكة',
            'agency': 'وكالة',
            'designers': 'مصممي',
            'craft': 'يصنعون',
            'transformational': 'تحويلية',
            'strategies': 'استراتيجيات',
            'visually': 'بصرياً',
            'compelling': 'مقنعة',
            'products': 'منتجات',
            'enhance': 'تعزز',
            'brand': 'العلامة التجارية',
            'user': 'المستخدم',
            'experiences': 'التجارب',
            'specialize': 'يتخصصون',
            'solving': 'حل',
            'interface': 'الواجهة',
            'challenges': 'التحديات',
            'through': 'من خلال',
            'modern': 'الحديث',
            'service': 'خدمة',
            'highly': 'عالية',
            'valued': 'القيمة',
            'today\'s': 'اليوم',
            'fast-changing': 'سريع التغير',
            'market': 'السوق',
            'strong': 'قوي',
            'focus': 'تركيز',
            'experiments': 'يجرب',
            'daily': 'يومياً',
            'models': 'نماذج',
            'create': 'إنشاء',
            'personalized': 'شخصية',
            'innovative': 'مبتكرة',
            'across': 'عبر',
            'industries': 'الصناعات',
            'landscape': 'مناظر',
            'commercial': 'التجارية',
            'residential': 'السكنية',
            'apps': 'تطبيقات',
            'evolved': 'تطورت',
            'significantly': 'بشكل كبير',
            'recent': 'الأخيرة',
            'years': 'السنوات',
            'Without': 'بدون',
            'incorporating': 'دمج',
            'GIS': 'الجغرافية',
            'mapping': 'رسم الخرائط',
            'tools': 'أدوات',
            'smooth': 'السلسة',
            'animations': 'الرسوم المتحركة',
            'transitions': 'الانتقالات',
            'real-time': 'في الوقت الفعلي',
            'data': 'البيانات',
            'visualizations': 'تصورات',
            'application': 'تطبيقك',
            'risks': 'تخاطر',
            'falling': 'التخلف',
            'behind': 'عن',
            'competition': 'المنافسة',
            'centers': 'يركز',
            'creating': 'إنشاء',
            'cutting-edge': 'متطورة',
            'aimed': 'تهدف',
            'improving': 'تحسين',
            'simplifying': 'تبسيط',
            'financial': 'المالية',
            'services': 'الخدمات',
            'technology': 'التكنولوجيا',
            'key': 'رئيسي',
            'factor': 'عامل',
            'effectiveness': 'فعالية',
            'these': 'هذه',
            'user-friendly': 'سهلة الاستخدام',
            'accessible': 'متاحة',
            'space': 'مساحة',
            'covers': 'تغطي',
            'wide': 'واسعة',
            'range': 'مجموعة',
            'mobile': 'المحمولة',
            'banking': 'المصرفية',
            'digital': 'الرقمية',
            'payments': 'المدفوعات',
            'robo-advisors': 'المستشارين الآليين',
            'peer-to-peer': 'من نظير إلى نظير',
            'lending': 'الإقراض',
            'blockchain': 'البلوك تشين',
            'innovations': 'الابتكارات',
            'distinguished': 'متميز',
            'founder': 'مؤسس',
            'multiple': 'عدة',
            'industrial': 'صناعية',
            'factories': 'مصانع',
            'actively': 'بنشاط',
            'involved': 'مشارك',
            'charitable': 'الخيرية',
            'cooperative': 'التعاونية',
            'associations': 'الجمعيات',
            'demonstrating': 'مما يظهر',
            'commitment': 'الالتزام',
            'community': 'المجتمع',
            'supporting': 'ودعم',
            'young': 'الشباب',
            'entrepreneurs': 'رواد الأعمال',
            'Positions': 'المناصب',
            'Vice': 'نائب',
            'Chairman': 'رئيس',
            'Company': 'شركة',
            'Ltd': 'المحدودة',
            'Trading': 'التجارية',
            'Co': 'شركة',
            'Building': 'البناء',
            'Materials': 'المواد',
            'Concrete': 'الخرسانة',
            'Products': 'المنتجات',
            'Contracting': 'للمقاولات',
            'Al-Janoub': 'الجنوب',
            'Al-Memaar': 'المعمار',
            'Rafal': 'رافال',
            'Sanabel': 'سنابل',
            'Al-Namaa': 'النماء',
            
            // FAL Construction page content translations
            'FAL Construction is a leading construction company known for delivering large-scale infrastructure, commercial, and specialized building projects on time and within budget. With decades of industry experience, over SAR 12 billion in handed-over contracts, and a workforce of more than 1,200 employees, they combine traditional methods with modern technology to ensure top-tier quality, safety, and innovation. Their expert team handles diverse sectors—from healthcare to industrial—focusing on strong planning, execution, and collaboration.': 'فال للإنشاءات هي شركة إنشاءات رائدة معروفة بتقديم مشاريع البنية التحتية واسعة النطاق والتجارية والمتخصصة في الوقت المحدد وفي حدود الميزانية. مع عقود من الخبرة الصناعية وأكثر من 12 مليار ريال سعودي في العقود المسلمة وقوة عاملة تزيد عن 1200 موظف، يجمعون بين الطرق التقليدية والتكنولوجيا الحديثة لضمان الجودة والسلامة والابتكار من الدرجة الأولى. فريقهم الخبير يتعامل مع قطاعات متنوعة - من الرعاية الصحية إلى الصناعية - مع التركيز على التخطيط القوي والتنفيذ والتعاون.',
            
            'Road Construction': 'إنشاء الطرق',
            'Over 2000km of roads built': 'أكثر من 2000 كيلومتر من الطرق المبنية',
            
            'Commercial and Industrial Buildings Construction': 'إنشاء المباني التجارية والصناعية',
            
            'Real Estate Development': 'تطوير العقارات',
            'Planning, Designing, and Constructing': 'التخطيط والتصميم والبناء',
            
            'Bridge Construction': 'إنشاء الجسور',
            'Over 85 bridges constructed': 'أكثر من 85 جسر تم بناؤه',
            
            'Business Units': 'الوحدات التجارية',
            'Ready-mix concrete plants': 'مصانع الخرسانة الجاهزة',
            'Providing ready-mix concrete for construction projects in multiple regions including Muhayil Asir, Al Majardah, Al Qunfudhah, and Balqarn.': 'تقديم الخرسانة الجاهزة لمشاريع البناء في مناطق متعددة بما في ذلك محايل عسير والمجاردة والقنفذة وبلقرن.',
            
            'Concrete products factory': 'مصنع منتجات الخرسانة',
            'Manufacturing interlocking cement tiles, curbs, and concrete blocks of all sizes for versatile construction needs.': 'تصنيع البلاط الأسمنتي المتشابك والأرصفة وكتل الخرسانة بجميع الأحجام لتلبية احتياجات البناء المتنوعة.',
            
            'Iron & aluminum workshops': 'ورش الحديد والألمنيوم',
            'Offering blacksmithing, fabrication, aluminum works, and carpentry services to support industrial and construction projects.': 'تقديم خدمات الحدادة والتصنيع وأعمال الألمنيوم والنجارة لدعم المشاريع الصناعية والبناء.',
            
            'Asphalt plants': 'مصانع الأسفلت',
            'Producing asphalt materials for road construction and major infrastructure projects.': 'إنتاج مواد الأسفلت لبناء الطرق ومشاريع البنية التحتية الكبرى.',
            
            // Additional FAL Construction specific words
            'leading': 'رائدة',
            'known': 'معروفة',
            'delivering': 'تقديم',
            'large-scale': 'واسعة النطاق',
            'infrastructure': 'البنية التحتية',
            'commercial': 'التجارية',
            'specialized': 'المتخصصة',
            'building': 'البناء',
            'projects': 'المشاريع',
            'time': 'الوقت',
            'budget': 'الميزانية',
            'decades': 'عقود',
            'industry': 'الصناعية',
            'experience': 'الخبرة',
            'over': 'أكثر من',
            'SAR': 'ريال سعودي',
            'billion': 'مليار',
            'handed-over': 'المسلمة',
            'contracts': 'العقود',
            'workforce': 'قوة عاملة',
            'than': 'من',
            'employees': 'موظف',
            'combine': 'يجمعون',
            'traditional': 'التقليدية',
            'methods': 'الطرق',
            'modern': 'الحديثة',
            'ensure': 'ضمان',
            'top-tier': 'من الدرجة الأولى',
            'quality': 'الجودة',
            'safety': 'السلامة',
            'innovation': 'الابتكار',
            'expert': 'الخبير',
            'handles': 'يتعامل',
            'diverse': 'متنوعة',
            'sectors': 'القطاعات',
            'healthcare': 'الرعاية الصحية',
            'focusing': 'مع التركيز',
            'strong': 'القوي',
            'planning': 'التخطيط',
            'execution': 'التنفيذ',
            'collaboration': 'التعاون',
            'Road': 'الطرق',
            'Construction': 'الإنشاء',
            'Over': 'أكثر من',
            'km': 'كيلومتر',
            'roads': 'الطرق',
            'built': 'المبنية',
            'Buildings': 'المباني',
            'Industrial': 'الصناعية',
            'Real': 'العقارات',
            'Estate': 'العقارات',
            'Development': 'التطوير',
            'Planning': 'التخطيط',
            'Designing': 'التصميم',
            'Constructing': 'البناء',
            'Bridge': 'الجسور',
            'bridges': 'الجسور',
            'constructed': 'تم بناؤه',
            'Units': 'الوحدات',
            'Ready-mix': 'الجاهزة',
            'concrete': 'الخرسانة',
            'plants': 'المصانع',
            'Providing': 'تقديم',
            'ready-mix': 'الجاهزة',
            'construction': 'البناء',
            'multiple': 'متعددة',
            'regions': 'المناطق',
            'including': 'بما في ذلك',
            'Muhayil': 'محايل',
            'Asir': 'عسير',
            'Al': 'ال',
            'Majardah': 'المجاردة',
            'Qunfudhah': 'القنفذة',
            'Balqarn': 'بلقرن',
            'products': 'المنتجات',
            'factory': 'المصنع',
            'Manufacturing': 'تصنيع',
            'interlocking': 'المتشابك',
            'cement': 'الأسمنتي',
            'tiles': 'البلاط',
            'curbs': 'الأرصفة',
            'blocks': 'الكتل',
            'sizes': 'الأحجام',
            'versatile': 'المتنوعة',
            'needs': 'الاحتياجات',
            'Iron': 'الحديد',
            'aluminum': 'الألمنيوم',
            'workshops': 'الورش',
            'Offering': 'تقديم',
            'blacksmithing': 'الحدادة',
            'fabrication': 'التصنيع',
            'works': 'الأعمال',
            'carpentry': 'النجارة',
            'support': 'دعم',
            'Asphalt': 'الأسفلت',
            'Producing': 'إنتاج',
            'materials': 'المواد',
            'road': 'الطرق',
            'major': 'الكبرى',
            'infrastructure': 'البنية التحتية',
            
            // Nafel Contracting page content translations
            'Nafel Contracting specializes in delivering advanced fire safety solutions for residential, commercial, and industrial properties. With extensive experience in fire safety engineering, they design, install, and maintain systems that meet top industry standards. Our focus on reliability and excellence ensures effective protection of both lives and property.': 'نافل للمقاولات تتخصص في تقديم حلول السلامة من الحرائق المتقدمة للممتلكات السكنية والتجارية والصناعية. مع خبرة واسعة في هندسة السلامة من الحرائق، يقومون بتصميم وتركيب وصيانة الأنظمة التي تلبي أعلى معايير الصناعة. تركيزنا على الموثوقية والتميز يضمن الحماية الفعالة للأرواح والممتلكات.',
            
            'Nupco Pharmaceutical Warehouse Dammam': 'مستودع نوبكو الصيدلاني الدمام',
            'Supply and installation of fire protection system.': 'توريد وتركيب نظام الحماية من الحرائق.',
            
            'Nupco Pharmaceutical Warehouse Al Baha': 'مستودع نوبكو الصيدلاني الباحة',
            
            'British Aerospace Engineering Systems Facility': 'منشأة أنظمة الهندسة الفضائية البريطانية',
            'Supply and Installation of fire protection system': 'توريد وتركيب نظام الحماية من الحرائق',
            
            'Honeywell': 'هانيويل',
            'Installation of fire protection System': 'تركيب نظام الحماية من الحرائق',
            
            'Red Sea Village -Dubox': 'قرية البحر الأحمر - دوبوكس',
            'Installations of Complete Mechincal Systems': 'تركيب أنظمة ميكانيكية كاملة',
            
            'Riyadh Metro Project': 'مشروع مترو الرياض',
            'Design supply and installation of Aerosol-Statx Fire Supression System': 'تصميم وتوريد وتركيب نظام إخماد الحرائق بالهباء الجوي ستاتكس',
            
            'Services': 'الخدمات',
            'Fire Suppression Systems': 'أنظمة إخماد الحرائق',
            'Advanced fire suppression and detection systems for all types of buildings.': 'أنظمة إخماد وكشف الحرائق المتقدمة لجميع أنواع المباني.',
            
            'Safety Inspections': 'فحوصات السلامة',
            'Regular inspections and maintenance to ensure system reliability.': 'فحوصات وصيانة منتظمة لضمان موثوقية النظام.',
            
            'Emergency Response': 'الاستجابة للطوارئ',
            '24/7 emergency response and rapid repair services.': 'خدمات الاستجابة للطوارئ والإصلاح السريع على مدار الساعة.',
            
            'Visit nafelco.com for more': 'زر nafelco.com للمزيد',
            
            // Additional Nafel Contracting specific words
            'specializes': 'تتخصص',
            'delivering': 'تقديم',
            'advanced': 'المتقدمة',
            'fire': 'الحرائق',
            'safety': 'السلامة',
            'solutions': 'الحلول',
            'residential': 'السكنية',
            'commercial': 'التجارية',
            'industrial': 'الصناعية',
            'properties': 'الممتلكات',
            'extensive': 'واسعة',
            'experience': 'الخبرة',
            'engineering': 'الهندسة',
            'design': 'تصميم',
            'install': 'تركيب',
            'maintain': 'صيانة',
            'systems': 'الأنظمة',
            'meet': 'تلبي',
            'top': 'أعلى',
            'industry': 'الصناعة',
            'standards': 'المعايير',
            'focus': 'تركيزنا',
            'reliability': 'الموثوقية',
            'excellence': 'التميز',
            'ensures': 'يضمن',
            'effective': 'الفعالة',
            'protection': 'الحماية',
            'both': 'كل من',
            'lives': 'الأرواح',
            'property': 'الممتلكات',
            'Nupco': 'نوبكو',
            'Pharmaceutical': 'الصيدلاني',
            'Warehouse': 'المستودع',
            'Dammam': 'الدمام',
            'Supply': 'توريد',
            'installation': 'تركيب',
            'protection': 'الحماية',
            'system': 'النظام',
            'Al': 'ال',
            'Baha': 'الباحة',
            'British': 'البريطانية',
            'Aerospace': 'الفضائية',
            'Systems': 'الأنظمة',
            'Facility': 'المنشأة',
            'Installation': 'تركيب',
            'Honeywell': 'هانيويل',
            'Red': 'البحر',
            'Sea': 'الأحمر',
            'Village': 'القرية',
            'Dubox': 'دوبوكس',
            'Installations': 'تركيب',
            'Complete': 'كاملة',
            'Mechanical': 'ميكانيكية',
            'Riyadh': 'الرياض',
            'Metro': 'مترو',
            'Project': 'المشروع',
            'Design': 'تصميم',
            'supply': 'توريد',
            'Aerosol-Statx': 'الهباء الجوي ستاتكس',
            'Supression': 'إخماد',
            'Suppression': 'إخماد',
            'detection': 'كشف',
            'types': 'أنواع',
            'buildings': 'المباني',
            'Inspections': 'فحوصات',
            'Regular': 'منتظمة',
            'inspections': 'فحوصات',
            'maintenance': 'صيانة',
            'ensure': 'ضمان',
            'system': 'النظام',
            'reliability': 'الموثوقية',
            'Emergency': 'الطوارئ',
            'Response': 'الاستجابة',
            'emergency': 'الطوارئ',
            'response': 'الاستجابة',
            'rapid': 'السريع',
            'repair': 'الإصلاح',
            'services': 'الخدمات',
            'Visit': 'زر',
            'nafelco.com': 'nafelco.com',
            'for': 'لـ',
            'more': 'المزيد',
            
            // Emcan Engineering services section translations
            'Construction Supervision': 'الإشراف على البناء',
            'Professional on-site supervision and quality assurance for industrial construction projects throughout the Kingdom.': 'إشراف مهني على الموقع وضمان الجودة لمشاريع البناء الصناعية في جميع أنحاء المملكة.',
            
            'MEP Engineering Solutions': 'حلول الهندسة الميكانيكية والكهربائية والسباكة',
            'Advanced mechanical, electrical, and plumbing systems design for complex industrial buildings and manufacturing facilities.': 'تصميم أنظمة ميكانيكية وكهربائية وسباكة متقدمة للمباني الصناعية المعقدة والمنشآت التصنيعية.',
            
            'Industrial Design Projects': 'مشاريع التصميم الصناعي',
            'Comprehensive architectural and engineering design for industrial facilities with full regulatory compliance across Saudi Arabia.': 'تصميم معماري وهندسي شامل للمنشآت الصناعية مع الامتثال التنظيمي الكامل عبر المملكة العربية السعودية.',
            
            'Emcan Services': 'خدمات إمكان',
            'Architecture of Record': 'الهندسة المعمارية المسجلة',
            'Comprehensive architectural design and documentation services for industrial buildings.': 'خدمات التصميم المعماري والتوثيق الشاملة للمباني الصناعية.',
            
            'Local Authority Permitting': 'ترخيص السلطات المحلية',
            'Expert assistance with all regulatory approvals and permitting processes.': 'مساعدة خبيرة في جميع الموافقات التنظيمية وعمليات الترخيص.',
            
            'QS and Construction Budget': 'مسح الكميات وميزانية البناء',
            'Detailed quantity surveying and accurate construction budget preparation.': 'مسح كميات مفصل وإعداد دقيق لميزانية البناء.',
            
            'Tender and Contract Documentation': 'توثيق المناقصات والعقود',
            'Professional preparation of tender documents and contract specifications.': 'إعداد مهني لوثائق المناقصات ومواصفات العقود.',
            
            'On-site supervision to ensure quality and compliance throughout construction.': 'إشراف على الموقع لضمان الجودة والامتثال طوال فترة البناء.',
            
            'Client Representation': 'تمثيل العميل',
            'Professional representation of client interests throughout the project lifecycle.': 'تمثيل مهني لمصالح العميل طوال دورة حياة المشروع.',
            
            'Project Management': 'إدارة المشاريع',
            'Comprehensive project management services from conception to completion.': 'خدمات إدارة مشاريع شاملة من التصور إلى الإنجاز.',
            
            // Additional Emcan specific words
            'Professional': 'مهني',
            'on-site': 'على الموقع',
            'supervision': 'الإشراف',
            'quality': 'الجودة',
            'assurance': 'الضمان',
            'industrial': 'الصناعية',
            'construction': 'البناء',
            'projects': 'المشاريع',
            'throughout': 'في جميع أنحاء',
            'Kingdom': 'المملكة',
            'Advanced': 'متقدمة',
            'mechanical': 'الميكانيكية',
            'electrical': 'الكهربائية',
            'plumbing': 'السباكة',
            'systems': 'الأنظمة',
            'design': 'التصميم',
            'complex': 'المعقدة',
            'buildings': 'المباني',
            'manufacturing': 'التصنيعية',
            'facilities': 'المنشآت',
            'Comprehensive': 'شاملة',
            'architectural': 'المعمارية',
            'engineering': 'الهندسية',
            'full': 'الكامل',
            'regulatory': 'التنظيمي',
            'compliance': 'الامتثال',
            'across': 'عبر',
            'Saudi': 'السعودية',
            'Arabia': 'العربية',
            'Services': 'الخدمات',
            'Architecture': 'الهندسة المعمارية',
            'Record': 'المسجلة',
            'documentation': 'التوثيق',
            'Local': 'المحلية',
            'Authority': 'السلطات',
            'Permitting': 'الترخيص',
            'Expert': 'خبيرة',
            'assistance': 'المساعدة',
            'all': 'جميع',
            'approvals': 'الموافقات',
            'permitting': 'الترخيص',
            'processes': 'العمليات',
            'QS': 'مسح الكميات',
            'Budget': 'الميزانية',
            'Detailed': 'مفصل',
            'quantity': 'الكميات',
            'surveying': 'المسح',
            'accurate': 'دقيق',
            'preparation': 'الإعداد',
            'Tender': 'المناقصات',
            'Contract': 'العقود',
            'Documentation': 'التوثيق',
            'preparation': 'الإعداد',
            'tender': 'المناقصات',
            'documents': 'الوثائق',
            'contract': 'العقود',
            'specifications': 'المواصفات',
            'ensure': 'ضمان',
            'compliance': 'الامتثال',
            'Client': 'العميل',
            'Representation': 'التمثيل',
            'representation': 'التمثيل',
            'client': 'العميل',
            'interests': 'المصالح',
            'project': 'المشروع',
            'lifecycle': 'دورة الحياة',
            'Project': 'المشاريع',
            'Management': 'الإدارة',
            'management': 'الإدارة',
            'services': 'الخدمات',
            'conception': 'التصور',
            'completion': 'الإنجاز',
            'from': 'من',
            'to': 'إلى',
            
            // Sedrah Project Management page translations
            'Sedrah Project Management': 'سدرة لإدارة المشاريع',
            'At Sedrah International, we strive to redefine industrial construction by integrating cutting-edge technology, sustainable practices, and exceptional craftsmanship. Our goal is to be the preferred partner for businesses seeking reliable, cost-effective, and innovative construction solutions.': 'في سدرة الدولية، نسعى لإعادة تعريف البناء الصناعي من خلال دمج التكنولوجيا المتطورة والممارسات المستدامة والحرفية الاستثنائية. هدفنا هو أن نكون الشريك المفضل للشركات التي تسعى إلى حلول بناء موثوقة وفعالة من حيث التكلفة ومبتكرة.',
            
            'Services': 'الخدمات',
            'Industrial Factories': 'المصانع الصناعية',
            'Designing and constructing modern, scalable manufacturing facilities that support efficient production.': 'تصميم وبناء منشآت تصنيعية حديثة وقابلة للتوسع تدعم الإنتاج الفعال.',
            
            'Warehouses': 'المستودعات',
            'Building robust and technologically advanced warehouses to optimize storage and logistics.': 'بناء مستودعات قوية ومتطورة تكنولوجياً لتحسين التخزين واللوجستيات.',
            
            'Cold Stores': 'المخازن الباردة',
            'Constructing temperature-controlled cold storage facilities for safe preservation of perishable goods.': 'بناء منشآت تخزين باردة خاضعة لدرجة الحرارة للحفاظ الآمن على السلع القابلة للتلف.',
            
            'Value Engineering with BIM': 'الهندسة القيمية مع نمذجة معلومات البناء',
            'Delivering innovative, sustainable, and cost-effective solutions using advanced BIM technology.': 'تقديم حلول مبتكرة ومستدامة وفعالة من حيث التكلفة باستخدام تكنولوجيا نمذجة معلومات البناء المتقدمة.',
            
            // Sedrah specific project names and descriptions
            'Shahini Cold Stores Project': 'مشروع مخازن شاهيني الباردة',
            'NUPCO Logistics Warehouse Project': 'مشروع مستودع لوجستيات نوبكو',
            'Al-Rabea Warehouse Project': 'مشروع مستودع الرابعة',
            'Almarai Bakery Project': 'مشروع مخبز المراعي',
            
            // Additional Sedrah specific words
            'At': 'في',
            'Sedrah': 'سدرة',
            'International': 'الدولية',
            'we': 'نحن',
            'strive': 'نسعى',
            'redefine': 'إعادة تعريف',
            'industrial': 'الصناعي',
            'construction': 'البناء',
            'by': 'من خلال',
            'integrating': 'دمج',
            'cutting-edge': 'المتطورة',
            'technology': 'التكنولوجيا',
            'sustainable': 'المستدامة',
            'practices': 'الممارسات',
            'exceptional': 'الاستثنائية',
            'craftsmanship': 'الحرفية',
            'goal': 'هدفنا',
            'is': 'هو',
            'be': 'أن نكون',
            'preferred': 'المفضل',
            'partner': 'الشريك',
            'businesses': 'الشركات',
            'seeking': 'التي تسعى',
            'reliable': 'موثوقة',
            'cost-effective': 'فعالة من حيث التكلفة',
            'innovative': 'مبتكرة',
            'solutions': 'الحلول',
            'Designing': 'تصميم',
            'constructing': 'وبناء',
            'modern': 'حديثة',
            'scalable': 'قابلة للتوسع',
            'manufacturing': 'التصنيعية',
            'facilities': 'المنشآت',
            'that': 'التي',
            'support': 'تدعم',
            'efficient': 'الفعال',
            'production': 'الإنتاج',
            'Building': 'بناء',
            'robust': 'قوية',
            'technologically': 'تكنولوجياً',
            'advanced': 'متطورة',
            'warehouses': 'مستودعات',
            'optimize': 'تحسين',
            'storage': 'التخزين',
            'logistics': 'اللوجستيات',
            'Constructing': 'بناء',
            'temperature-controlled': 'خاضعة لدرجة الحرارة',
            'cold': 'الباردة',
            'storage': 'التخزين',
            'facilities': 'المنشآت',
            'safe': 'الآمن',
            'preservation': 'الحفاظ',
            'perishable': 'القابلة للتلف',
            'goods': 'السلع',
            'Delivering': 'تقديم',
            'innovative': 'مبتكرة',
            'sustainable': 'مستدامة',
            'cost-effective': 'فعالة من حيث التكلفة',
            'solutions': 'حلول',
            'using': 'باستخدام',
            'advanced': 'المتقدمة',
            'BIM': 'نمذجة معلومات البناء',
            'technology': 'التكنولوجيا',
            'Value': 'القيمية',
            'Engineering': 'الهندسة',
            'with': 'مع',
            'Project': 'المشروع',
            'Management': 'إدارة',
            'Shahini': 'شاهيني',
            'Cold': 'الباردة',
            'Stores': 'المخازن',
            'NUPCO': 'نوبكو',
            'Logistics': 'لوجستيات',
            'Warehouse': 'مستودع',
            'Al-Rabea': 'الرابعة',
            'Almarai': 'المراعي',
            'Bakery': 'مخبز',
            'Industrial': 'الصناعية',
            'Factories': 'المصانع',
            'Warehouses': 'المستودعات',
            'Cold': 'المخازن',
            'Stores': 'الباردة',
            
            // Nafel Tech page translations
            'Nafel Tech': 'نافل للتكنولوجيا',
            'Nafel Tech specializes in installing and commissioning production lines in factories. The company provides complete solutions, from installation and integration to testing and maintenance. With strong expertise in automation and optimization, Nafel Tech helps manufacturers enhance production efficiency, minimize downtime, and achieve reliable, high-quality operations.': 'تتخصص نافل للتكنولوجيا في تركيب وتشغيل خطوط الإنتاج في المصانع. توفر الشركة حلولاً شاملة، من التركيب والتكامل إلى الاختبار والصيانة. مع خبرة قوية في الأتمتة والتحسين، تساعد نافل للتكنولوجيا المصنعين على تعزيز كفاءة الإنتاج وتقليل وقت التوقف وتحقيق عمليات موثوقة وعالية الجودة.',
            
            'Field Technical Services': 'خدمات فنية ميدانية',
            'On-site technical support and maintenance services with expertise in automation, robotics, SCADA, and digitalization across various industries.': 'خدمات دعم فني وصيانة على الموقع مع خبرة في الأتمتة والروبوتات ونظام التحكم والإشراف والحصول على البيانات والرقمنة عبر مختلف الصناعات.',
            
            'OEM Services': 'خدمات الشركات المصنعة الأصلية',
            'Installation, commissioning, and diagnostic services for multiple OEMs across the Middle East region with widespread presence and accessibility.': 'خدمات التركيب والتشغيل والتشخيص لعدة شركات مصنعة أصلية عبر منطقة الشرق الأوسط مع وجود واسع وإمكانية الوصول.',
            
            'Production Line Performance Audits': 'مراجعات أداء خط الإنتاج',
            'Comprehensive reliability services including efficiency measurements, waste analysis, loss elimination, and digitalization-focused audits to optimize asset usage.': 'خدمات موثوقية شاملة تشمل قياسات الكفاءة وتحليل النفايات وإزالة الخسائر ومراجعات تركز على الرقمنة لتحسين استخدام الأصول.',
            
            'Installation and Commissioning Services': 'خدمات التركيب والتشغيل',
            'Mechanical and electrical installation for production lines and machinery with expertise in Cobots and Automated Production Systems for optimal efficiency.': 'تركيب ميكانيكي وكهربائي لخطوط الإنتاج والآلات مع خبرة في الروبوتات التعاونية وأنظمة الإنتاج الآلي للكفاءة المثلى.',
            
            'Site Management and Supervision': 'إدارة الموقع والإشراف',
            'Expert supervision services ensuring smooth project installations through coordinated workflows and comprehensive management of all involved parties.': 'خدمات إشراف خبيرة تضمن تركيب المشاريع بسلاسة من خلال سير عمل منسق وإدارة شاملة لجميع الأطراف المعنية.',
            
            'Production Line Audits': 'مراجعات خط الإنتاج',
            'Comprehensive reliability services including efficiency measurements, waste analysis, and digitalization audits.': 'خدمات موثوقية شاملة تشمل قياسات الكفاءة وتحليل النفايات ومراجعات الرقمنة.',
            
            'Installation & Commissioning': 'التركيب والتشغيل',
            'Mechanical and electrical installation for production lines with expertise in Cobots and automation systems.': 'تركيب ميكانيكي وكهربائي لخطوط الإنتاج مع خبرة في الروبوتات التعاونية وأنظمة الأتمتة.',
            
            'Site Management': 'إدارة الموقع',
            'Expert supervision services ensuring smooth project installations and coordinated workflows.': 'خدمات إشراف خبيرة تضمن تركيب المشاريع بسلاسة وسير عمل منسق.',
            
            // Fuselab Creative page translations
            'Fuselab Creative SA': 'فيوزلاب الإبداعية السعودية',
            'Fuselab is a design agency of UX/UI designers who craft transformational strategies and visually compelling digital products that enhance brand and user experiences. They specialize in solving interface challenges through modern UX design, a service highly valued in today\'s fast-changing digital market. With a strong focus on AI and machine learning, the team experiments daily with new models to create personalized, innovative solutions across industries.': 'فيوزلاب هي وكالة تصميم من مصممي تجربة المستخدم وواجهة المستخدم الذين يصنعون استراتيجيات تحويلية ومنتجات رقمية مقنعة بصرياً تعزز تجارب العلامة التجارية والمستخدم. يتخصصون في حل تحديات الواجهة من خلال تصميم تجربة المستخدم الحديث، وهي خدمة عالية القيمة في السوق الرقمي سريع التغير اليوم. مع تركيز قوي على الذكاء الاصطناعي والتعلم الآلي، يجرب الفريق يومياً نماذج جديدة لإنشاء حلول شخصية ومبتكرة عبر الصناعات.',
            
            'Real Estate Solutions': 'حلول العقارات',
            'The landscape of UX design for commercial and residential real estate apps has evolved significantly in recent years. Without incorporating GIS mapping tools, smooth animations and transitions, and real-time data visualizations, your application risks falling behind the competition.': 'تطورت مناظر تصميم تجربة المستخدم لتطبيقات العقارات التجارية والسكنية بشكل كبير في السنوات الأخيرة. بدون دمج أدوات رسم الخرائط الجغرافية والرسوم المتحركة السلسة والانتقالات وتصورات البيانات في الوقت الفعلي، تخاطر تطبيقك بالتخلف عن المنافسة.',
            
            'Fintech Applications': 'تطبيقات التكنولوجيا المالية',
            'The Fuselab Fintech Project centers on creating cutting-edge digital solutions aimed at improving and simplifying financial services through technology. A key factor in the effectiveness of these tools is a user-friendly and accessible UI/UX design. The fintech space covers a wide range of services, from mobile banking and digital payments to robo-advisors, peer-to-peer lending, and blockchain innovations.': 'يركز مشروع فيوزلاب للتكنولوجيا المالية على إنشاء حلول رقمية متطورة تهدف إلى تحسين وتبسيط الخدمات المالية من خلال التكنولوجيا. عامل رئيسي في فعالية هذه الأدوات هو تصميم واجهة المستخدم وتجربة المستخدم سهلة الاستخدام ومتاحة. تغطي مساحة التكنولوجيا المالية مجموعة واسعة من الخدمات، من الخدمات المصرفية المحمولة والمدفوعات الرقمية إلى المستشارين الآليين والإقراض من نظير إلى نظير وابتكارات البلوك تشين.',
            
            'Logistics Management': 'إدارة اللوجستيات',
            'Logistics app development focuses on maintaining traffic flow, optimizing fuel efficiency, and delivering essential delay updates to support smarter transportation decisions.': 'تطوير تطبيقات اللوجستيات يركز على الحفاظ على تدفق المرور وتحسين كفاءة الوقود وتقديم تحديثات التأخير الأساسية لدعم قرارات النقل الأذكى.',
            
            'Future Aircraft Bluebook': 'كتاب الطائرات المستقبلي',
            'Aircraft Bluebook is the leading source for valuation data on general aviation aircraft. Published every quarter, it features pricing and identification details for over 3,000 model years across a wide range of business and general aviation aircraft.': 'كتاب الطائرات هو المصدر الرائد لبيانات التقييم على طائرات الطيران العام. يُنشر كل ربع سنة، ويضم تفاصيل التسعير والتعريف لأكثر من 3000 سنة نموذج عبر مجموعة واسعة من طائرات الطيران التجاري والعام.',
            
            'Robodog Solutions': 'حلول روبودوغ',
            'Robodog AGV Robots represent a major advancement in warehouse automation. Equipped with real-time data, user-friendly controls, and advanced analytics, Robodog enhances workflow efficiency, minimizes downtime, and significantly boosts overall productivity.': 'روبوتات روبودوغ ذاتية الحركة تمثل تقدماً كبيراً في أتمتة المستودعات. مجهزة ببيانات في الوقت الفعلي وضوابط سهلة الاستخدام وتحليلات متقدمة، تعزز روبودوغ كفاءة سير العمل وتقلل وقت التوقف وتعزز الإنتاجية الإجمالية بشكل كبير.',
            
            'Grid AI Solutions': 'حلول شبكة الذكاء الاصطناعي',
            'Fuselab\'s high-contrast interface is poised to redefine standards in the online NFT marketplace. It features color-coded elements and real-time calculations, giving buyers instant access to all key details about their transactions.': 'واجهة فيوزلاب عالية التباين مستعدة لإعادة تعريف المعايير في سوق الرموز غير القابلة للاستبدال عبر الإنترنت. تتميز بعناصر مرمزة بالألوان وحسابات في الوقت الفعلي، مما يعطي المشترين وصولاً فورياً إلى جميع التفاصيل الرئيسية حول معاملاتهم.',
            
            'AI & Machine Learning': 'الذكاء الاصطناعي والتعلم الآلي',
            'Advanced AI and machine learning solutions for intelligent automation, data analysis, and predictive modeling across various industries.': 'حلول ذكاء اصطناعي وتعلم آلي متقدمة للأتمتة الذكية وتحليل البيانات والنمذجة التنبؤية عبر مختلف الصناعات.',
            
            'Transportation & Logistics': 'النقل واللوجستيات',
            'Comprehensive transportation and logistics solutions including fleet management, supply chain optimization, and real-time tracking systems.': 'حلول شاملة للنقل واللوجستيات تشمل إدارة الأسطول وتحسين سلسلة التوريد وأنظمة التتبع في الوقت الفعلي.',
            
            'Biotech, Manufacturing & Warehousing': 'التكنولوجيا الحيوية والتصنيع والتخزين',
            'Specialized solutions for biotechnology, manufacturing processes, and warehouse management systems with advanced automation and control technologies.': 'حلول متخصصة للتكنولوجيا الحيوية وعمليات التصنيع وأنظمة إدارة المستودعات مع تكنولوجيات أتمتة وتحكم متقدمة.',
            
            'UI/UX Design': 'تصميم واجهة المستخدم وتجربة المستخدم',
            'User interface and user experience design for digital products and applications, creating intuitive and engaging user experiences.': 'تصميم واجهة المستخدم وتجربة المستخدم للمنتجات والتطبيقات الرقمية، وإنشاء تجارب مستخدم بديهية وجذابة.',
            
            'Health Medical Automations': 'أتمتة الرعاية الصحية الطبية',
            'Specialized automation solutions for healthcare systems, streamlining medical processes and improving patient care through intelligent design interfaces.': 'حلول أتمتة متخصصة لأنظمة الرعاية الصحية، وتبسيط العمليات الطبية وتحسين رعاية المرضى من خلال واجهات التصميم الذكية.',
            
            'Smart City Mapping': 'رسم خرائط المدينة الذكية',
            'Advanced mapping and visualization solutions for smart city initiatives, helping urban planners and administrators make data-driven decisions through intuitive interfaces.': 'حلول رسم خرائط وتصور متقدمة لمبادرات المدينة الذكية، مساعدة مخططي المدن والإداريين على اتخاذ قرارات مدفوعة بالبيانات من خلال واجهات بديهية.',
            
            'Visit fuselabcreative.com for more': 'زر fuselabcreative.com للمزيد',
            
            // Bee Automations page translations
            'Bee Automations': 'بي للأتمتة',
            'Bee Automation is a Saudi-founded company building homegrown automation and robotics systems like Polli-X, designed to solve real production-floor problems with precision, reliability, and simple intelligent design.': 'بي للأتمتة هي شركة سعودية المنشأ تبني أنظمة أتمتة وروبوتات محلية مثل بولي-إكس، مصممة لحل مشاكل أرضية الإنتاج الحقيقية بدقة وموثوقية وتصميم ذكي بسيط.',
            
            'Polli-X': 'بولي-إكس',
            'Polli-X is a high-precision industrial filler for powders and granules, built for efficiency and reliability in manufacturing.': 'بولي-إكس هو حشو صناعي عالي الدقة للمساحيق والحبيبات، مبني للكفاءة والموثوقية في التصنيع.',
            
            'Pilot Testing Programs': 'برامج الاختبار التجريبي',
            'Offer pilot runs so producers can validate automation performance before large-scale deployment.': 'نقدم جولات تجريبية حتى يتمكن المنتجون من التحقق من أداء الأتمتة قبل النشر على نطاق واسع.',
            
            'Automation Consulting': 'استشارات الأتمتة',
            'Expert insights, resources, and guidance to help businesses adopt automation effectively.': 'رؤى خبيرة وموارد وإرشادات لمساعدة الشركات على تبني الأتمتة بفعالية.',
            
            'Visit beeautomations.com for more': 'زر beeautomations.com للمزيد',
            
            // Additional technology and automation specific words
            'specializes': 'تتخصص',
            'installing': 'تركيب',
            'commissioning': 'تشغيل',
            'production': 'الإنتاج',
            'lines': 'الخطوط',
            'factories': 'المصانع',
            'company': 'الشركة',
            'provides': 'توفر',
            'complete': 'شاملة',
            'solutions': 'الحلول',
            'installation': 'التركيب',
            'integration': 'التكامل',
            'testing': 'الاختبار',
            'maintenance': 'الصيانة',
            'strong': 'قوية',
            'expertise': 'الخبرة',
            'automation': 'الأتمتة',
            'optimization': 'التحسين',
            'helps': 'تساعد',
            'manufacturers': 'المصنعين',
            'enhance': 'تعزيز',
            'efficiency': 'الكفاءة',
            'minimize': 'تقليل',
            'downtime': 'وقت التوقف',
            'achieve': 'تحقيق',
            'reliable': 'موثوقة',
            'high-quality': 'عالية الجودة',
            'operations': 'العمليات',
            'Field': 'الميدانية',
            'Technical': 'الفنية',
            'Services': 'الخدمات',
            'On-site': 'على الموقع',
            'support': 'الدعم',
            'robotics': 'الروبوتات',
            'SCADA': 'نظام التحكم والإشراف والحصول على البيانات',
            'digitalization': 'الرقمنة',
            'various': 'مختلفة',
            'industries': 'الصناعات',
            'multiple': 'عدة',
            'OEMs': 'شركات مصنعة أصلية',
            'Middle': 'الشرق',
            'East': 'الأوسط',
            'region': 'المنطقة',
            'widespread': 'واسع',
            'presence': 'الوجود',
            'accessibility': 'إمكانية الوصول',
            'Performance': 'الأداء',
            'Audits': 'المراجعات',
            'Comprehensive': 'شاملة',
            'reliability': 'الموثوقية',
            'including': 'تشمل',
            'measurements': 'القياسات',
            'waste': 'النفايات',
            'analysis': 'التحليل',
            'loss': 'الخسائر',
            'elimination': 'الإزالة',
            'digitalization-focused': 'تركز على الرقمنة',
            'audits': 'المراجعات',
            'optimize': 'تحسين',
            'asset': 'الأصول',
            'usage': 'الاستخدام',
            'Installation': 'التركيب',
            'Commissioning': 'التشغيل',
            'Mechanical': 'الميكانيكي',
            'electrical': 'الكهربائي',
            'machinery': 'الآلات',
            'Cobots': 'الروبوتات التعاونية',
            'Automated': 'الآلي',
            'Systems': 'الأنظمة',
            'optimal': 'المثلى',
            'Site': 'الموقع',
            'Management': 'الإدارة',
            'Supervision': 'الإشراف',
            'Expert': 'خبيرة',
            'supervision': 'الإشراف',
            'ensuring': 'تضمن',
            'smooth': 'بسلاسة',
            'project': 'المشاريع',
            'installations': 'التركيب',
            'through': 'من خلال',
            'coordinated': 'منسق',
            'workflows': 'سير العمل',
            'comprehensive': 'شاملة',
            'management': 'الإدارة',
            'involved': 'المعنية',
            'parties': 'الأطراف',
            'design': 'التصميم',
            'agency': 'الوكالة',
            'UX/UI': 'تجربة المستخدم وواجهة المستخدم',
            'designers': 'المصممين',
            'craft': 'يصنعون',
            'transformational': 'تحويلية',
            'strategies': 'الاستراتيجيات',
            'visually': 'بصرياً',
            'compelling': 'مقنعة',
            'digital': 'الرقمية',
            'products': 'المنتجات',
            'enhance': 'تعزز',
            'brand': 'العلامة التجارية',
            'user': 'المستخدم',
            'experiences': 'التجارب',
            'specialize': 'يتخصصون',
            'solving': 'حل',
            'interface': 'الواجهة',
            'challenges': 'التحديات',
            'modern': 'الحديث',
            'UX': 'تجربة المستخدم',
            'service': 'الخدمة',
            'highly': 'عالية',
            'valued': 'القيمة',
            'today\'s': 'اليوم',
            'fast-changing': 'سريع التغير',
            'market': 'السوق',
            'focus': 'التركيز',
            'AI': 'الذكاء الاصطناعي',
            'machine': 'الآلي',
            'learning': 'التعلم',
            'team': 'الفريق',
            'experiments': 'يجرب',
            'daily': 'يومياً',
            'new': 'جديدة',
            'models': 'النماذج',
            'create': 'إنشاء',
            'personalized': 'شخصية',
            'innovative': 'مبتكرة',
            'across': 'عبر',
            'landscape': 'المناظر',
            'commercial': 'التجارية',
            'residential': 'السكنية',
            'real': 'العقارات',
            'estate': 'العقارات',
            'apps': 'التطبيقات',
            'evolved': 'تطورت',
            'significantly': 'بشكل كبير',
            'recent': 'الأخيرة',
            'years': 'السنوات',
            'Without': 'بدون',
            'incorporating': 'دمج',
            'GIS': 'الجغرافية',
            'mapping': 'رسم الخرائط',
            'tools': 'الأدوات',
            'smooth': 'السلسة',
            'animations': 'الرسوم المتحركة',
            'transitions': 'الانتقالات',
            'real-time': 'في الوقت الفعلي',
            'data': 'البيانات',
            'visualizations': 'التصورات',
            'application': 'تطبيقك',
            'risks': 'تخاطر',
            'falling': 'التخلف',
            'behind': 'عن',
            'competition': 'المنافسة',
            'centers': 'يركز',
            'creating': 'إنشاء',
            'cutting-edge': 'متطورة',
            'aimed': 'تهدف',
            'improving': 'تحسين',
            'simplifying': 'تبسيط',
            'financial': 'المالية',
            'technology': 'التكنولوجيا',
            'key': 'رئيسي',
            'factor': 'عامل',
            'effectiveness': 'فعالية',
            'these': 'هذه',
            'user-friendly': 'سهلة الاستخدام',
            'accessible': 'متاحة',
            'UI/UX': 'واجهة المستخدم وتجربة المستخدم',
            'space': 'المساحة',
            'covers': 'تغطي',
            'wide': 'واسعة',
            'range': 'مجموعة',
            'mobile': 'المحمولة',
            'banking': 'المصرفية',
            'payments': 'المدفوعات',
            'robo-advisors': 'المستشارين الآليين',
            'peer-to-peer': 'من نظير إلى نظير',
            'lending': 'الإقراض',
            'blockchain': 'البلوك تشين',
            'innovations': 'الابتكارات',
            'Logistics': 'اللوجستيات',
            'app': 'التطبيقات',
            'development': 'التطوير',
            'focuses': 'يركز',
            'maintaining': 'الحفاظ على',
            'traffic': 'المرور',
            'flow': 'التدفق',
            'optimizing': 'تحسين',
            'fuel': 'الوقود',
            'delivering': 'تقديم',
            'essential': 'الأساسية',
            'delay': 'التأخير',
            'updates': 'التحديثات',
            'support': 'دعم',
            'smarter': 'الأذكى',
            'transportation': 'النقل',
            'decisions': 'القرارات',
            'Future': 'المستقبلي',
            'Aircraft': 'الطائرات',
            'Bluebook': 'الكتاب',
            'leading': 'الرائد',
            'source': 'المصدر',
            'valuation': 'التقييم',
            'general': 'العام',
            'aviation': 'الطيران',
            'Published': 'يُنشر',
            'every': 'كل',
            'quarter': 'ربع سنة',
            'features': 'يضم',
            'pricing': 'التسعير',
            'identification': 'التعريف',
            'details': 'التفاصيل',
            'over': 'أكثر من',
            'model': 'النموذج',
            'business': 'التجاري',
            'Robodog': 'روبودوغ',
            'AGV': 'ذاتية الحركة',
            'Robots': 'الروبوتات',
            'represent': 'تمثل',
            'major': 'كبيراً',
            'advancement': 'تقدماً',
            'warehouse': 'المستودعات',
            'Equipped': 'مجهزة',
            'controls': 'الضوابط',
            'advanced': 'متقدمة',
            'analytics': 'التحليلات',
            'enhances': 'تعزز',
            'workflow': 'سير العمل',
            'minimizes': 'تقلل',
            'significantly': 'بشكل كبير',
            'boosts': 'تعزز',
            'overall': 'الإجمالية',
            'productivity': 'الإنتاجية',
            'Grid': 'الشبكة',
            'AI': 'الذكاء الاصطناعي',
            'Solutions': 'الحلول',
            'high-contrast': 'عالية التباين',
            'interface': 'الواجهة',
            'poised': 'مستعدة',
            'redefine': 'إعادة تعريف',
            'standards': 'المعايير',
            'online': 'عبر الإنترنت',
            'NFT': 'الرموز غير القابلة للاستبدال',
            'marketplace': 'السوق',
            'color-coded': 'مرمزة بالألوان',
            'elements': 'العناصر',
            'calculations': 'الحسابات',
            'giving': 'مما يعطي',
            'buyers': 'المشترين',
            'instant': 'فورياً',
            'access': 'الوصول',
            'key': 'الرئيسية',
            'about': 'حول',
            'their': 'معاملاتهم',
            'transactions': 'المعاملات',
            'Machine': 'الآلي',
            'Learning': 'التعلم',
            'intelligent': 'الذكية',
            'analysis': 'التحليل',
            'predictive': 'التنبؤية',
            'modeling': 'النمذجة',
            'Transportation': 'النقل',
            'fleet': 'الأسطول',
            'supply': 'التوريد',
            'chain': 'السلسلة',
            'tracking': 'التتبع',
            'Biotech': 'التكنولوجيا الحيوية',
            'Manufacturing': 'التصنيع',
            'Warehousing': 'التخزين',
            'Specialized': 'متخصصة',
            'biotechnology': 'التكنولوجيا الحيوية',
            'processes': 'العمليات',
            'warehouse': 'المستودعات',
            'control': 'التحكم',
            'technologies': 'التكنولوجيات',
            'User': 'المستخدم',
            'interface': 'الواجهة',
            'experience': 'التجربة',
            'applications': 'التطبيقات',
            'intuitive': 'بديهية',
            'engaging': 'جذابة',
            'Health': 'الصحية',
            'Medical': 'الطبية',
            'Automations': 'الأتمتة',
            'healthcare': 'الرعاية الصحية',
            'streamlining': 'تبسيط',
            'medical': 'الطبية',
            'improving': 'تحسين',
            'patient': 'المرضى',
            'care': 'الرعاية',
            'intelligent': 'الذكية',
            'Smart': 'الذكية',
            'City': 'المدينة',
            'Mapping': 'رسم الخرائط',
            'mapping': 'رسم الخرائط',
            'visualization': 'التصور',
            'initiatives': 'المبادرات',
            'helping': 'مساعدة',
            'urban': 'المدن',
            'planners': 'المخططين',
            'administrators': 'الإداريين',
            'make': 'اتخاذ',
            'data-driven': 'مدفوعة بالبيانات',
            'intuitive': 'بديهية',
            'interfaces': 'الواجهات',
            'Visit': 'زر',
            'fuselabcreative.com': 'fuselabcreative.com',
            'for': 'لـ',
            'more': 'المزيد',
            'Bee': 'بي',
            'Automation': 'للأتمتة',
            'Saudi-founded': 'سعودية المنشأ',
            'building': 'تبني',
            'homegrown': 'محلية',
            'robotics': 'الروبوتات',
            'systems': 'الأنظمة',
            'like': 'مثل',
            'Polli-X': 'بولي-إكس',
            'designed': 'مصممة',
            'solve': 'حل',
            'real': 'الحقيقية',
            'production-floor': 'أرضية الإنتاج',
            'problems': 'المشاكل',
            'precision': 'دقة',
            'reliability': 'موثوقية',
            'simple': 'بسيط',
            'intelligent': 'ذكي',
            'high-precision': 'عالي الدقة',
            'industrial': 'الصناعي',
            'filler': 'الحشو',
            'powders': 'المساحيق',
            'granules': 'الحبيبات',
            'built': 'مبني',
            'efficiency': 'الكفاءة',
            'manufacturing': 'التصنيع',
            'Pilot': 'التجريبي',
            'Testing': 'الاختبار',
            'Programs': 'البرامج',
            'Offer': 'نقدم',
            'pilot': 'تجريبية',
            'runs': 'جولات',
            'producers': 'المنتجين',
            'validate': 'التحقق من',
            'performance': 'الأداء',
            'before': 'قبل',
            'large-scale': 'على نطاق واسع',
            'deployment': 'النشر',
            'Consulting': 'الاستشارات',
            'insights': 'الرؤى',
            'resources': 'الموارد',
            'guidance': 'الإرشادات',
            'help': 'مساعدة',
            'businesses': 'الشركات',
            'adopt': 'تبني',
            'effectively': 'بفعالية',
            'beeautomations.com': 'beeautomations.com',
            
            // Team page translations
            'Our Team': 'فريقنا',
            'Meet The Team': 'تعرف على الفريق',
            'The Nafel team consists of highly skilled professionals, engineers, designers, and industry experts who are passionate about delivering excellence in every project. Together, we work as a unified force to deliver outstanding results for our clients.': 'يتكون فريق نافل من محترفين ومهندسين ومصممين وخبراء صناعيين ذوي مهارات عالية والذين لديهم شغف بتقديم التميز في كل مشروع. معاً، نعمل كقوة موحدة لتقديم نتائج متميزة لعملائنا.',
            
            'Sheikh Ibrahim Falqi': 'الشيخ إبراهيم الفلقي',
            'Businessman & Chairman': 'رجل أعمال ورئيس',
            'Sheikh Ibrahim Mohammed Falqi is a distinguished businessman, founder, and chairman of multiple industrial companies and factories. He is actively involved in charitable and cooperative associations, demonstrating strong commitment to community development and supporting young entrepreneurs.': 'الشيخ إبراهيم محمد الفلقي رجل أعمال متميز ومؤسس ورئيس لعدة شركات ومصانع صناعية. وهو مشارك بنشاط في الجمعيات الخيرية والتعاونية، مما يظهر التزاماً قوياً بتطوير المجتمع ودعم رواد الأعمال الشباب.',
            
            'Key Leadership Positions:': 'المناصب القيادية الرئيسية:',
            'Chairman, Fal Al-Janoub Industrial Company': 'رئيس، شركة فال الجنوب الصناعية',
            'Chairman, Fal Contracting Company': 'رئيس، شركة فال للمقاولات',
            'Chairman, Rafal Concrete Products Company': 'رئيس، شركة رافال لمنتجات الخرسانة',
            'Chairman, Al-Memaar Building Materials Company': 'رئيس، شركة المعمار لمواد البناء',
            'Vice Chairman, Sanabel Al-Namaa Trading Co. Ltd.': 'نائب رئيس، شركة سنابل النماء التجارية المحدودة',
            
            'Hisham Mahdi': 'هشام مهدي',
            'Co-founder and Managing Director': 'الشريك المؤسس والمدير التنفيذي',
            'Hisham started his career in oil fields as Wireline Instrument Field Engineer in China and Oman (2010-2012), then transitioned to construction engineering in Saudi Arabia building factories and warehouses in King Abdullah Economic City.': 'بدأ هشام مسيرته المهنية في حقول النفط كمهندس ميداني لأدوات خط الأسلاك في الصين وعمان (2010-2012)، ثم انتقل إلى الهندسة الإنشائية في المملكة العربية السعودية لبناء المصانع والمستودعات في مدينة الملك عبدالله الاقتصادية.',
            
            'He managed an international construction company\'s branch in UAE & Saudi Arabia before co-founding Nafel as an electromechanical company.': 'أدار فرع شركة إنشاءات دولية في الإمارات العربية المتحدة والمملكة العربية السعودية قبل المشاركة في تأسيس نافل كشركة كهربائية وميكانيكية.',
            
            'Education:': 'التعليم:',
            'Bachelors of Electrical Engineering - Queensland University of Technology (2010)': 'بكالوريوس الهندسة الكهربائية - جامعة كوينزلاند للتكنولوجيا (2010)',
            'MBA - Prince Mohamad Bin Salman College of Business and Entrepreneurship (2020)': 'ماجستير إدارة الأعمال - كلية الأمير محمد بن سلمان للأعمال وريادة الأعمال (2020)',
            
            'Mohammed Al Shafei': 'محمد الشافعي',
            'Operations Manager': 'مدير العمليات',
            'Mohamad El Shafey is a seasoned civil engineer with over 20 years of experience specializing in the design, management, and execution of industrial building construction projects. Throughout his career, he has successfully led large-scale projects from planning to completion, ensuring compliance with international standards, safety regulations, and cost-effectiveness.': 'محمد الشافعي مهندس مدني مخضرم مع أكثر من 20 عاماً من الخبرة متخصص في تصميم وإدارة وتنفيذ مشاريع بناء المباني الصناعية. طوال مسيرته المهنية، قاد بنجاح مشاريع واسعة النطاق من التخطيط إلى الإنجاز، مع ضمان الامتثال للمعايير الدولية ولوائح السلامة والفعالية من حيث التكلفة.',
            
            'Key Projects:': 'المشاريع الرئيسية:',
            'Nupco Pharmaceutical Warehouses': 'مستودعات نوبكو الصيدلانية',
            'Marai Factory in Kharj': 'مصنع المراعي في الخرج',
            'SATS Cargo Facility, Riyadh Airport': 'منشأة شحن ساتس، مطار الرياض',
            'Amazon Warehouse, Riyadh': 'مستودع أمازون، الرياض',
            
            'Walid Ghanim': 'وليد غانم',
            'Engineering Manager': 'مدير الهندسة',
            'Over 28 years of experience in designing and delivering manufacturing and logistics facilities. Works closely with clients to translate operational requirements into efficient building designs.': 'أكثر من 28 عاماً من الخبرة في تصميم وتقديم منشآت التصنيع واللوجستيات. يعمل بشكل وثيق مع العملاء لترجمة المتطلبات التشغيلية إلى تصاميم بناء فعالة.',
            
            'Pfizer Pharmaceuticals Plant, KAEC': 'مصنع فايزر للأدوية، مدينة الملك عبدالله الاقتصادية',
            'Volvo Truck Assembly Plant, KAEC': 'مصنع تجميع شاحنات فولفو، مدينة الملك عبدالله الاقتصادية',
            'Mars Chocolate Factory, KAEC': 'مصنع مارس للشوكولاتة، مدينة الملك عبدالله الاقتصادية',
            'Marai Bakery, Al Kharj': 'مخبز المراعي، الخرج',
            'Marai Poultry Plant, Hail': 'مصنع المراعي للدواجن، حائل',
            
            'Supports project managers and construction teams by solving technical on-site challenges and coordinating across multiple engineering disciplines. Recognized for his deep industry knowledge and collaborative leadership.': 'يدعم مديري المشاريع وفرق البناء من خلال حل التحديات التقنية على الموقع والتنسيق عبر تخصصات هندسية متعددة. معترف بمعرفته العميقة بالصناعة وقيادته التعاونية.',
            
            'Ahmad Shafik': 'أحمد شفيق',
            'MEP Manager': 'مدير الميكانيكية والكهربائية والسباكة',
            'With 25 years of extensive experience, Ahmad Shafik is a seasoned Senior Electromechanical Engineer specializing in industrial and commercial building projects across manufacturing, pharmaceuticals, automotive, food & beverage, and logistics sectors.': 'مع 25 عاماً من الخبرة الواسعة، أحمد شفيق مهندس كهربائي وميكانيكي أول مخضرم متخصص في مشاريع المباني الصناعية والتجارية عبر قطاعات التصنيع والأدوية والسيارات والأغذية والمشروبات واللوجستيات.',
            
            'Samsung Naffora Project – Al Jubail City': 'مشروع سامسونج نفورة – مدينة الجبيل',
            'Toyota PDC Warehouse': 'مستودع تويوتا بي دي سي',
            'Pfizer Pharmaceuticals': 'فايزر للأدوية',
            'APEX Pharma Project': 'مشروع أبيكس فارما',
            'Al Rabie Juice Factory': 'مصنع العصير العربي',
            
            'Ahmad is a results-driven engineer with proven expertise in integrated MEP design and site project management. He has led multidisciplinary teams and delivered projects for global corporations, ensuring sustainable and efficient facility operations.': 'أحمد مهندس مدفوع بالنتائج مع خبرة مثبتة في تصميم الميكانيكية والكهربائية والسباكة المتكامل وإدارة مشاريع الموقع. قاد فرق متعددة التخصصات وقدم مشاريع للشركات العالمية، مع ضمان عمليات المنشآت المستدامة والفعالة.',
            
            'Hassan Al Edrisi': 'حسن الأدرسي',
            'Bee Automations Leader': 'قائد بي للأتمتة',
            'Hassan Al Edrisi leads Bee Automations, bringing expertise in automation solutions and innovative technology implementations. With a focus on advanced automation systems, Hassan drives the company\'s mission to deliver advanced technological solutions that enhance operational efficiency and productivity.': 'حسن الأدرسي يقود بي للأتمتة، ويجلب خبرة في حلول الأتمتة وتنفيذات التكنولوجيا المبتكرة. مع التركيز على أنظمة الأتمتة المتقدمة، يدفع حسن مهمة الشركة لتقديم حلول تكنولوجية متقدمة تعزز الكفاءة التشغيلية والإنتاجية.',
            
            'Key Focus Areas:': 'مجالات التركيز الرئيسية:',
            'Industrial Automation Systems': 'أنظمة الأتمتة الصناعية',
            'Smart Building Solutions': 'حلول المباني الذكية',
            'Process Optimization': 'تحسين العمليات',
            'Technology Integration': 'تكامل التكنولوجيا',
            
            'Hassan is committed to advancing automation technologies and providing clients with state-of-the-art solutions that streamline operations and drive business growth.': 'حسن ملتزم بتطوير تكنولوجيات الأتمتة وتقديم حلول متطورة للعملاء التي تبسط العمليات وتدفع نمو الأعمال.',
            
            'Our Values': 'قيمنا',
            'Integrity': 'النزاهة',
            'We conduct business with honesty, transparency, and ethical practices in all our interactions.': 'نقوم بأعمالنا بالصدق والشفافية والممارسات الأخلاقية في جميع تفاعلاتنا.',
            
            'Innovation': 'الابتكار',
            'We embrace new technologies and creative solutions to address complex challenges.': 'نحتضن التقنيات الجديدة والحلول الإبداعية لمعالجة التحديات المعقدة.',
            
            'Collaboration': 'التعاون',
            'We work together as a team, fostering partnerships and building strong relationships.': 'نعمل معاً كفريق واحد، ونعزز الشراكات ونبني علاقات قوية.',
            
            // Additional team page specific words
            'Meet': 'تعرف على',
            'Team': 'الفريق',
            'consists': 'يتكون',
            'highly': 'ذوي مهارات عالية',
            'skilled': 'مهارات عالية',
            'professionals': 'محترفين',
            'engineers': 'مهندسين',
            'designers': 'مصممين',
            'industry': 'صناعيين',
            'experts': 'خبراء',
            'passionate': 'لديهم شغف',
            'delivering': 'تقديم',
            'excellence': 'التميز',
            'every': 'كل',
            'project': 'مشروع',
            'Together': 'معاً',
            'work': 'نعمل',
            'unified': 'موحدة',
            'force': 'قوة',
            'outstanding': 'متميزة',
            'results': 'النتائج',
            'clients': 'عملائنا',
            'Sheikh': 'الشيخ',
            'Ibrahim': 'إبراهيم',
            'Mohammed': 'محمد',
            'Falqi': 'الفلقي',
            'distinguished': 'متميز',
            'businessman': 'رجل أعمال',
            'founder': 'مؤسس',
            'chairman': 'رئيس',
            'multiple': 'عدة',
            'industrial': 'صناعية',
            'companies': 'شركات',
            'factories': 'مصانع',
            'actively': 'بنشاط',
            'involved': 'مشارك',
            'charitable': 'الخيرية',
            'cooperative': 'التعاونية',
            'associations': 'الجمعيات',
            'demonstrating': 'مما يظهر',
            'strong': 'قوياً',
            'commitment': 'التزاماً',
            'community': 'المجتمع',
            'development': 'تطوير',
            'supporting': 'ودعم',
            'young': 'الشباب',
            'entrepreneurs': 'رواد الأعمال',
            'Key': 'الرئيسية',
            'Leadership': 'القيادية',
            'Positions': 'المناصب',
            'Fal': 'فال',
            'Al-Janoub': 'الجنوب',
            'Contracting': 'للمقاولات',
            'Rafal': 'رافال',
            'Concrete': 'الخرسانة',
            'Products': 'المنتجات',
            'Al-Memaar': 'المعمار',
            'Building': 'البناء',
            'Materials': 'المواد',
            'Vice': 'نائب',
            'Sanabel': 'سنابل',
            'Al-Namaa': 'النماء',
            'Trading': 'التجارية',
            'Co': 'شركة',
            'Ltd': 'المحدودة',
            'Mahdi': 'مهدي',
            'Co-founder': 'الشريك المؤسس',
            'Managing': 'التنفيذي',
            'Director': 'المدير',
            'started': 'بدأ',
            'career': 'مسيرته المهنية',
            'oil': 'النفط',
            'fields': 'الحقول',
            'Wireline': 'خط الأسلاك',
            'Instrument': 'الأدوات',
            'Field': 'الميداني',
            'Engineer': 'المهندس',
            'China': 'الصين',
            'Oman': 'عمان',
            'transitioned': 'انتقل',
            'construction': 'الهندسة الإنشائية',
            'engineering': 'الهندسة',
            'Saudi': 'السعودية',
            'Arabia': 'العربية',
            'building': 'بناء',
            'warehouses': 'المستودعات',
            'King': 'الملك',
            'Abdullah': 'عبدالله',
            'Economic': 'الاقتصادية',
            'City': 'المدينة',
            'managed': 'أدار',
            'international': 'دولية',
            'company\'s': 'الشركة',
            'branch': 'فرع',
            'UAE': 'الإمارات العربية المتحدة',
            'before': 'قبل',
            'co-founding': 'المشاركة في تأسيس',
            'electromechanical': 'كهربائية وميكانيكية',
            'Bachelors': 'بكالوريوس',
            'Electrical': 'الكهربائية',
            'Queensland': 'كوينزلاند',
            'University': 'جامعة',
            'Technology': 'للتكنولوجيا',
            'MBA': 'ماجستير إدارة الأعمال',
            'Prince': 'الأمير',
            'Mohamad': 'محمد',
            'Bin': 'بن',
            'Salman': 'سلمان',
            'College': 'كلية',
            'Business': 'الأعمال',
            'Entrepreneurship': 'ريادة الأعمال',
            'Al': 'ال',
            'Shafei': 'الشافعي',
            'Operations': 'العمليات',
            'Manager': 'المدير',
            'El': 'ال',
            'Shafey': 'شافعي',
            'seasoned': 'مخضرم',
            'civil': 'مدني',
            'over': 'أكثر من',
            'years': 'عاماً',
            'experience': 'الخبرة',
            'specializing': 'متخصص',
            'design': 'تصميم',
            'management': 'إدارة',
            'execution': 'تنفيذ',
            'building': 'بناء',
            'projects': 'المشاريع',
            'Throughout': 'طوال',
            'successfully': 'بنجاح',
            'led': 'قاد',
            'large-scale': 'واسعة النطاق',
            'planning': 'التخطيط',
            'completion': 'الإنجاز',
            'ensuring': 'مع ضمان',
            'compliance': 'الامتثال',
            'international': 'الدولية',
            'standards': 'المعايير',
            'safety': 'السلامة',
            'regulations': 'اللوائح',
            'cost-effectiveness': 'الفعالية من حيث التكلفة',
            'Nupco': 'نوبكو',
            'Pharmaceutical': 'الصيدلانية',
            'Warehouses': 'المستودعات',
            'Marai': 'المراعي',
            'Factory': 'المصنع',
            'Kharj': 'الخرج',
            'SATS': 'ساتس',
            'Cargo': 'الشحن',
            'Facility': 'المنشأة',
            'Riyadh': 'الرياض',
            'Airport': 'مطار',
            'Amazon': 'أمازون',
            'Warehouse': 'المستودع',
            'Ghanim': 'غانم',
            'Engineering': 'الهندسة',
            'years': 'عاماً',
            'designing': 'تصميم',
            'delivering': 'تقديم',
            'manufacturing': 'التصنيع',
            'logistics': 'اللوجستيات',
            'facilities': 'المنشآت',
            'Works': 'يعمل',
            'closely': 'بشكل وثيق',
            'clients': 'العملاء',
            'translate': 'ترجمة',
            'operational': 'التشغيلية',
            'requirements': 'المتطلبات',
            'efficient': 'فعالة',
            'designs': 'التصاميم',
            'Pfizer': 'فايزر',
            'Pharmaceuticals': 'للأدوية',
            'Plant': 'المصنع',
            'KAEC': 'مدينة الملك عبدالله الاقتصادية',
            'Volvo': 'فولفو',
            'Truck': 'الشاحنات',
            'Assembly': 'التجميع',
            'Mars': 'مارس',
            'Chocolate': 'للشوكولاتة',
            'Bakery': 'المخبز',
            'Poultry': 'للدواجن',
            'Hail': 'حائل',
            'Supports': 'يدعم',
            'managers': 'مديري',
            'teams': 'الفرق',
            'solving': 'حل',
            'technical': 'التقنية',
            'on-site': 'على الموقع',
            'challenges': 'التحديات',
            'coordinating': 'التنسيق',
            'across': 'عبر',
            'disciplines': 'التخصصات',
            'Recognized': 'معترف',
            'deep': 'العميقة',
            'knowledge': 'المعرفة',
            'collaborative': 'التعاونية',
            'leadership': 'القيادة',
            'Shafik': 'شفيق',
            'MEP': 'الميكانيكية والكهربائية والسباكة',
            'extensive': 'الواسعة',
            'Senior': 'أول',
            'Electromechanical': 'الكهربائي والميكانيكي',
            'commercial': 'التجارية',
            'automotive': 'السيارات',
            'food': 'الأغذية',
            'beverage': 'المشروبات',
            'sectors': 'القطاعات',
            'Samsung': 'سامسونج',
            'Naffora': 'نفورة',
            'Jubail': 'الجبيل',
            'Toyota': 'تويوتا',
            'PDC': 'بي دي سي',
            'APEX': 'أبيكس',
            'Pharma': 'فارما',
            'Rabie': 'العربي',
            'Juice': 'العصير',
            'results-driven': 'مدفوع بالنتائج',
            'proven': 'مثبتة',
            'expertise': 'الخبرة',
            'integrated': 'المتكامل',
            'site': 'الموقع',
            'multidisciplinary': 'متعددة التخصصات',
            'delivered': 'قدم',
            'global': 'العالمية',
            'corporations': 'الشركات',
            'sustainable': 'المستدامة',
            'operations': 'العمليات',
            'Edrisi': 'الأدرسي',
            'Automations': 'للأتمتة',
            'Leader': 'القائد',
            'leads': 'يقود',
            'bringing': 'ويجلب',
            'automation': 'الأتمتة',
            'solutions': 'الحلول',
            'innovative': 'المبتكرة',
            'implementations': 'التنفيذات',
            'focus': 'التركيز',
            'advanced': 'المتقدمة',
            'systems': 'الأنظمة',
            'drives': 'يدفع',
            'mission': 'مهمة',
            'technological': 'التكنولوجية',
            'enhance': 'تعزز',
            'operational': 'التشغيلية',
            'efficiency': 'الكفاءة',
            'productivity': 'الإنتاجية',
            'Focus': 'التركيز',
            'Areas': 'المجالات',
            'Industrial': 'الصناعية',
            'Automation': 'الأتمتة',
            'Smart': 'الذكية',
            'Process': 'العمليات',
            'Optimization': 'التحسين',
            'Integration': 'التكامل',
            'committed': 'ملتزم',
            'advancing': 'تطوير',
            'technologies': 'التكنولوجيات',
            'providing': 'تقديم',
            'state-of-the-art': 'متطورة',
            'streamline': 'تبسط',
            'drive': 'تدفع',
            'growth': 'النمو',
            'Values': 'القيم',
            'conduct': 'نقوم',
            'business': 'أعمالنا',
            'honesty': 'الصدق',
            'transparency': 'الشفافية',
            'ethical': 'الأخلاقية',
            'practices': 'الممارسات',
            'interactions': 'تفاعلاتنا',
            'embrace': 'نحتضن',
            'new': 'الجديدة',
            'creative': 'الإبداعية',
            'address': 'معالجة',
            'complex': 'المعقدة',
            'together': 'معاً',
            'fostering': 'نعزز',
            'partnerships': 'الشراكات',
            'strong': 'قوية',
            'relationships': 'العلاقات'
        };

        // First try exact sentence matches
        let translatedText = text;
        
        // Check for exact sentence matches first
        if (translations[text]) {
            return translations[text];
        }
        
        // Then try word-by-word translation with better context handling
        Object.keys(translations).forEach(english => {
            const arabic = translations[english];
            // Use word boundary regex for more accurate matching
            const regex = new RegExp(`\\b${english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
            translatedText = translatedText.replace(regex, arabic);
        });

        return translatedText;
    }

    restoreOriginalContent() {
        this.originalContent.forEach((originalText, element) => {
            element.textContent = originalText;
        });
    }

    showTranslationError() {
        // Show a subtle error message
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        errorDiv.textContent = 'Translation service temporarily unavailable';
        document.body.appendChild(errorDiv);

        // Remove error message after 3 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 3000);
    }
}

// Initialize AI Translator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AITranslator();
});

// Initialize everything when DOM is loaded