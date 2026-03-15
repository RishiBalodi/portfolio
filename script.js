// Script for portfolio interactivity

// Smooth scrolling for navigation
const links = document.querySelectorAll('a[href^="#"]');

links.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
});

// Active nav link on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let scrollPosition = window.scrollY;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + section.id) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Scroll reveal with intersection observer
const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        } else {
            entry.target.classList.remove('active');
        }
    });
});

revealElements.forEach(element => observer.observe(element));

// Tilt effects for data-tilt elements
const tiltElements = document.querySelectorAll('[data-tilt]');
Tilt.init(tiltElements);

// Education timeline card clicks
const timelineCards = document.querySelectorAll('.timeline-card');

timelineCards.forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
    });
});

// Neural network particle background animation with mouse interaction
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// Configure canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function drawParticles() {
    // Particle drawing logic goes here
}

function updateParticles() {
    // Particle update logic goes here
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateParticles();
    drawParticles();
    requestAnimationFrame(animate);
}

animate();

// Certificate modal open and close functionality
const certificateButtons = document.querySelectorAll('.certificate-button');
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.close-modal');

certificateButtons.forEach(button => {
    button.addEventListener('click', () => {
        modal.classList.add('open');
    });
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('open');
});

// Footer year auto-update
const footerYear = document.querySelector('.footer-year');
footerYear.textContent = new Date().getFullYear();