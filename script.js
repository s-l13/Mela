// Game state
let clickCount = 0;
const annoyancesNeeded = 5;
let currentButton = null;
const gameArea = document.getElementById('game-area');

// DOM Elements
const successMessage = document.getElementById('success-message');
const clickSound = document.getElementById('click-sound');
const successSound = document.getElementById('success-sound');

// Arabic messages for the button
const buttonMessages = [
    'ايلاف اضغطي هنا',
    'ميلا هنا',
    '!ماتشوفي ايلاف هنا',
    'الزر هنا يالحبيب',
    'ميلااا',
    'بسرعة قبل تروح عليك',
    'هنا الزر يابابا',
    'اضغطي بسرعة',
    'هنا الزر الحقيقي',
    'يلا بينا اضغطي'
];

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded!');
    
    // Log success message element for debugging
    console.log('Success message element:', successMessage);
    
    // Hide game area and success message initially
    if (successMessage) {
        console.log('Hiding success message initially');
        successMessage.style.display = 'none'; // Ensure it's not displayed
        successMessage.style.opacity = '0';
    }
    
    // Start the game
    createButton();
    
    // Set up play again button
    const playAgainBtn = document.getElementById('play-again');
    if (playAgainBtn) {
        console.log('Play again button found');
        playAgainBtn.addEventListener('click', resetGame);
    }
    
    // Add test success button
    const testSuccessBtn = document.getElementById('test-success');
    if (testSuccessBtn) {
        console.log('Test success button found');
        testSuccessBtn.addEventListener('click', function() {
            console.log('Test success button clicked');
            showSuccess();
        });
    }
    
    // Check for image load
    checkImage();
    
    // Make sure success message is initially hidden with our CSS, not inline styles
    if (successMessage) {
        successMessage.style.display = ''; // Remove inline display:none
    }
    
    // Debug: Add a test button to manually show success message
    const testButton = document.createElement('button');
    testButton.textContent = 'Test Success Message';
    testButton.style.position = 'fixed';
    testButton.style.top = '10px';
    testButton.style.right = '10px';
    testButton.style.zIndex = '9999';
    testButton.onclick = showSuccess;
    document.body.appendChild(testButton);
});

// Create a new button
function createButton() {
    console.log('Creating new button...');
    
    // Remove existing button if any
    if (currentButton && currentButton.parentNode) {
        gameArea.removeChild(currentButton);
    }
    
    // Create new button
    currentButton = document.createElement('button');
    currentButton.className = 'annoying-button';
    currentButton.textContent = getRandomMessage();
    
    // Position the button randomly
    positionButton(currentButton);
    
    // Add event listeners
    currentButton.addEventListener('mouseover', handleButtonHover);
    currentButton.addEventListener('click', handleButtonClick);
    
    // For touch devices
    currentButton.addEventListener('touchstart', handleButtonClick, { passive: false });
    
    // Add to game area
    gameArea.appendChild(currentButton);
}

// Position button randomly within game area
function positionButton(button) {
    if (!button || !gameArea) return;
    
    const maxX = gameArea.clientWidth - button.offsetWidth;
    const maxY = gameArea.clientHeight - button.offsetHeight;
    
    // Ensure button stays within bounds
    const randomX = Math.max(0, Math.min(maxX, Math.random() * maxX));
    const randomY = Math.max(0, Math.min(maxY, Math.random() * maxY));
    
    button.style.position = 'absolute';
    button.style.left = `${randomX}px`;
    button.style.top = `${randomY}px`;
    
    // Add a little animation
    button.style.transition = 'all 0.3s ease';
    
    // Random rotation for fun
    const rotation = (Math.random() * 20) - 10; // -10 to 10 degrees
    button.style.transform = `rotate(${rotation}deg)`;
}

// Handle button hover (move the button)
function handleButtonHover() {
    if (currentButton) {
        positionButton(currentButton);
        currentButton.textContent = getRandomMessage();
    }
}

// Handle button click
function handleButtonClick(e) {
    console.log('Button clicked!');
    
    // Prevent default to avoid any unwanted behavior
    e.preventDefault();
    e.stopPropagation();
    
    // Play click sound
    if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(e => console.log('Sound error:', e));
    }
    
    // Update click counter
    clickCount++;
    const clickCounter = document.getElementById('clicks');
    if (clickCounter) {
        clickCounter.textContent = clickCount;
    }
    
    // Add animation class
    if (currentButton) {
        currentButton.classList.add('clicked');
        
        // Remove the class after animation completes
        setTimeout(() => {
            if (currentButton) {
                currentButton.classList.remove('clicked');
            }
        }, 300);
    }
    
    // Check if we've reached the target
    console.log('Click count:', clickCount, 'Needed:', annoyancesNeeded);
    if (clickCount >= annoyancesNeeded) {
        console.log('Win condition met! Showing success message...');
        // Show success message
        showSuccess();
    } else {
        // Move the button
        createButton();
    }
}

