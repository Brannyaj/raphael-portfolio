// Force video thumbnails to load on mobile
(function() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadVideoThumbnails);
    } else {
        loadVideoThumbnails();
    }

    function loadVideoThumbnails() {
        // Get all video elements
        const videos = document.querySelectorAll('video');
        
        videos.forEach(video => {
            // Load metadata to show first frame
            video.load();
            
            // Try to load first frame
            video.addEventListener('loadedmetadata', function() {
                // Seek to 0.1 seconds to ensure a frame is loaded
                this.currentTime = 0.1;
            }, { once: true });
            
            // Handle the seek operation
            video.addEventListener('seeked', function() {
                // Frame is now loaded and should be visible
            }, { once: true });
        });
    }
})();

// Hero Rotating Images
(function() {
    const imageCards = document.querySelectorAll('.hero-image-card');
    const totalImages = imageCards.length;
    let currentIndex = 0;

    if (totalImages === 0) return; // Exit if no images

    // Function to update image positions
    function updateImagePositions() {
        imageCards.forEach((card, index) => {
            // Calculate relative position to current index
            let relativePosition = (index - currentIndex + totalImages) % totalImages;
            
            // Set data-position attribute for CSS transitions
            card.setAttribute('data-position', relativePosition);
        });
    }

    // Initialize positions
    updateImagePositions();

    // Auto-rotate every 3 seconds
    const rotationInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalImages;
        updateImagePositions();
    }, 3000);

    // Clean up on page unload (good practice)
    window.addEventListener('beforeunload', () => {
        clearInterval(rotationInterval);
    });
})();

// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Portfolio Filter
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

