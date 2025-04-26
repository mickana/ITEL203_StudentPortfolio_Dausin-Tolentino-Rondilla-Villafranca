function scrollPortfolio(direction) {
    const grid = document.querySelector('.portfolio-grid');
    const scrollAmount = 400; // Adjust scroll distance as needed
    
    if (direction === 'left') {
        grid.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    } else {
        grid.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
}

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        scrollPortfolio('left');
    } else if (e.key === 'ArrowRight') {
        scrollPortfolio('right');
    }
});

// Add touch swipe support
let touchStartX = 0;
const grid = document.querySelector('.portfolio-grid');

grid.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

grid.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const difference = touchStartX - touchEndX;

    if (Math.abs(difference) > 50) { // Minimum swipe distance
        if (difference > 0) {
            scrollPortfolio('right');
        } else {
            scrollPortfolio('left');
        }
    }
});

// Make lanyards draggable
document.querySelectorAll('.lanyard-container').forEach(container => {
    const lanyard = container.querySelector('.lanyard');
    let isDragging = false;
    let currentX, currentY, initialX, initialY;
    let xOffset = 0;
    let yOffset = 0;

    container.addEventListener('mousedown', dragStart);
    container.addEventListener('mousemove', drag);
    container.addEventListener('mouseup', dragEnd);
    container.addEventListener('mouseleave', dragEnd);

    // Touch events
    container.addEventListener('touchstart', dragStart);
    container.addEventListener('touchmove', drag);
    container.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        if (e.type === 'touchstart') {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }

        if (e.target === lanyard) {
            isDragging = true;
            lanyard.classList.add('dragging');
            // Remove any existing transition
            lanyard.style.transition = 'none';
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();

            if (e.type === 'touchmove') {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            xOffset = currentX;
            yOffset = currentY;

            // Limit the movement range
            const maxMove = 50;
            const limitedX = Math.max(Math.min(currentX, maxMove), -maxMove);
            const limitedY = Math.max(Math.min(currentY, maxMove), -maxMove);

            // Apply the transform with some rotation based on movement
            const rotateX = limitedY * 0.5;
            const rotateY = -limitedX * 0.5;
            
            lanyard.style.transform = `
                translate(${limitedX}px, ${limitedY}px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
            `;
        }
    }

    function dragEnd() {
        if (isDragging) {
            // Generate random direction and distance
            const randomAngle = Math.random() * Math.PI * 2;
            const randomDistance = Math.random() * 100 + 50; // 50-150px
            const randomX = Math.cos(randomAngle) * randomDistance;
            const randomY = Math.sin(randomAngle) * randomDistance;
            
            // Add random rotation
            const randomRotateX = (Math.random() - 0.5) * 30;
            const randomRotateY = (Math.random() - 0.5) * 30;
            
            // Apply the random movement
            lanyard.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            lanyard.style.transform = `
                translate(${randomX}px, ${randomY}px)
                rotateX(${randomRotateX}deg)
                rotateY(${randomRotateY}deg)
            `;
            
            // Return to original position after a delay
            setTimeout(() => {
                lanyard.style.transition = 'transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                lanyard.style.transform = 'translate(0, 0) rotateX(0) rotateY(0)';
            }, 500);

            isDragging = false;
            lanyard.classList.remove('dragging');
        }
    }

    // Add swing on hover
    container.addEventListener('mouseenter', () => {
        if (!isDragging) {
            lanyard.style.transition = 'transform 0.3s ease-out';
            lanyard.style.transform = 'rotate(-5deg)';
        }
    });

    container.addEventListener('mouseleave', () => {
        if (!isDragging) {
            lanyard.style.transition = 'transform 0.3s ease-out';
            lanyard.style.transform = 'rotate(0deg)';
        }
    });
});

// Update the DOMContentLoaded event handler
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.id-card');
    
    cards.forEach((card, index) => {
        // Start rotation animation after drop animation completes
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease-out';
            card.classList.add('dropped');
        }, (index * 600) + 2500);
        
        // Add subtle random delay to lanyard swing
        const lanyard = card.querySelector('.lanyard-container');
        lanyard.style.animationDelay = `${(index * 0.2) + Math.random()}s`;
    });
});

