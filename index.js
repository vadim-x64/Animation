document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("magicButton");
    const valentineText = document.querySelector(".valentine-text");
    let isButtonAnimating = false;
    let isTextAnimating = false;
    let confettiAnimation = null;
    let currentMessageIndex = -1;
    let valentineMessages = [];

    async function loadMessages() {
        try {
            const response = await fetch('phrases.json');
            const data = await response.json();
            valentineMessages = data.messages;
            startMessageRotation();
        } catch (error) {
            console.error('Error loading messages:', error);
            valentineText.textContent = "Happy Valentine's Day! 💖";
        }
    }

    function getRandomMessage() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * valentineMessages.length);
        } while (newIndex === currentMessageIndex);
        currentMessageIndex = newIndex;
        return valentineMessages[newIndex];
    }

    async function typeText(text) {
        for (let i = 0; i < text.length; i++) {
            valentineText.textContent = text.substring(0, i + 1);
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    async function eraseText(text) {
        for (let i = text.length; i >= 0; i--) {
            valentineText.textContent = text.substring(0, i);
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    async function animateText(text) {
        if (isTextAnimating) return;
        isTextAnimating = true;
        valentineText.textContent = "";
        await typeText(text);
        await new Promise(resolve => setTimeout(resolve, 3000));
        await eraseText(text);
        await new Promise(resolve => setTimeout(resolve, 1000));
        isTextAnimating = false;
    }

    async function startMessageRotation() {
        while (true) {
            const message = getRandomMessage();
            await animateText(message);
        }
    }

    function createButton() {
        button.style.display = 'inline-block';
        button.style.opacity = '1';
        button.style.animation = 'buttonFadeIn 1s ease forwards, buttonPulse 3s ease-in-out infinite';
        button.style.pointerEvents = 'auto';
    }

    function launchConfetti() {
        if (confettiAnimation) {
            cancelAnimationFrame(confettiAnimation);
            confettiAnimation = null;
        }
        const canvas = document.getElementById("confetti-canvas");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const confetti = [];
        const colors = ["#FF85B3", "#FFCDD2", "#FFDAB9", "#FFB6C1", "#FFC0CB"];
        let isEnding = false;
        const loveIcon = new Image();
        loveIcon.src = 'resources/ico.png';
        for (let i = 0; i < 20; i++) {
            confetti.push({
                x: Math.random() * canvas.width,
                y: -20,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * (6 - 3) + 3,
                speedY: Math.random() * 3 + 2,
                speedX: Math.random() * 2 - 1,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() * 2 - 1) * 2,
                opacity: 1,
                type: 'circle'
            });
        }
        for (let i = 0; i < 10; i++) {
            confetti.push({
                x: Math.random() * canvas.width,
                y: -20,
                size: Math.random() * (30 - 15) + 15, // Random size between 15 and 30
                speedY: Math.random() * 2 + 1,
                speedX: Math.random() * 1.5 - 0.75,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() * 2 - 1) * 2,
                opacity: 1,
                type: 'icon'
            });
        }

        function drawConfetti() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let allGone = true;
            confetti.forEach((c) => {
                if (c.opacity <= 0) return;
                allGone = false;
                ctx.save();
                ctx.translate(c.x, c.y);
                ctx.rotate((c.rotation * Math.PI) / 180);
                if (isEnding) {
                    c.opacity = c.opacity || 1;
                    c.opacity -= 0.02;
                    ctx.globalAlpha = c.opacity;
                }
                if (c.type === 'circle') {
                    ctx.fillStyle = c.color;
                    ctx.beginPath();
                    ctx.arc(0, 0, c.size, 0, Math.PI * 2);
                    ctx.fill();
                } else if (c.type === 'icon' && loveIcon.complete) {
                    const size = c.size;
                    ctx.drawImage(loveIcon, -size/2, -size/2, size, size);
                }
                ctx.restore();
                c.y += c.speedY;
                c.x += c.speedX;
                c.rotation += c.rotationSpeed;
                if (c.y > canvas.height + 20) {
                    if (!isEnding) {
                        c.y = -20;
                        c.x = Math.random() * canvas.width;
                    }
                }
            });
            if (!allGone) {
                confettiAnimation = requestAnimationFrame(drawConfetti);
            } else {
                cancelAnimationFrame(confettiAnimation);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                confettiAnimation = null;
            }
        }
        confettiAnimation = requestAnimationFrame(drawConfetti);
        return {
            stop: () => {
                isEnding = true;
            }
        };
    }

    button.addEventListener("click", () => {
        if (isButtonAnimating) return;
        isButtonAnimating = true;
        button.style.animation = 'none';
        const confettiInstance = launchConfetti();
        button.style.opacity = '0';
        button.style.pointerEvents = 'none';
        const buttonRect = button.getBoundingClientRect();
        const particlesContainer = document.createElement('div');
        particlesContainer.style.position = 'fixed';
        particlesContainer.style.zIndex = '1000';
        particlesContainer.style.left = '0';
        particlesContainer.style.top = '0';
        document.body.appendChild(particlesContainer);
        const particles = [];
        const particleSize = 3;
        for (let i = 0; i < buttonRect.width; i += particleSize) {
            for (let j = 0; j < buttonRect.height; j += particleSize) {
                const particle = document.createElement('div');
                particle.className = 'button-particle';
                const x = buttonRect.left + i;
                const y = buttonRect.top + j;
                particle.style.left = `${x}px`;
                particle.style.top = `${y}px`;
                particle.style.width = `${particleSize}px`;
                particle.style.height = `${particleSize}px`;
                const angle = Math.random() * Math.PI * 2;
                const speed = 50 + Math.random() * 50;
                const tx = Math.cos(angle) * speed;
                const ty = Math.sin(angle) * speed;
                particle.style.setProperty('--tx', `${tx}px`);
                particle.style.setProperty('--ty', `${ty}px`);
                particlesContainer.appendChild(particle);
                particles.push(particle);
            }
        }
        particles.forEach(particle => {
            particle.style.animation = 'particleDispersion 0.8s ease-out forwards';
        });
        setTimeout(() => {
            particlesContainer.remove();
        }, 1000);
        setTimeout(() => {
            confettiInstance.stop();
            setTimeout(() => {
                button.style.display = 'inline-block';
                button.style.opacity = '0';
                void button.offsetWidth;
                button.style.animation = 'buttonFadeIn 1s ease forwards, buttonPulse 3s ease-in-out infinite';
                button.style.pointerEvents = 'auto';
                isButtonAnimating = false;
            }, 100);
        }, 10000);
    });
    createButton();
    loadMessages();
});