class PomodoroTimer {
    constructor() {
        this.timeLeft = 25 * 60; // 25 minutes in seconds
        this.isRunning = false;
        this.timerId = null;
        this.initialTime = 25 * 60;

        // Audio Context
        this.audioCtx = null;

        // DOM Elements
        this.display = document.getElementById('time-display');
        this.startBtn = document.getElementById('start-btn');
        this.startBtnText = this.startBtn.querySelector('.btn-text');
        this.resetBtn = document.getElementById('reset-btn');
        this.customInput = document.getElementById('custom-minutes');

        // Bind events
        this.startBtn.addEventListener('click', () => this.toggleTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        this.customInput.addEventListener('change', () => this.setCustomTime());
        this.customInput.addEventListener('input', () => {
            // Optional: Real-time update if validating input
        });

        this.updateDisplay();
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    updateDisplay() {
        this.display.textContent = this.formatTime(this.timeLeft);
        document.title = `${this.formatTime(this.timeLeft)} - Focus Flow`;
    }

    setCustomTime() {
        if (this.isRunning) return;

        const mins = parseInt(this.customInput.value);
        if (mins && mins > 0 && mins <= 120) {
            this.initialTime = mins * 60;
            this.timeLeft = this.initialTime;
            this.updateDisplay();
        } else {
            // Reset to valid default if clear or invalid
            if (this.customInput.value === '') return;
            this.customInput.value = Math.floor(this.initialTime / 60);
        }
    }

    toggleTimer() {
        if (this.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }

    startTimer() {
        // Initialize audio context on user interaction if needed
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        this.isRunning = true;
        this.startBtnText.textContent = 'Pause';
        this.display.classList.add('active');

        this.timerId = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
                this.updateDisplay();
            } else {
                this.playNotification();
                this.resetTimer(false); // Don't reset time effectively, just state
                // But we probably want to stop it at 00:00
                this.pauseTimer();
                this.timeLeft = 0;
                this.updateDisplay();
                this.startBtnText.textContent = 'Start Focus';
                // Maybe auto-reset after some time or let user see 00:00? 
                // Let's leave it at 00:00 and they hit reset to go back.
            }
        }, 1000);
    }

    pauseTimer() {
        this.isRunning = false;
        clearInterval(this.timerId);
        this.startBtnText.textContent = 'Resume';
        this.display.classList.remove('active');
    }

    resetTimer(fullReset = true) {
        this.isRunning = false;
        clearInterval(this.timerId);
        if (fullReset) {
            if (this.customInput.value && !isNaN(this.customInput.value)) {
                this.setCustomTime();
            } else {
                this.timeLeft = this.initialTime;
            }
            this.startBtnText.textContent = 'Start Focus';
        }
        this.display.classList.remove('active');
        this.updateDisplay();
    }

    playNotification() {
        if (!this.audioCtx) return;

        // "Ding" (High Note)
        const osc1 = this.audioCtx.createOscillator();
        const gain1 = this.audioCtx.createGain();

        osc1.connect(gain1);
        gain1.connect(this.audioCtx.destination);

        // E5 (659.25 Hz)
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(659.25, this.audioCtx.currentTime);

        gain1.gain.setValueAtTime(0, this.audioCtx.currentTime);
        gain1.gain.linearRampToValueAtTime(0.4, this.audioCtx.currentTime + 0.05);
        gain1.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 1.2);

        osc1.start(this.audioCtx.currentTime);
        osc1.stop(this.audioCtx.currentTime + 1.2);

        // "Dong" (Low Note) - delayed by 0.6s
        const osc2 = this.audioCtx.createOscillator();
        const gain2 = this.audioCtx.createGain();

        osc2.connect(gain2);
        gain2.connect(this.audioCtx.destination);

        // C5 (523.25 Hz) -> Major 3rd lower
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(523.25, this.audioCtx.currentTime + 0.6);

        gain2.gain.setValueAtTime(0, this.audioCtx.currentTime + 0.6);
        gain2.gain.linearRampToValueAtTime(0.4, this.audioCtx.currentTime + 0.65);
        gain2.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 2.5);

        osc2.start(this.audioCtx.currentTime + 0.6);
        osc2.stop(this.audioCtx.currentTime + 2.5);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const timer = new PomodoroTimer();
});