// Create floating particles
function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size between 2-6px
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random starting position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random animation duration between 10-20s
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
        
        // Random delay
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', createParticles);

// Add ripple effect to buttons
document.querySelectorAll('.view-portfolio').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = e.clientX - rect.left - size/2 + 'px';
        ripple.style.top = e.clientY - rect.top - size/2 + 'px';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Update the button HTML structure
document.querySelectorAll('.view-portfolio').forEach(button => {
    const text = button.textContent.trim();
    button.innerHTML = `<span>${text}</span>`;
});

// Make ID cards draggable
document.querySelectorAll('.id-card').forEach(card => {
    let isDragging = false;
    let startX, startY, currentX, currentY;
    let initialTransform = '';
    let dragStartTime;
    let lastX, lastY;
    let velocityX = 0;
    let velocityY = 0;

    // Add event listeners to the card itself
    card.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    // Touch events
    card.addEventListener('touchstart', dragStart);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        e.preventDefault();
        isDragging = true;
        card.classList.add('dragging');
        dragStartTime = Date.now();
        
        // Store initial transform
        initialTransform = window.getComputedStyle(card).transform;
        
        if (e.type === 'touchstart') {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        } else {
            startX = e.clientX;
            startY = e.clientY;
        }

        // Reset positions and velocity
        currentX = 0;
        currentY = 0;
        lastX = startX;
        lastY = startY;
        velocityX = 0;
        velocityY = 0;
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();

        let clientX, clientY;
        if (e.type === 'touchmove') {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        // Calculate velocity
        const deltaTime = Date.now() - dragStartTime;
        if (deltaTime > 0) {
            velocityX = (clientX - lastX) / deltaTime;
            velocityY = (clientY - lastY) / deltaTime;
        }

        // Update last position
        lastX = clientX;
        lastY = clientY;

        // Calculate new position
        currentX = clientX - startX;
        currentY = clientY - startY;
        
        // Remove any existing transition during drag
        card.style.transition = 'none';
        
        // Apply translation with some rotation based on movement
        const rotateX = currentY * 0.1;
        const rotateY = -currentX * 0.1;
        card.style.transform = `
            translate(${currentX}px, ${currentY}px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
        `;
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        card.classList.remove('dragging');

        // Calculate final velocity
        const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
        const direction = Math.atan2(velocityY, velocityX);
        
        // Generate random direction with velocity influence
        const randomAngle = direction + (Math.random() - 0.5) * Math.PI;
        const randomDistance = Math.min(speed * 800, 1000); // Increased maximum distance
        
        const randomX = Math.cos(randomAngle) * randomDistance;
        const randomY = Math.sin(randomAngle) * randomDistance;
        
        // Add dramatic random rotation
        const randomRotateX = (Math.random() - 0.5) * 720; // Increased rotation
        const randomRotateY = (Math.random() - 0.5) * 720;
        const randomRotateZ = (Math.random() - 0.5) * 720;
        
        // Apply the random movement with faster transition
        card.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        card.style.transform = `
            translate(${randomX}px, ${randomY}px)
            rotateX(${randomRotateX}deg)
            rotateY(${randomRotateY}deg)
            rotateZ(${randomRotateZ}deg)
        `;
        
        // Return to original position after a delay
        setTimeout(() => {
            card.style.transition = 'transform 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            card.style.transform = 'translate(0, 0) rotateX(0) rotateY(0) rotateZ(0)';
        }, 2000);
    }
});

// Add JavaScript for theme toggle
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const button = document.querySelector('.theme-toggle');
    button.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
}

// Add click event to flip cards
document.querySelectorAll('.id-card').forEach(card => {
    card.addEventListener('click', function(e) {
        // Don't flip if clicking on the view portfolio link
        if (e.target.closest('.view-portfolio')) {
            return;
        }
        
        const cardElement = this.querySelector('.card');
        cardElement.style.transform = cardElement.style.transform === 'rotateY(180deg)' 
            ? 'rotateY(0deg)' 
            : 'rotateY(180deg)';
    });
});