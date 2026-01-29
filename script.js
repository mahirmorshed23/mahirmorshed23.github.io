
// Scroll reveal animation
const reveals = document.querySelectorAll('.reveal');

function revealOnScroll() {
    const trigger = window.innerHeight * 0.85;
    reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < trigger) {
        el.classList.add('active');
    }
    });
}

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();





const words = ["AI/ML Engineer", "Software Developer", "App Developer"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeTarget = document.getElementById("typewriter");

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typeTarget.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typeTarget.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 10 : 90;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at the end of the word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 400;
        }

        setTimeout(type, typeSpeed);
    }

    // Initialize the typing effect
    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(type, 1000);
    });
