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
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.35)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
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
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.35)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
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
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    
    if (cookiesAccepted) {
        // User already accepted - enable enhanced tracking
        enableEnhancedAnalytics();
    } else if (cookieBanner) {
        // Show banner with slight delay for smooth animation
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    }
    
    // Handle accept button click
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            // Save consent to localStorage
            localStorage.setItem('cookiesAccepted', 'true');
            localStorage.setItem('cookieAcceptedDate', new Date().toISOString());
            
            // Hide banner with animation
            cookieBanner.classList.remove('show');
            
            // Enable enhanced Google Analytics tracking after consent
            enableEnhancedAnalytics();
            
            console.log('Cookie consent accepted - Enhanced analytics enabled');
        });
    }
});

// Enable enhanced Google Analytics features after consent
function enableEnhancedAnalytics() {
    // Basic tracking already running, now enable enhanced features
    if (typeof gtag === 'function') {
        // Enable demographics and interest reports
        gtag('set', 'allow_google_signals', true);
        
        // Enable enhanced measurement
        gtag('config', 'G-LSQRCDK0WS', {
            'anonymize_ip': false,  // Full IP tracking after consent
            'allow_google_signals': true,  // Demographics and interests
            'allow_ad_personalization_signals': true  // Remarketing features
        });
        
        console.log('Enhanced Google Analytics tracking enabled');
    }
}

// Pricing Calculator
const pricingData = {
    website: {
        'hosting-platform': {
            price: 850,
            description: 'Website using hosting platforms like GoDaddy, Wix, or WordPress'
        },
        'shopify': {
            hasTiers: true,
            tiers: {
                'starter': {
                    price: 2500,
                    description: 'Basic storefront, stripe checkout and product pages'
                },
                'growth': {
                    price: 5000,
                    description: 'Custom design, admin dashboard and inventory logic'
                },
                'scale': {
                    price: 20000,
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

// Stripe Integration - Declare variables first
let stripe;
let elements;
let paymentElement;

// Payment Page - Load Project Data and Initialize Stripe
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
            document.getElementById('payment-header-text').textContent = 'Fill in your details below and pay the initial 1-hour fee to get started. I\'ll follow up with you to discuss your maintenance needs in detail.';
            
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
            document.getElementById('payment-header-text').textContent = 'Fill in your details below and pay the 20% deposit to get started. I\'ll follow up with you to discuss your project in detail.';
            
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
        
        console.log('Initializing Stripe with deposit amount:', projectData.depositAmount);
        
        // Initialize Stripe
        initializeStripePayment();
    }
}

async function initializeStripePayment() {
    // Stripe publishable key
    const STRIPE_PUBLISHABLE_KEY = 'pk_live_51SGjaUASYtDVjedC1uxn3WilBjkXFSsNg3cRB981pLyIFPoaJ30toluyt5EbYcreOpg9cSt8z16U7ashmAv2aJi1009cvhoph1';
    
    console.log('Starting Stripe initialization...');
    
    try {
        // Initialize Stripe
        console.log('Initializing Stripe with publishable key...');
        stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
        console.log('Stripe initialized successfully');
        
        // Calculate amount in cents
        const amountInCents = Math.round(window.currentProjectData.depositAmount * 100);
        console.log('Creating payment intent for amount:', amountInCents, 'cents ($' + window.currentProjectData.depositAmount + ')');
        
        // Show loading message in payment element area
        const paymentElementDiv = document.getElementById('payment-element');
        if (paymentElementDiv) {
            paymentElementDiv.innerHTML = '<p style="text-align: center; padding: 2rem; color: #6C8094;">Loading payment form...</p>';
        }
        
        // Create payment intent on your server and get clientSecret
        // Note: Customer form data will be added later when user submits
        console.log('Fetching payment intent from server...');
        const response = await fetch('https://raphael-portfolio-backend.raphael-devworkersdev.workers.dev/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                amount: amountInCents,
                currency: 'usd',
                metadata: {
                    // Only include project data (known at page load)
                    service: window.currentProjectData.service,
                    complexity: window.currentProjectData.complexity,
                    tier: window.currentProjectData.tier || '',
                    totalCost: window.currentProjectData.totalCost.toString(),
                    remainingAmount: window.currentProjectData.remainingAmount.toString(),
                    depositAmount: window.currentProjectData.depositAmount.toString(),
                    isHourlyRate: window.currentProjectData.isHourlyRate ? 'true' : 'false'
                }
            }),
        });
        
        console.log('Server response status:', response.status);
        
        if (!response.ok) {
            throw new Error('Server returned error: ' + response.status);
        }
        
        const data = await response.json();
        console.log('Received client secret from server');
        
        const { clientSecret } = data;
        
        if (!clientSecret) {
            throw new Error('No client secret received from server');
        }
        
        // Extract and store payment intent ID from client secret
        // Client secret format: pi_xxx_secret_yyy
        window.currentPaymentIntentId = clientSecret.split('_secret_')[0];
        console.log('Payment Intent ID stored:', window.currentPaymentIntentId);
        
        // Create Stripe Elements
        console.log('Creating Stripe Elements...');
        elements = stripe.elements({ clientSecret });
        paymentElement = elements.create('payment');
        
        console.log('Mounting payment element...');
        paymentElement.mount('#payment-element');
        console.log('Stripe Payment Element mounted successfully!');
        
    } catch (error) {
        console.error('Stripe initialization error:', error);
        console.error('Error details:', error.message);
        const paymentElementDiv = document.getElementById('payment-element');
        if (paymentElementDiv) {
            paymentElementDiv.innerHTML = '<p style="text-align: center; padding: 2rem; color: #c00;">Error loading payment form. Please refresh the page or contact support.</p>';
        }
        showPaymentMessage('Error loading payment form: ' + error.message);
    }
}

