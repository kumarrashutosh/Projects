class TypingTest {
    constructor() {
        this.texts = {
            easy: [
                "The quick brown fox jumps over the lazy dog. This is a simple sentence to test your typing speed.",
                "A warm sunny day makes everyone happy. Birds sing in the trees and flowers bloom in the garden.",
                "Reading books is a great way to learn new things. It opens your mind to different worlds and ideas."
            ],
            medium: [
                "Technology has revolutionized the way we communicate and work. From smartphones to artificial intelligence, innovation continues to shape our future in remarkable ways.",
                "Environmental conservation is crucial for sustainable development. We must balance economic growth with ecological preservation to ensure a healthy planet for future generations.",
                "The art of programming requires patience, logic, and creativity. Developers solve complex problems by breaking them down into smaller, manageable components."
            ],
            hard: [
                "Quantum mechanics challenges our fundamental understanding of reality through phenomena like superposition and entanglement. These principles form the foundation for emerging technologies such as quantum computing and cryptography.",
                "Neuroplasticity demonstrates the brain's remarkable ability to reorganize itself throughout life. This adaptability enables learning, recovery from injury, and the formation of new neural pathways in response to experience.",
                "Cryptocurrency represents a paradigm shift in financial systems, utilizing blockchain technology to create decentralized, immutable ledgers that eliminate the need for traditional intermediaries."
            ]
        };
        
        this.currentText = '';
        this.currentIndex = 0;
        this.startTime = null;
        this.endTime = null;
        this.timeLimit = 60;
        this.timer = null;
        this.isTestActive = false;
        this.errors = 0;
        this.correctChars = 0;
        this.totalCharsTyped = 0;
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadNewText();
    }
    
    initializeElements() {
        this.textDisplay = document.getElementById('textDisplay');
        this.typingInput = document.getElementById('typingInput');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.difficultySelect = document.getElementById('difficulty');
        this.wpmDisplay = document.getElementById('wpm');
        this.accuracyDisplay = document.getElementById('accuracy');
        this.timerDisplay = document.getElementById('timer');
        this.errorsDisplay = document.getElementById('errors');
        this.progressBar = document.getElementById('progress');
        this.results = document.getElementById('results');
    }
    
    attachEventListeners() {
        this.startBtn.addEventListener('click', () => this.startTest());
        this.resetBtn.addEventListener('click', () => this.resetTest());
        this.typingInput.addEventListener('input', (e) => this.handleInput(e));
        this.typingInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.difficultySelect.addEventListener('change', () => this.loadNewText());
        
        // Prevent paste
        this.typingInput.addEventListener('paste', (e) => e.preventDefault());
    }
    
    handleKeyDown(e) {
        if (!this.isTestActive) return;
        
        // Allow normal backspace functionality
        // Remove the backspace prevention that was causing issues
    }
    
    loadNewText() {
        const difficulty = this.difficultySelect.value;
        const texts = this.texts[difficulty];
        this.currentText = texts[Math.floor(Math.random() * texts.length)];
        this.displayText();
        this.resetStats();
    }
    
    displayText() {
        this.textDisplay.innerHTML = this.currentText
            .split('')
            .map((char, index) => `<span class="char" data-index="${index}">${char}</span>`)
            .join('');
    }
    
    startTest() {
        this.isTestActive = true;
        this.startTime = Date.now();
        this.typingInput.disabled = false;
        this.typingInput.value = '';
        this.typingInput.focus();
        this.startBtn.disabled = true;
        this.textDisplay.classList.add('active');
        this.currentIndex = 0;
        this.startTimer();
        this.updateCurrentChar();
    }
    
    startTimer() {
        let timeLeft = this.timeLimit;
        this.timerDisplay.textContent = timeLeft;
        
        this.timer = setInterval(() => {
            timeLeft--;
            this.timerDisplay.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                this.endTest();
            }
        }, 1000);
    }
    
    handleInput(e) {
        if (!this.isTestActive) return;
        
        const inputValue = e.target.value;
        
        this.currentIndex = inputValue.length;
        this.updateCharacterColors(inputValue);
        this.updateStats();
        this.updateProgress();
        this.updateCurrentChar();
        
        // Check if test is complete
        if (inputValue.length === this.currentText.length) {
            this.endTest();
        }
    }
    
    updateCharacterColors(inputValue) {
        const chars = this.textDisplay.querySelectorAll('.char');
        
        chars.forEach((char, index) => {
            char.classList.remove('correct', 'incorrect', 'current');
            
            if (index < inputValue.length) {
                if (inputValue[index] === this.currentText[index]) {
                    char.classList.add('correct');
                } else {
                    char.classList.add('incorrect');
                }
            }
        });
    }
    
    updateCurrentChar() {
        const chars = this.textDisplay.querySelectorAll('.char');
        chars.forEach(char => char.classList.remove('current'));
        
        if (this.currentIndex < chars.length) {
            chars[this.currentIndex].classList.add('current');
        }
    }
    
    updateStats() {
        const inputValue = this.typingInput.value;
        const timeElapsed = (Date.now() - this.startTime) / 1000 / 60; // in minutes
        
        // Calculate errors
        this.errors = 0;
        this.correctChars = 0;
        
        for (let i = 0; i < inputValue.length; i++) {
            if (inputValue[i] === this.currentText[i]) {
                this.correctChars++;
            } else {
                this.errors++;
            }
        }
        
        this.totalCharsTyped = inputValue.length;
        
        // Calculate WPM (assuming 5 characters per word)
        const wpm = Math.round((this.correctChars / 5) / Math.max(timeElapsed, 0.01));
        
        // Calculate accuracy
        const accuracy = this.totalCharsTyped > 0 ? 
            Math.round((this.correctChars / this.totalCharsTyped) * 100) : 100;
        
        this.wpmDisplay.textContent = Math.max(0, wpm);
        this.accuracyDisplay.textContent = accuracy;
        this.errorsDisplay.textContent = this.errors;
    }
    
    updateProgress() {
        const progress = (this.currentIndex / this.currentText.length) * 100;
        this.progressBar.style.width = `${progress}%`;
    }
    
    endTest() {
        this.isTestActive = false;
        this.endTime = Date.now();
        this.typingInput.disabled = true;
        this.startBtn.disabled = false;
        this.textDisplay.classList.remove('active');
        
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.showResults();
        
        // Remove current character highlight
        const chars = this.textDisplay.querySelectorAll('.char');
        chars.forEach(char => char.classList.remove('current'));
    }
    
    showResults() {
        const timeElapsed = Math.max((this.endTime - this.startTime) / 1000 / 60, 0.01); // in minutes
        const wpm = Math.round((this.correctChars / 5) / timeElapsed);
        const accuracy = this.totalCharsTyped > 0 ? 
            Math.round((this.correctChars / this.totalCharsTyped) * 100) : 100;
        
        document.getElementById('finalWpm').textContent = Math.max(0, wpm);
        document.getElementById('finalAccuracy').textContent = accuracy + '%';
        document.getElementById('finalErrors').textContent = this.errors;
        document.getElementById('finalChars').textContent = this.totalCharsTyped;
        
        this.results.classList.add('show');
    }
    
    resetTest() {
        this.isTestActive = false;
        this.currentIndex = 0;
        this.startTime = null;
        this.endTime = null;
        this.typingInput.value = '';
        this.typingInput.disabled = true;
        this.startBtn.disabled = false;
        this.textDisplay.classList.remove('active');
        this.results.classList.remove('show');
        
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.loadNewText();
    }
    
    resetStats() {
        this.errors = 0;
        this.correctChars = 0;
        this.totalCharsTyped = 0;
        this.wpmDisplay.textContent = '0';
        this.accuracyDisplay.textContent = '100';
        this.timerDisplay.textContent = this.timeLimit;
        this.errorsDisplay.textContent = '0';
        this.progressBar.style.width = '0%';
        
        // Clear character highlighting
        const chars = this.textDisplay.querySelectorAll('.char');
        if (chars.length > 0) {
            chars.forEach(char => char.classList.remove('correct', 'incorrect', 'current'));
        }
    }
}

// Initialize the typing test when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TypingTest();
});
