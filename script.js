// Game variables
let secretNumber;
let attempts = 0;
let scores = JSON.parse(localStorage.getItem('scores')) || [];
let gameActive = true;

// Initialize game
function initGame() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    gameActive = true;
    document.getElementById('guessInput').value = '';
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';
    document.getElementById('hint').textContent = '';
    document.getElementById('attempts').textContent = '0';
    document.getElementById('status').textContent = 'Guessing...';
    document.getElementById('guessInput').focus();
}

// Make a guess
function makeGuess() {
    if (!gameActive) return;
    
    const guessInput = document.getElementById('guessInput');
    const guess = parseInt(guessInput.value);
    
    // Validation
    if (isNaN(guess) || guess < 1 || guess > 100) {
        showFeedback('Please enter a number between 1 and 100', 'error');
        return;
    }
    
    attempts++;
    document.getElementById('attempts').textContent = attempts;
    
    // Check guess
    if (guess === secretNumber) {
        winGame();
    } else if (guess > secretNumber) {
        showFeedback(`❌ Too high! Try a lower number.`, 'too-high');
        document.getElementById('hint').textContent = `Hint: The number is between 1 and ${guess - 1}`;
    } else {
        showFeedback(`❌ Too low! Try a higher number.`, 'too-low');
        document.getElementById('hint').textContent = `Hint: The number is between ${guess + 1} and 100`;
    }
    
    guessInput.value = '';
    guessInput.focus();
}

// Win the game
function winGame() {
    gameActive = false;
    showFeedback(`🎉 You Won! The number was ${secretNumber}\nYou took ${attempts} attempt${attempts === 1 ? '' : 's'}!`, 'correct');
    document.getElementById('status').textContent = 'Won!';
    document.getElementById('hint').textContent = '';
    
    // Save score
    const score = {
        attempts: attempts,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
    };
    scores.push(score);
    scores.sort((a, b) => a.attempts - b.attempts);
    scores = scores.slice(0, 10); // Keep top 10
    localStorage.setItem('scores', JSON.stringify(scores));
    
    updateLeaderboard();
}

// Show feedback
function showFeedback(message, className) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.className = `feedback ${className}`;
}

// Reset game
function resetGame() {
    initGame();
}

// Update leaderboard
function updateLeaderboard() {
    const scoresDiv = document.getElementById('scores');
    
    if (scores.length === 0) {
        scoresDiv.innerHTML = '<p class="empty">Play to see scores!</p>';
        return;
    }
    
    scoresDiv.innerHTML = scores.map((score, index) => `
        <div class="score-item">
            <span>#${index + 1} - ${score.attempts} attempt${score.attempts === 1 ? '' : 's'}</span>
            <span>${score.date}</span>
        </div>
    `).join('');
}

// Allow Enter key to submit
document.addEventListener('DOMContentLoaded', function() {
    initGame();
    updateLeaderboard();
    
    const guessInput = document.getElementById('guessInput');
    guessInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            makeGuess();
        }
    });
});