// Handle Payment Form Submission - Declare variables first
let paymentForm;
let submitButton;
let buttonText;
let spinner;
let paymentMessage;

// Initialize form elements if on payment page
if (window.location.pathname.includes('payment.html')) {
    paymentForm = document.getElementById('payment-form');
    submitButton = document.getElementById('submit-payment');
    buttonText = document.getElementById('button-text');
    spinner = document.getElementById('spinner');
    paymentMessage = document.getElementById('payment-message');
}

if (paymentForm) {
    paymentForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        setPaymentLoading(true);
        
        // Get form data
        const customerName = document.getElementById('client-name').value;
        const customerEmail = document.getElementById('client-email').value;
        const customerPhone = document.getElementById('client-phone').value;
        const countryCode = document.getElementById('country-code').value;
        const projectDescription = document.getElementById('project-description').value;
        
        const formData = {
            name: customerName,
            email: customerEmail,
            phone: `${countryCode} ${customerPhone}`,
            description: projectDescription,
            projectCost: window.currentProjectData.totalCost,
            depositAmount: window.currentProjectData.depositAmount,
            service: window.currentProjectData.service,
            complexity: window.currentProjectData.complexity
        };
        
        try {
            // Step 1: Update payment intent with customer metadata BEFORE confirming payment
            console.log('Updating payment intent with customer data...');
            const updateResponse = await fetch('https://raphael-portfolio-backend.raphael-devworkersdev.workers.dev/update-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentIntentId: window.currentPaymentIntentId,
                    metadata: {
                        name: customerName,
                        email: customerEmail,
                        phone: `${countryCode} ${customerPhone}`,
                        service: window.currentProjectData.service,
                        complexity: window.currentProjectData.complexity,
                        tier: window.currentProjectData.tier || '',
                        totalCost: window.currentProjectData.totalCost.toString(),
                        remainingAmount: window.currentProjectData.remainingAmount.toString(),
                        depositAmount: window.currentProjectData.depositAmount.toString(),
                        isHourlyRate: window.currentProjectData.isHourlyRate ? 'true' : 'false',
                        projectDescription: projectDescription
                    }
                })
            });
            
            if (!updateResponse.ok) {
                throw new Error('Failed to update payment information');
            }
            
            console.log('Payment intent updated successfully');
            
            // Step 2: Confirm payment with Stripe
            console.log('Confirming payment...');
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: window.location.origin + '/payment-success.html',
                    receipt_email: customerEmail,
                },
                redirect: 'if_required'
            });
            
            if (error) {
                showPaymentMessage(error.message);
                setPaymentLoading(false);
            } else {
                // Payment successful - send form data to your server
                await sendProjectData(formData);
                showPaymentMessage('Payment successful! Redirecting...', true);
                
                // Clear session storage and redirect
                setTimeout(() => {
                    sessionStorage.removeItem('projectData');
                    window.location.href = 'payment-success.html';
                }, 2000);
            }
        } catch (error) {
            showPaymentMessage('An error occurred. Please try again.');
            setPaymentLoading(false);
        }
    });
}

async function sendProjectData(formData) {
    // Send project data to your server
    // This is where you'd integrate with your backend to store the project details
    try {
        const response = await fetch('https://raphael-portfolio-backend.raphael-devworkersdev.workers.dev/api/submit-project', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        return await response.json();
    } catch (error) {
        console.error('Error sending project data:', error);
        // For demo, we'll just log it
        console.log('Project data:', formData);
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