// Gallery Filter
const galleryFilterButtons = document.querySelectorAll('.gallery-filter .filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        portfolioItems.forEach(item => {
            if (item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.5s ease-in-out';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Apply initial filter on page load
window.addEventListener('load', () => {
    const activeFilterBtn = document.querySelector('.portfolio-filter .filter-btn.active');
    if (activeFilterBtn) {
        const filterValue = activeFilterBtn.getAttribute('data-filter');
        portfolioItems.forEach(item => {
            if (item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
});

// Gallery Filter - Show videos by default on page load
if (galleryItems.length > 0) {
    galleryItems.forEach(item => {
        if (item.getAttribute('data-category') === 'videos') {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

galleryFilterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all gallery filter buttons
        galleryFilterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.5s ease-in-out';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Add fadeIn animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.3)';
        navbar.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.35)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.2)';
        navbar.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.skill-category, .portfolio-item, .about-text, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Contact form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = '#10b981';
            break;
        case 'error':
            notification.style.background = '#ef4444';
            break;
        case 'info':
        default:
            notification.style.background = '#3b82f6';
            break;
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 500);
    }
});

// Parallax effect removed to prevent content overlap

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add loaded class styles
const loadedStyles = document.createElement('style');
loadedStyles.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    .hero-graphic {
        opacity: 0;
        transform: scale(0.8);
        transition: opacity 1s ease, transform 1s ease;
    }
    
    body.loaded .hero-graphic {
        opacity: 1;
        transform: scale(1);
    }
`;
document.head.appendChild(loadedStyles);

// Add hover effects for skill items
document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-2px) scale(1.05)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click effects for portfolio items
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('click', (e) => {
        // Don't trigger if clicking on links
        if (e.target.closest('.portfolio-link')) {
            return;
        }
        
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(37, 99, 235, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        const rect = item.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        
        item.style.position = 'relative';
        item.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyles);

// Add scroll progress indicator
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    z-index: 10001;
    transition: width 0.1s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Add focus styles for accessibility
const focusStyles = document.createElement('style');
focusStyles.textContent = `
    *:focus {
        outline: 2px solid #2563eb;
        outline-offset: 2px;
    }
    
    .btn:focus,
    .nav-link:focus,
    .filter-btn:focus {
        outline: 2px solid #fbbf24;
        outline-offset: 2px;
    }
`;
document.head.appendChild(focusStyles);

// Performance optimization: Debounce scroll events
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

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    // Navbar background change
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.3)';
        navbar.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.35)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.2)';
        navbar.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
    }
    
    // Progress bar
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Cookie Consent Banner
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Google Analytics immediately
    initializeGoogleAnalytics();
    
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    
    // Check if user has already accepted cookies in this session
    const cookiesAccepted = sessionStorage.getItem('cookiesAccepted');
    
    // Only show banner if user hasn't accepted in this session
    if (cookieBanner && !cookiesAccepted) {
        // Show banner with minimal delay for smooth animation
        setTimeout(() => {
            cookieBanner.classList.add('show');
            cookieBanner.style.transform = 'translateY(0)'; // Override inline CSS
        }, 500);
    }
    
    // Handle accept button click
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            // Save consent to sessionStorage (clears when tab/browser closes)
            sessionStorage.setItem('cookiesAccepted', 'true');
            sessionStorage.setItem('cookieAcceptedDate', new Date().toISOString());
            
            // Hide banner with animation
            cookieBanner.classList.remove('show');
            cookieBanner.style.transform = 'translateY(100%)'; // Override inline CSS
            
            // Enable enhanced Google Analytics tracking after consent
            enableEnhancedAnalytics();
            
            console.log('Cookie consent accepted - Enhanced analytics enabled');
        });
    }
});

// Initialize Google Analytics properly
function initializeGoogleAnalytics() {
    if (typeof gtag === 'function') {
        // Ensure proper tracking configuration
        gtag('config', 'G-LSQRCDK0WS', {
            'send_page_view': true,
            'anonymize_ip': false,  // Enable proper tracking
            'allow_google_signals': false,  // Start with basic tracking
            'allow_ad_personalization_signals': false,
            'debug_mode': true,     // Enable debug mode
            'transport_type': 'beacon'  // Use beacon for reliability
        });
        
        console.log('Google Analytics initialized');
        
        
    } else {
        console.error('❌ gtag function not available during initialization');
    }
}


// Enable enhanced Google Analytics features after consent
function enableEnhancedAnalytics() {
    // Basic tracking already running, now enable enhanced features
    if (typeof gtag === 'function') {
        // Use 'set' to update specific properties without overriding config
        gtag('set', 'allow_google_signals', true);
        gtag('set', 'allow_ad_personalization_signals', true);
        gtag('set', 'anonymize_ip', false);
        
        console.log('Enhanced Google Analytics tracking enabled');
        
    } else {
        console.error('❌ gtag function not available for enhanced tracking');
    }
}

// Pricing Calculator
const pricingData = {
    website: {
        'hosting-platform': {
            price: 450,
            description: 'Website using hosting platforms like GoDaddy, Wix, or WordPress'
        },
        'shopify': {
            hasTiers: true,
            tiers: {
                'starter': {
                    price: 500,
                    description: 'Basic storefront, stripe checkout and product pages'
                },
                'growth': {
                    price: 1200,
                    description: 'Custom design, admin dashboard and inventory logic'
                },
                'scale': {
                    price: 4500,
                    description: 'Multi-store support, subscriptions, analytics CI/CD'
                }
            }
        },
        'basic': {
            price: 3000,
            description: 'Basic custom-built website coded from scratch'
        },
        'advanced': {
            price: 20000,
            description: 'Advanced custom website with complex features'
        },
        'enterprise': {
            price: 'Contact for Pricing',
            description: 'Enterprise-level website solution'
        }
    },
    mobile: {
        'basic': {
            price: 15000,
            description: 'Basic mobile app for iOS and Android'
        },
        'advanced': {
            price: 50000,
            description: 'Advanced mobile app with complex features'
        },
        'enterprise': {
            price: 'Contact for Pricing',
            description: 'Enterprise-level mobile application'
        }
    },
    ai: {
        'api-integration': {
            price: 20000,
            description: 'Existing Model integration (ChatGPT, Copilot, etc.)'
        },
        'basic-model': {
            price: 5000000,
            description: 'Building and training a basic AI model from scratch'
        },
        'advanced-model': {
            price: 75000000,
            description: 'Building and training an advanced AI model from scratch'
        },
        'enterprise': {
            price: 'Contact for Pricing',
            description: 'Enterprise AI solution with custom requirements'
        }
    },
    blockchain: {
        'basic': {
            price: 70000,
            description: 'Basic blockchain development and smart contracts'
        },
        'advanced': {
            price: 200000,
            description: 'Advanced blockchain solution with DeFi/NFT features'
        },
        'enterprise': {
            price: 'Contact for Pricing',
            description: 'Enterprise blockchain infrastructure'
        }
    },
    maintenance: {
        'standard': {
            price: 175,
            description: 'Standard maintenance - Regular bug fixes, feature updates, security patches, and performance optimization during business hours (9am-5pm)',
            isHourly: true
        },
        'priority': {
            price: 225,
            description: 'Priority support - Same-day response, 24/7 availability, emergency fixes, and immediate deployment',
            isHourly: true
        }
    }
};

const complexityOptions = {
    website: [
        { value: 'hosting-platform', text: 'Hosting Platform (GoDaddy, Wix, WordPress)' },
        { value: 'shopify', text: 'Shopify' },
        { value: 'basic', text: 'Basic Custom-Built' },
        { value: 'advanced', text: 'Advanced Custom-Built' },
        { value: 'enterprise', text: 'Enterprise Level' }
    ],
    mobile: [
        { value: 'basic', text: 'Basic' },
        { value: 'advanced', text: 'Advanced' },
        { value: 'enterprise', text: 'Enterprise' }
    ],
    ai: [
        { value: 'api-integration', text: 'Existing Model Integration (ChatGPT, Copilot, etc.)' },
        { value: 'basic-model', text: 'Basic Model (Built from Scratch)' },
        { value: 'advanced-model', text: 'Advanced Model (Built from Scratch)' },
        { value: 'enterprise', text: 'Enterprise' }
    ],
    blockchain: [
        { value: 'basic', text: 'Basic' },
        { value: 'advanced', text: 'Advanced' },
        { value: 'enterprise', text: 'Enterprise' }
    ],
    maintenance: [
        { value: 'standard', text: 'Standard Maintenance (Business Hours)' },
        { value: 'priority', text: 'Priority Support (24/7)' }
    ]
};

const tierOptions = {
    shopify: [
        { value: 'starter', text: 'Starter' },
        { value: 'growth', text: 'Growth' },
        { value: 'scale', text: 'Scale' }
    ]
};

const serviceTypeSelect = document.getElementById('service-type');
const complexityLevelSelect = document.getElementById('complexity-level');
const complexityGroup = document.getElementById('complexity-group');
const tierLevelSelect = document.getElementById('tier-level');
const tierGroup = document.getElementById('tier-group');
const calculatorResult = document.getElementById('calculator-result');
const resultPrice = document.getElementById('result-price');
const resultDescription = document.getElementById('result-description');

if (serviceTypeSelect) {
    serviceTypeSelect.addEventListener('change', function() {
        const selectedService = this.value;
        
        if (selectedService) {
            // Show complexity dropdown
            complexityGroup.style.display = 'flex';
            
            // Populate complexity options
            complexityLevelSelect.innerHTML = '<option value="">-- Select Complexity --</option>';
            complexityOptions[selectedService].forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.value;
                optionElement.textContent = option.text;
                complexityLevelSelect.appendChild(optionElement);
            });
            
            // Hide result
            calculatorResult.style.display = 'none';
        } else {
            complexityGroup.style.display = 'none';
            calculatorResult.style.display = 'none';
        }
    });

    complexityLevelSelect.addEventListener('change', function() {
        const selectedService = serviceTypeSelect.value;
        const selectedComplexity = this.value;
        
        // Check if this complexity has tiers (like Shopify)
        if (selectedService && selectedComplexity) {
            const pricing = pricingData[selectedService][selectedComplexity];
            
            if (pricing && pricing.hasTiers) {
                // Show tier dropdown for tiered pricing
                tierGroup.style.display = 'block';
                tierLevelSelect.innerHTML = '<option value="">-- Select Tier --</option>';
                
                const tiers = tierOptions[selectedComplexity];
                tiers.forEach(tier => {
                    const option = document.createElement('option');
                    option.value = tier.value;
                    option.textContent = tier.text;
                    tierLevelSelect.appendChild(option);
                });
                
                calculatorResult.style.display = 'none';
                return;
            }
        }
        
        // Hide tier dropdown for non-tiered options
        tierGroup.style.display = 'none';
        tierLevelSelect.value = '';
        
        if (selectedService && selectedComplexity) {
            const pricing = pricingData[selectedService][selectedComplexity];
            const depositInfo = document.getElementById('deposit-info');
            const depositTextElement = document.getElementById('deposit-text');
            const depositAmountElement = document.getElementById('deposit-amount');
            const remainingAmountElement = document.getElementById('remaining-amount');
            
            // Format price
            let priceText;
            if (typeof pricing.price === 'number') {
                // Check if this is an hourly rate
                if (pricing.isHourly) {
                    priceText = '$' + pricing.price.toLocaleString('en-US') + '/hour';
                    
                    // For hourly rates, require 1 hour payment as deposit
                    const depositAmount = pricing.price; // 1 hour
                    
                    // Hide the 20% deposit text for hourly rates
                    depositTextElement.style.display = 'none';
                    
                    depositAmountElement.innerHTML = '<strong>Initial Payment: $' + depositAmount.toLocaleString('en-US') + ' (1 hour)</strong>';
                    remainingAmountElement.innerHTML = 'Subsequent hours billed as work is completed';
                    depositInfo.style.display = 'block';
                    
                    // Store for form
                    window.currentProjectCost = pricing.price;
                    window.currentDepositAmount = depositAmount;
                    window.isHourlyRate = true;
                } else {
                    priceText = '$' + pricing.price.toLocaleString('en-US');
                    
                    // Calculate and display deposit (20%)
                    const depositAmount = pricing.price * 0.2;
                    const remainingAmount = pricing.price * 0.8;
                    
                    // Show the 20% deposit text for project-based pricing
                    depositTextElement.style.display = 'block';
                    
                    depositAmountElement.innerHTML = '<strong>20% Deposit: $' + depositAmount.toLocaleString('en-US') + '</strong>';
                    remainingAmountElement.innerHTML = '80% Balance ($' + remainingAmount.toLocaleString('en-US') + ') payable after project completion';
                    depositInfo.style.display = 'block';
                    
                    // Store for form
                    window.currentProjectCost = pricing.price;
                    window.currentDepositAmount = depositAmount;
                    window.isHourlyRate = false;
                }
            } else {
                priceText = pricing.price;
                
                // Show the 20% deposit text for enterprise pricing
                depositTextElement.style.display = 'block';
                
                depositAmountElement.innerHTML = '<strong>Deposit: Contact for pricing</strong>';
                remainingAmountElement.innerHTML = 'Remaining balance payable after project completion';
                depositInfo.style.display = 'block';
                window.currentProjectCost = 0;
                window.currentDepositAmount = 0;
            }
            
            // Update result
            resultPrice.textContent = priceText;
            resultDescription.textContent = pricing.description;
            
            // Show result with animation
            calculatorResult.style.display = 'flex';
            calculatorResult.style.opacity = '0';
            setTimeout(() => {
                calculatorResult.style.transition = 'opacity 0.3s ease';
                calculatorResult.style.opacity = '1';
            }, 10);
        } else {
            calculatorResult.style.display = 'none';
        }
    });
    
    // Tier Level Select Event Listener (for Shopify tiers)
    if (tierLevelSelect) {
        tierLevelSelect.addEventListener('change', function() {
            const selectedService = serviceTypeSelect.value;
            const selectedComplexity = complexityLevelSelect.value;
            const selectedTier = this.value;
            
            if (selectedService && selectedComplexity && selectedTier) {
                const pricing = pricingData[selectedService][selectedComplexity].tiers[selectedTier];
                const depositInfo = document.getElementById('deposit-info');
                const depositTextElement = document.getElementById('deposit-text');
                const depositAmountElement = document.getElementById('deposit-amount');
                const remainingAmountElement = document.getElementById('remaining-amount');
                
                // Format price
                let priceText;
                if (typeof pricing.price === 'number') {
                    priceText = '$' + pricing.price.toLocaleString('en-US');
                    
                    // Calculate and display deposit (20%)
                    const depositAmount = pricing.price * 0.2;
                    const remainingAmount = pricing.price * 0.8;
                    
                    // Show the 20% deposit text for project-based pricing
                    depositTextElement.style.display = 'block';
                    
                    depositAmountElement.innerHTML = '<strong>20% Deposit: $' + depositAmount.toLocaleString('en-US') + '</strong>';
                    remainingAmountElement.innerHTML = '80% Balance ($' + remainingAmount.toLocaleString('en-US') + ') payable after project completion';
                    depositInfo.style.display = 'block';
                    
                    // Store for form
                    window.currentProjectCost = pricing.price;
                    window.currentDepositAmount = depositAmount;
                    window.isHourlyRate = false;
                } else {
                    priceText = pricing.price;
                    
                    // Show the 20% deposit text for enterprise pricing
                    depositTextElement.style.display = 'block';
                    
                    depositAmountElement.innerHTML = '<strong>Deposit: Contact for pricing</strong>';
                    remainingAmountElement.innerHTML = 'Remaining balance payable after project completion';
                    depositInfo.style.display = 'block';
                    window.currentProjectCost = 0;
                    window.currentDepositAmount = 0;
                }
                
                // Update result
                resultPrice.textContent = priceText;
                resultDescription.textContent = pricing.description;
                
                // Show result with animation
                calculatorResult.style.display = 'flex';
                calculatorResult.style.opacity = '0';
                setTimeout(() => {
                    calculatorResult.style.transition = 'opacity 0.3s ease';
                    calculatorResult.style.opacity = '1';
                }, 10);
            } else {
                calculatorResult.style.display = 'none';
            }
        });
    }
}

// Get Started Button - Navigate to Payment Page
const getStartedBtn = document.getElementById('get-started-btn');

if (getStartedBtn) {
    getStartedBtn.addEventListener('click', function() {
        // Check if price is "Contact for Pricing"
        if (window.currentDepositAmount === 0) {
            alert('Please contact us directly for enterprise pricing.');
            window.location.href = 'contact.html';
            return;
        }
        
        // Store project data in sessionStorage
        const projectData = {
            service: serviceTypeSelect.options[serviceTypeSelect.selectedIndex].text,
            serviceValue: serviceTypeSelect.value,
            complexity: complexityLevelSelect.options[complexityLevelSelect.selectedIndex].text,
            complexityValue: complexityLevelSelect.value,
            totalCost: window.currentProjectCost,
            depositAmount: window.currentDepositAmount,
            remainingAmount: window.isHourlyRate ? 0 : (window.currentProjectCost - window.currentDepositAmount),
            isHourlyRate: window.isHourlyRate || false
        };
        
        // Add tier information if applicable (for Shopify)
        if (tierLevelSelect && tierLevelSelect.value) {
            projectData.tier = tierLevelSelect.options[tierLevelSelect.selectedIndex].text;
            projectData.tierValue = tierLevelSelect.value;
        }
        
        sessionStorage.setItem('projectData', JSON.stringify(projectData));
        
        // Navigate to payment page
        window.location.href = 'payment.html';
    });
}

// Payment Page - Load Project Data
if (window.location.pathname.includes('payment.html')) {
    console.log('Payment page loaded');
    
    // Load project data from sessionStorage
    const projectData = JSON.parse(sessionStorage.getItem('projectData'));
    console.log('Project data:', projectData);
    
    if (!projectData) {
        // No project data found, redirect back to pricing
        alert('Please select a service and pricing first.');
        window.location.href = 'pricing.html';
    } else {
        // Display project summary
        document.getElementById('selected-service').textContent = projectData.service;
        
        // Display complexity with tier if applicable
        let complexityText = projectData.complexity;
        if (projectData.tier) {
            complexityText += ' - ' + projectData.tier;
        }
        document.getElementById('selected-complexity').textContent = complexityText;
        
        // Handle hourly rate vs project-based pricing
        if (projectData.isHourlyRate) {
            // Update header text for maintenance services
            document.getElementById('payment-header-text').textContent = 'Fill in your details below and send the initial 1-hour fee. I\'ll follow up with you to discuss your maintenance needs in detail.';
            
            // Update deposit label
            document.getElementById('deposit-label').textContent = 'Initial Payment:';
            
            // Update summary note
            document.getElementById('summary-note').textContent = 'Subsequent hours billed as work is completed';
            
            document.getElementById('display-total-cost').textContent = '$' + projectData.totalCost.toLocaleString('en-US') + '/hour';
            document.getElementById('display-deposit-cost').textContent = '$' + projectData.depositAmount.toLocaleString('en-US') + ' (1 hour)';
            document.getElementById('display-remaining-cost').textContent = 'Billed as work is completed';
            document.getElementById('payment-amount-text').textContent = '$' + projectData.depositAmount.toLocaleString('en-US');
        } else {
            // Keep original text for project-based services
            document.getElementById('payment-header-text').textContent = 'Fill in your details below and send the 20% deposit. I\'ll follow up with you to discuss your project in detail.';
            
            // Keep original deposit label
            document.getElementById('deposit-label').textContent = '20% Deposit:';
            
            // Keep original summary note
            document.getElementById('summary-note').textContent = 'Remaining balance due upon project completion';
            
            document.getElementById('display-total-cost').textContent = '$' + projectData.totalCost.toLocaleString('en-US');
            document.getElementById('display-deposit-cost').textContent = '$' + projectData.depositAmount.toLocaleString('en-US');
            document.getElementById('display-remaining-cost').textContent = '$' + projectData.remainingAmount.toLocaleString('en-US');
            document.getElementById('payment-amount-text').textContent = '$' + projectData.depositAmount.toLocaleString('en-US');
        }
        
        // Store in window for form submission
        window.currentProjectData = projectData;
        
        console.log('Payment page ready - Zelle and Venmo payment options available');
    }
}

// Stripe initialization is no longer needed since we only support Zelle and Venmo

// Handle Payment Form Submission - Declare variables first
let paymentForm;
let submitButton;
let buttonText;
let spinner;
let paymentMessage;
let selectedProofFiles = []; // Array to hold selected files

// Initialize form elements if on payment page
if (window.location.pathname.includes('payment.html')) {
    paymentForm = document.getElementById('payment-form');
    submitButton = document.getElementById('submit-payment');
    buttonText = document.getElementById('button-text');
    spinner = document.getElementById('spinner');
    paymentMessage = document.getElementById('payment-message');
    
    // Handle payment method selection
    const paymentMethodRadios = document.querySelectorAll('input[name="payment-method"]');
    const altPaymentSection = document.getElementById('alt-payment-section');
    const zelleSection = document.getElementById('zelle-section');
    const venmoSection = document.getElementById('venmo-section');
    
    // Function to update memo text based on service
    function updateMemoText() {
        const serviceValue = window.currentProjectData?.serviceValue || '';
        let memoText = '';
        
        if (serviceValue === 'website') {
            memoText = 'Project Deposit - Website';
        } else if (serviceValue === 'mobile') {
            memoText = 'Project Deposit - Mobile App';
        } else if (serviceValue === 'ai') {
            memoText = 'Project Deposit - AI Integration';
        } else if (serviceValue === 'blockchain') {
            memoText = 'Project Deposit - Blockchain';
        } else {
            memoText = 'Project Deposit';
        }
        
        document.getElementById('zelle-memo-text').textContent = memoText;
        document.getElementById('venmo-memo-text').textContent = memoText;
    }
    
    // Update memo text on page load and whenever service changes
    updateMemoText();
    
    paymentMethodRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'zelle') {
                altPaymentSection.style.display = 'block';
                zelleSection.style.display = 'block';
                venmoSection.style.display = 'none';
                buttonText.textContent = 'Submit';
                updateMemoText();
            } else if (this.value === 'venmo') {
                altPaymentSection.style.display = 'block';
                zelleSection.style.display = 'none';
                venmoSection.style.display = 'block';
                buttonText.textContent = 'Submit';
                updateMemoText();
            }
        });
    });
    
    // Initialize to show Zelle by default
    zelleSection.style.display = 'block';
    venmoSection.style.display = 'none';
    altPaymentSection.style.display = 'block';
    
    // Handle proof of payment file upload with stacked list and remove buttons
    const proofUploadInput = document.getElementById('proof-of-payment');
    const proofFileListContainer = document.getElementById('proof-file-list');
    const proofStatusElement = document.getElementById('proof-upload-status');
    const proofFilenameElement = document.getElementById('proof-filename');
    const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes
    const MAX_FILE_COUNT = 20; // Maximum 20 files

    function humanFileSize(size) {
        const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
        return (size / Math.pow(1024, i)).toFixed(i ? 1 : 0) + ['B', 'KB', 'MB', 'GB'][i];
    }

    function renderProofFileList() {
        if (!proofFileListContainer) return;
        proofFileListContainer.innerHTML = '';
        selectedProofFiles.forEach((file, idx) => {
            const item = document.createElement('div');
            item.className = 'proof-file-item';
            item.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:8px 10px; background:#0b1220; border:1px solid #233241; border-radius:4px; margin-top:8px; color:#cbd5e1; font-size:13px;';

            const left = document.createElement('div');
            left.textContent = `${file.name} (${humanFileSize(file.size)})`;
            left.style.cssText = 'overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:80%;';

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'remove-proof-file';
            btn.dataset.index = idx;
            btn.textContent = '✕';
            btn.style.cssText = 'background:#1f2937; color:#fff; border:none; border-radius:4px; padding:4px 8px; cursor:pointer;';

            item.appendChild(left);
            item.appendChild(btn);
            proofFileListContainer.appendChild(item);
        });

        // Update status text
        if (selectedProofFiles.length === 0) {
            proofStatusElement.style.display = 'none';
        } else {
            proofStatusElement.style.display = 'block';
            proofFilenameElement.textContent = selectedProofFiles.length === 1 ? selectedProofFiles[0].name : `${selectedProofFiles.length}`;
        }
    }

    if (proofUploadInput) {
        proofUploadInput.addEventListener('change', function() {
            const files = Array.from(this.files || []);
            if (files.length === 0) return;

            for (let file of files) {
                if (selectedProofFiles.length >= MAX_FILE_COUNT) {
                    showPaymentMessage(`Maximum ${MAX_FILE_COUNT} files allowed.`, false);
                    break;
                }
                if (file.size > MAX_FILE_SIZE) {
                    showPaymentMessage(`File "${file.name}" exceeds 20MB limit. Please upload smaller files.`, false);
                    continue;
                }
                selectedProofFiles.push(file);
            }

            // Clear the native input so the same file can be re-selected if needed
            this.value = '';
            renderProofFileList();
            
            // Clear validation error when files are added
            const container = this.closest('.form-group') || this.parentNode;
            const existing = container.querySelector('.input-error');
            if (existing) existing.remove();
            this.classList.remove('invalid-field');
        });
    }

    // Delegate remove button clicks
    if (proofFileListContainer) {
        proofFileListContainer.addEventListener('click', function(e) {
            if (e.target && e.target.classList.contains('remove-proof-file')) {
                const idx = parseInt(e.target.dataset.index, 10);
                if (!isNaN(idx)) {
                    selectedProofFiles.splice(idx, 1);
                    renderProofFileList();
                }
            }
        });
    }

    // Inline form validation helpers
    function clearValidationErrors() {
        const existing = document.querySelectorAll('.input-error');
        existing.forEach(el => el.remove());
        const invalids = document.querySelectorAll('.invalid-field');
        invalids.forEach(el => el.classList.remove('invalid-field'));
    }

    function showFieldError(fieldEl, message) {
        if (!fieldEl) return;
        const container = fieldEl.closest('.form-group') || fieldEl.parentNode;
        // Avoid duplicate
        let existing = container.querySelector('.input-error');
        if (existing) existing.remove();

        const msg = document.createElement('p');
        msg.className = 'input-error';
        msg.style.cssText = 'color:#ef4444; font-size:12px; margin:6px 0 0 0;';
        msg.textContent = message;
        container.appendChild(msg);
        fieldEl.classList.add('invalid-field');
    }

    function validateRequiredFields() {
        clearValidationErrors();
        let firstInvalid = null;

        const name = document.getElementById('client-name');
        const email = document.getElementById('client-email');
        const country = document.getElementById('country-code');
        const phone = document.getElementById('client-phone');
        const desc = document.getElementById('project-description');

        if (!name || name.value.trim() === '') {
            showFieldError(name || document.getElementById('client-name'), 'Full name is required.');
            firstInvalid = firstInvalid || (name || document.getElementById('client-name'));
        }

        if (!email || !email.checkValidity()) {
            showFieldError(email || document.getElementById('client-email'), 'Please enter a valid email address.');
            firstInvalid = firstInvalid || (email || document.getElementById('client-email'));
        }

        if (!country || country.value.trim() === '') {
            showFieldError(country || document.getElementById('country-code'), 'Please select a country code.');
            firstInvalid = firstInvalid || (country || document.getElementById('country-code'));
        }

        if (!phone || phone.value.trim() === '') {
            showFieldError(phone || document.getElementById('client-phone'), 'Phone number is required.');
            firstInvalid = firstInvalid || (phone || document.getElementById('client-phone'));
        }

        if (!desc || desc.value.trim() === '') {
            showFieldError(desc || document.getElementById('project-description'), 'Project description is required.');
            firstInvalid = firstInvalid || (desc || document.getElementById('project-description'));
        }

        // Check proof files
        if (!selectedProofFiles || selectedProofFiles.length === 0) {
            const proofInput = document.getElementById('proof-of-payment');
            showFieldError(proofInput || document.getElementById('proof-of-payment'), 'Please upload proof of payment.');
            firstInvalid = firstInvalid || (proofInput || document.getElementById('proof-of-payment'));
        }

        if (firstInvalid) {
            firstInvalid.focus();
            return false;
        }
        return true;
    }

    // Remove validation error when user interacts
    ['client-name','client-email','country-code','client-phone','project-description','proof-of-payment'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', () => {
            const container = el.closest('.form-group') || el.parentNode;
            const existing = container.querySelector('.input-error');
            if (existing) existing.remove();
            el.classList.remove('invalid-field');
        });
        el.addEventListener('change', () => {
            const container = el.closest('.form-group') || el.parentNode;
            const existing = container.querySelector('.input-error');
            if (existing) existing.remove();
            el.classList.remove('invalid-field');
        });
    });
    
    // Handle copy buttons for alternative payments
    const copyButtons = document.querySelectorAll('.copy-payment-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-copy');
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const text = targetElement.textContent;
                navigator.clipboard.writeText(text).then(() => {
                    const originalText = this.textContent;
                    this.textContent = 'Copied!';
                    setTimeout(() => {
                        this.textContent = originalText;
                    }, 2000);
                }).catch(err => console.error('Failed to copy:', err));
            }
        });
    });
}

if (paymentForm) {
    paymentForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Run inline validation and show per-field errors
        if (!validateRequiredFields()) {
            return;
        }

        setPaymentLoading(true);
        
        // Get form data
        const customerName = document.getElementById('client-name').value;
        const customerEmail = document.getElementById('client-email').value;
        const customerPhone = document.getElementById('client-phone').value;
        const countryCode = document.getElementById('country-code').value;
        const projectDescription = document.getElementById('project-description').value;
        const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        
        const formData = {
            name: customerName,
            email: customerEmail,
            phone: `${countryCode} ${customerPhone}`,
            description: projectDescription,
            projectCost: window.currentProjectData.totalCost,
            depositAmount: window.currentProjectData.depositAmount,
            service: window.currentProjectData.service,
            complexity: window.currentProjectData.complexity,
            paymentMethod: selectedPaymentMethod
        };
        
        try {
            if (selectedPaymentMethod === 'zelle' || selectedPaymentMethod === 'venmo') {
                // Alternative payment method (Zelle or Venmo)
                console.log('Submitting project with alternative payment method:', selectedPaymentMethod);
                
                // Fire & Forget: Send project data in background (don't wait)
                sendProjectData(formData).catch(err => {
                    console.error('Background upload error:', err);
                    // Already redirected, so just log the error
                });
                
                // Redirect IMMEDIATELY to success page (don't wait for upload)
                sessionStorage.removeItem('projectData');
                window.location.href = 'payment-success.html';
            }
        } catch (error) {
            console.error('Error:', error);
            showPaymentMessage('An error occurred. Please try again.');
            setPaymentLoading(false);
        }
    });
}

async function sendProjectData(formData) {
    // Send project data with file uploads to your server
    try {
        // Create FormData to handle file uploads
        const form = new FormData();
        
        // Add all form fields
        form.append('name', formData.name);
        form.append('email', formData.email);
        form.append('phone', formData.phone);
        form.append('description', formData.description);
        form.append('projectCost', formData.projectCost);
        form.append('depositAmount', formData.depositAmount);
        form.append('service', formData.service);
        form.append('complexity', formData.complexity);
        form.append('paymentMethod', formData.paymentMethod);
        
        // Add file uploads (proof of payment) from selectedProofFiles array
        if (selectedProofFiles && selectedProofFiles.length > 0) {
            for (let i = 0; i < selectedProofFiles.length; i++) {
                form.append('files', selectedProofFiles[i]);
            }
        }
        
        const response = await fetch('https://raphael-portfolio-backend.raphael-devworkersdev.workers.dev/api/submit-project', {
            method: 'POST',
            body: form // Send FormData (no Content-Type header needed, browser sets it automatically)
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error sending project data:', error);
        throw error; // Re-throw to handle in the calling function
    }
}

function setPaymentLoading(isLoading) {
    if (submitButton && buttonText && spinner) {
        if (isLoading) {
            submitButton.disabled = true;
            buttonText.classList.add('hidden');
            spinner.classList.remove('hidden');
        } else {
            submitButton.disabled = false;
            buttonText.classList.remove('hidden');
            spinner.classList.add('hidden');
        }
    }
}

function showPaymentMessage(message, isSuccess = false) {
    if (paymentMessage) {
        paymentMessage.textContent = message;
        paymentMessage.className = 'payment-message';
        if (isSuccess) {
            paymentMessage.classList.add('success');
        }
    }
}

console.log('Portfolio website loaded successfully! 🚀');

// Live View Counter System
const viewCounters = {
    'coding-session': { initial: 67234891, current: null, counted: false },
    'personal-moments': { initial: 54876432, current: null, counted: false },
    'codebase-review': { initial: 30891423, current: null, counted: false },
    'life-moments': { initial: 89421765, current: null, counted: false }
};

// Load saved counts from localStorage or use initial values
Object.keys(viewCounters).forEach(key => {
    const saved = localStorage.getItem(`viewCount_${key}`);
    viewCounters[key].current = saved ? parseInt(saved) : viewCounters[key].initial;
});

// Format number with commas
function formatViewCount(num) {
    return num.toLocaleString('en-US');
}

// Update view count display
function updateViewCountDisplay(videoId, count) {
    const elements = document.querySelectorAll(`[data-video-id="${videoId}"] .video-views span`);
    elements.forEach(el => {
        el.textContent = formatViewCount(count) + ' views';
    });
}

// Increment view count for a specific video
function incrementVideoView(videoId) {
    if (viewCounters[videoId] && !viewCounters[videoId].counted) {
        viewCounters[videoId].current += 1;
        viewCounters[videoId].counted = true; // Mark as counted for this session
        
        // Save to localStorage
        localStorage.setItem(`viewCount_${videoId}`, viewCounters[videoId].current);
        
        // Update display
        updateViewCountDisplay(videoId, viewCounters[videoId].current);
    }
}

// Initialize view counts and add play listeners
window.addEventListener('load', () => {
    // Update all displays with current counts
    Object.keys(viewCounters).forEach(key => {
        updateViewCountDisplay(key, viewCounters[key].current);
    });
    
    // Add event listeners to all videos
    document.querySelectorAll('[data-video-id]').forEach(item => {
        const videoId = item.getAttribute('data-video-id');
        const videoElement = item.querySelector('video');
        
        if (videoElement) {
            // Increment count when video is played
            videoElement.addEventListener('play', function() {
                incrementVideoView(videoId);
            }, { once: false });
        }
    });
});