// Show success message
function showSuccess() {
    console.log('Showing success message');
    
    // Hide the button
    if (currentButton && currentButton.parentNode) {
        gameArea.removeChild(currentButton);
        currentButton = null;
    }
    
    // Get elements
    const successMessage = document.getElementById('success-message');
    const successImage = document.getElementById('success-image');
    
    if (!successMessage) {
        console.error('Success message element not found!');
        return;
    }
    
    console.log('Success message element found');
    
    // Reset any inline styles
    successMessage.style = '';
    
    // Show the message with a slight delay to ensure CSS is applied
    setTimeout(() => {
        successMessage.classList.add('visible');
        
        // Force image reload with cache busting
        if (successImage) {
            console.log('Success image found');
            const timestamp = new Date().getTime();
            successImage.style.display = 'block';
            successImage.style.maxWidth = '100%';
            successImage.style.height = 'auto';
            successImage.src = './success-imagee.jpg' + '?t=' + timestamp;
            
            // Add error handling for the image
            successImage.onerror = function() {
                console.error('Failed to load image:', this.src);
                // Fallback to the online version if local fails
                this.src = 'https://i.imgur.com/7D3eAa3.png';
            };
        }
        
        // Play success sound
        try {
            const audio = new Audio('https://www.soundjay.com/human/sounds/applause-8.mp3');
            audio.volume = 0.5;
            audio.play().catch(e => console.log('Could not play sound:', e));
        } catch (e) {
            console.log('Error playing sound:', e);
        }
        
        // Create celebration effects
        createBalloons(10);
        createConfetti();
    }, 50);
}

// Reset the game
function resetGame() {
    console.log('Resetting game...');
    
    // Reset counters
    clickCount = 0;
    const clickCounter = document.getElementById('clicks');
    if (clickCounter) {
        clickCounter.textContent = '0';
    }
    
    // Hide success message
    const successMessage = document.getElementById('success-message');
    if (successMessage) {
        successMessage.style.opacity = '0';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 500);
    }
    
    // Clear any existing buttons
    while (gameArea && gameArea.firstChild) {
        gameArea.removeChild(gameArea.firstChild);
    }
    
    // Clear any existing balloons and confetti
    document.querySelectorAll('.balloon, .confetti').forEach(el => el.remove());
    
    // Start a new game
    if (gameArea) {
        createButton();
    }
    
    // Play a click sound
    try {
        const clickSound = new Audio('https://www.soundjay.com/buttons/button-09a.mp3');
        clickSound.volume = 0.3;
        clickSound.play().catch(e => console.log('Could not play click sound:', e));
    } catch (e) {
        console.log('Error playing click sound:', e);
    }
}

// Check if success image is loaded
function checkImage() {
    const successImage = document.getElementById('success-image');
    if (!successImage) return;
    
    console.log('Image element found, checking load status');
    
    // Set up load handler
    successImage.onload = function() {
        console.log('Image loaded successfully');
        this.style.opacity = '1';
    };
    
    // Set up error handler
    successImage.onerror = function() {
        console.error('Failed to load image');
        // Fallback to a different image if needed
        this.src = 'https://via.placeholder.com/500x300?text=Love+You';
    };
    
    // If image is already loaded, trigger the load handler
    if (successImage.complete) {
        console.log('Image already loaded');
        successImage.onload();
    }
}

// Play sound effect
function playSound(sound) {
    if (!sound) return;
    
    // Create a new audio element each time to avoid CORS and autoplay issues
    const audio = new Audio(sound.src);
    audio.volume = 0.5; // Lower the volume
    
    // Try to play the sound
    const playPromise = audio.play();
    
    // Handle promise in case autoplay is blocked
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('Sound play failed, will play on next interaction:', error);
            // Store the audio to play on next interaction
            const playOnInteraction = () => {
                audio.play().catch(e => console.log('Fallback play failed:', e));
                document.removeEventListener('click', playOnInteraction);
                document.removeEventListener('touchstart', playOnInteraction);
            };
            document.addEventListener('click', playOnInteraction, { once: true });
            document.addEventListener('touchstart', playOnInteraction, { once: true });
        });
    }
}

// Create floating balloons
function createBalloons(count) {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffcc5c', '#ff6f69'];
    const gameContainer = document.querySelector('.game-container');
    
    for (let i = 0; i < count; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.background = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.left = Math.random() * 100 + 'vw';
        balloon.style.animationDuration = (Math.random() * 5 + 5) + 's';
        balloon.style.animationDelay = (Math.random() * 3) + 's';
        
        // Add balloon string
        const string = document.createElement('div');
        string.className = 'balloon-string';
        balloon.appendChild(string);
        
        gameContainer.appendChild(balloon);
        
        // Remove balloon after animation
        setTimeout(() => {
            balloon.remove();
        }, 10000);
    }
}

// Create confetti effect
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffcc5c', '#ff6f69'];
    const gameContainer = document.querySelector('.game-container');
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.animationDelay = (Math.random() * 0.5) + 's';
        
        gameContainer.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Helper function to get a random message
function getRandomMessage() {
    return buttonMessages[Math.floor(Math.random() * buttonMessages.length)];
}

// Prevent default touch behavior to prevent scrolling/zooming
function preventDefault(e) {
    e.preventDefault();
}

// Disable touch actions that could interfere with the game
document.addEventListener('touchmove', preventDefault, { passive: false });

// Add test button for debugging
const testButton = document.createElement('button');
testButton.textContent = 'Test Success Message';
testButton.style.position = 'fixed';
testButton.style.top = '10px';
testButton.style.right = '10px';
testButton.style.zIndex = '9999';
testButton.style.padding = '10px';
testButton.style.background = '#4CAF50';
testButton.style.color = 'white';
testButton.style.border = 'none';
testButton.style.borderRadius = '5px';
testButton.style.cursor = 'pointer';
testButton.onclick = showSuccess;
document.body.appendChild(testButton);
