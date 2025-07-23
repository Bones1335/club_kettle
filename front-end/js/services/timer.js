// Get DOM elements
const minutesInput = document.getElementById('minutes');
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

let countdown;
let totalSeconds = 0;
let isPaused = true;

// Format time to display minutes and seconds (MM:SS)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Update timer display
function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(totalSeconds);
}

// Start the countdown
function startTimer() {
    if (isPaused) {
        // If starting from input, get minutes from input
        if (totalSeconds === 0) {
            const minutes = parseInt(minutesInput.value) || 0;
            totalSeconds = minutes * 60;
            updateTimerDisplay();
        }
        
        // Don't start if timer is already at zero
        if (totalSeconds <= 0) {
            return;
        }
        
        isPaused = false;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        minutesInput.disabled = true;
        
        countdown = setInterval(() => {
            totalSeconds--;
            updateTimerDisplay();
            
            if (totalSeconds <= 0) {
                clearInterval(countdown);
                pauseBtn.disabled = true;
                startBtn.disabled = true;
                minutesInput.disabled = false;
            }
        }, 1000);
    }
}

// Pause the countdown
function pauseTimer() {
    if (!isPaused) {
        clearInterval(countdown);
        isPaused = true;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        startBtn.textContent = 'Resume';
    }
}

// Reset the countdown
function resetTimer() {
    clearInterval(countdown);
    isPaused = true;
    totalSeconds = 0;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    minutesInput.disabled = false;
    startBtn.textContent = 'Start';
    
    const minutes = parseInt(minutesInput.value) || 0;
    timerDisplay.textContent = formatTime(minutes * 60);
}

// Initialize timer display
resetTimer();

// Event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Update display when input changes
minutesInput.addEventListener('input', function() {
    const minutes = parseInt(this.value) || 0;
    timerDisplay.textContent = formatTime(minutes * 60);
});