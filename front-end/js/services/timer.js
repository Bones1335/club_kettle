export class WorkoutTimer {
    constructor(options = {}) {
        this.totalSeconds = 0;
        this.currentSeconds = 0;
        this.intervalId = null;
        this.isRunning = false;
        this.isPaused = false;
        
        this.onTick = options.onTick || (() => {});
        this.onComplete = options.onComplete || (() => {});
        this.onStart = options.onStart || (() => {});
        this.onPause = options.onPause || (() => {});
        this.onReset = options.onReset || (() => {});
    }
    
    setDuration(seconds) {
        if (this.isRunning) {
            console.warn('Cannot set duration while timer is running');
            return false;
        }
        this.totalSeconds = seconds;
        this.currentSeconds = seconds;
        this.onTick(this.currentSeconds, this.totalSeconds);
        return true;
    }
    
    setFromWorkout(workout) {
        // Assuming workout has a duration property in minutes
        const durationInSeconds = workout.total_duration * 60;
        return this.setDuration(durationInSeconds);
    }
    
    start() {
        if (this.currentSeconds <= 0) {
            console.warn('Timer duration must be greater than 0');
            return false;
        }
        
        if (this.isRunning) {
            console.warn('Timer is already running');
            return false;
        }
        
        this.isRunning = true;
        this.isPaused = false;
        this.onStart(this.currentSeconds, this.totalSeconds);
        
        this.intervalId = setInterval(() => {
            this.currentSeconds--;
            this.onTick(this.currentSeconds, this.totalSeconds);
            
            if (this.currentSeconds <= 0) {
                this.complete();
            }
        }, 1000);
        
        return true;
    }
    
    pause() {
        if (!this.isRunning || this.isPaused) {
            return false;
        }
        
        clearInterval(this.intervalId);
        this.isRunning = false;
        this.isPaused = true;
        this.onPause(this.currentSeconds, this.totalSeconds);
        return true;
    }
    
    resume() {
        if (!this.isPaused) {
            return false;
        }
        
        this.isPaused = false;
        return this.start();
    }
    
    reset() {
        clearInterval(this.intervalId);
        this.isRunning = false;
        this.isPaused = false;
        this.currentSeconds = this.totalSeconds;
        this.onReset(this.currentSeconds, this.totalSeconds);
        return true;
    }
    
    complete() {
        clearInterval(this.intervalId);
        this.isRunning = false;
        this.isPaused = false;
        this.currentSeconds = 0;
        this.onComplete();
    }
    
    getState() {
        return {
            totalSeconds: this.totalSeconds,
            currentSeconds: this.currentSeconds,
            isRunning: this.isRunning,
            isPaused: this.isPaused,
        };
    }
    
    static formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

 export class WorkoutTimerUI {
    constructor(containerElement, timer) {
        this.container = containerElement;
        this.timer = timer;
        this.elements = {};
        
        this.render();
        this.bindEvents();
    }
    
    render() {
        this.container.innerHTML = `
            <div class="workout-timer">
                <div class="timer-display" data-element="display">00:00</div>
                <div class="timer-controls">
                    <button type="button" data-element="startBtn" class="btn-start">Start</button>
                    <button type="button" data-element="pauseBtn" class="btn-pause" disabled>Pause</button>
                    <button type="button" data-element="resetBtn" class="btn-reset">Reset</button>
                </div>
            </div>
        `;
        
        this.elements = {
            display: this.container.querySelector('[data-element="display"]'),
            startBtn: this.container.querySelector('[data-element="startBtn"]'),
            pauseBtn: this.container.querySelector('[data-element="pauseBtn"]'),
            resetBtn: this.container.querySelector('[data-element="resetBtn"]'),
        };
    }
    
    bindEvents() {
        this.elements.startBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.timer.isPaused) {
                this.timer.resume();
            } else {
                this.timer.start();
            }
        });
        
        this.elements.pauseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.timer.pause();
        });
        
        this.elements.resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.timer.reset();
        });
    }
    
    updateDisplay(currentSeconds, totalSeconds) {
        this.elements.display.textContent = WorkoutTimer.formatTime(currentSeconds);
    }
    
    updateControls(isRunning, isPaused) {
        this.elements.startBtn.disabled = isRunning && !isPaused;
        this.elements.pauseBtn.disabled = !isRunning;
        
        if (isPaused) {
            this.elements.startBtn.textContent = 'Resume';
        } else {
            this.elements.startBtn.textContent = 'Start';
        }
    }
}

export function initializeWorkoutTimer(containerElement, workout) {
    let ui;
    const timer = new WorkoutTimer({
        onTick: (currentSeconds, totalSeconds) => {
            if (ui) ui.updateDisplay(currentSeconds, totalSeconds);
        },
        onStart: (currentSeconds, totalSeconds) => {
            if (ui) ui.updateControls(true, false);
            // console.log(`Workout "${workout.name}" started!`);
        },
        onPause: (currentSeconds, totalSeconds) => {
            if (ui) ui.updateControls(false, true);
            // console.log('Workout paused');
        },
        onReset: (currentSeconds, totalSeconds) => {
            if (ui) {
                ui.updateControls(false, false);
                ui.updateDisplay(currentSeconds, totalSeconds);
            }
            // console.log('Workout reset');
        },
        onComplete: () => {
            if (ui) ui.updateControls(false, false);
            // console.log(`Workout "${workout.name}" completed! Great job! 🎉`);
        }
    });
    
    timer.setFromWorkout(workout);
    
    ui = new WorkoutTimerUI(containerElement, timer);
    
    const state = timer.getState();
    ui.updateDisplay(state.currentSeconds, state.totalSeconds);
    ui.updateControls(state.isRunning, state.isPaused);
    
    return { timer, ui };
}