// Word list with hints
const wordsWithHints = [
    { word: "apple", hint: "A common fruit that keeps the doctor away" },
    { word: "banana", hint: "A yellow curved fruit" },
    { word: "computer", hint: "An electronic device for processing data" },
    { word: "dolphin", hint: "An intelligent marine mammal" },
    { word: "elephant", hint: "The largest land animal with a trunk" },
    { word: "forest", hint: "A large area covered with trees" },
    { word: "guitar", hint: "A musical instrument with strings" },
    { word: "hospital", hint: "A place where sick people are treated" },
    { word: "internet", hint: "A global network of connected computers" },
    { word: "journey", hint: "An act of traveling from one place to another" },
    { word: "keyboard", hint: "Used to type on a computer" },
    { word: "language", hint: "A system of communication used by humans" },
    { word: "mountain", hint: "A large natural elevation of the earth's surface" },
    { word: "notebook", hint: "A small book with blank pages for writing" },
    { word: "octopus", hint: "A sea creature with eight arms" },
    { word: "penguin", hint: "A flightless bird that lives in cold regions" },
    { word: "quantum", hint: "Related to the smallest discrete unit of a phenomenon" },
    { word: "rainbow", hint: "A meteorological phenomenon with seven colors" },
    { word: "sunshine", hint: "Direct light from the sun" },
    { word: "telephone", hint: "A device used to talk to someone at a distance" }
];

// Keyboard keys
const KEYS = [
    "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
    "a", "s", "d", "f", "g", "h", "j", "k", "l",
    "z", "x", "c", "v", "b", "n", "m"
];

// Body parts in order they should appear
const BODY_PARTS = ["head", "body", "right-arm", "left-arm", "right-leg", "left-leg"];

// Game state
let currentWordObject = null;
let wordToGuess = "";
let currentHint = "";
let guessedLetters = [];
let hintUsed = false;
let hintsRemaining = 1; // Number of hints available per game

// Initialize game
function initGame() {
    // Select random word with hint
    currentWordObject = wordsWithHints[Math.floor(Math.random() * wordsWithHints.length)];
    wordToGuess = currentWordObject.word;
    currentHint = currentWordObject.hint;
    guessedLetters = [];
    hintUsed = false;
    hintsRemaining = 1;
    
    // Reset drawing - hide all body parts
    BODY_PARTS.forEach(part => {
        document.getElementById(part).style.display = "none";
    });

    // Update word display
    updateWordDisplay();
    
    // Reset hint display
    const hintDisplay = document.getElementById("hint-display");
    hintDisplay.textContent = "Click the button for a hint!";
    
    // Reset hint button
    const hintButton = document.getElementById("hint-button");
    hintButton.disabled = false;
    hintButton.textContent = "Get Hint";
    
    // Create keyboard if it doesn't exist
    createKeyboard();
    
    // Reset keyboard
    updateKeyboard();
}

// Create the keyboard
function createKeyboard() {
    const keyboardElement = document.getElementById("keyboard");
    
    // Only create keyboard once
    if (keyboardElement.children.length === 0) {
        KEYS.forEach(key => {
            const button = document.createElement("button");
            button.innerText = key;
            button.className = "btn";
            button.addEventListener("click", () => {
                addGuessedLetter(key);
            });
            keyboardElement.appendChild(button);
        });
    }
}

// Set up hint button
function setupHintButton() {
    const hintButton = document.getElementById("hint-button");
    hintButton.addEventListener("click", showHint);
}

// Show hint
function showHint() {
    if (hintsRemaining <= 0) return;
    
    const hintDisplay = document.getElementById("hint-display");
    hintDisplay.textContent = currentHint;
    
    // Disable hint button
    const hintButton = document.getElementById("hint-button");
    hintButton.disabled = true;
    hintButton.textContent = "Hint Used";
    
    // Mark hint as used
    hintUsed = true;
    hintsRemaining--;
}

// Add guessed letter
function addGuessedLetter(letter) {
    if (guessedLetters.includes(letter)) return;
    
    guessedLetters.push(letter);
    updateWordDisplay();
    updateKeyboard();
    updateHangmanDrawing();
    checkGameEnd();
}

// Update word display
function updateWordDisplay() {
    const wordElement = document.getElementById("hangman-word");
    wordElement.innerHTML = "";
    
    wordToGuess.split("").forEach(letter => {
        // Create container for letter
        const letterContainer = document.createElement("span");
        letterContainer.className = "letter-container";
        
        // Create span for the letter itself
        const letterSpan = document.createElement("span");
        letterSpan.className = "letter" + (guessedLetters.includes(letter) ? " visible" : "");
        letterSpan.textContent = letter;
        
        letterContainer.appendChild(letterSpan);
        wordElement.appendChild(letterContainer);
    });
}

// Update keyboard
function updateKeyboard() {
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach(button => {
        const key = button.innerText.toLowerCase();
        
        // Reset classes
        button.classList.remove("active", "inactive");
        button.disabled = false;
        
        if (guessedLetters.includes(key)) {
            if (wordToGuess.includes(key)) {
                button.classList.add("active");
            } else {
                button.classList.add("inactive");
                button.disabled = true;
            }
        }
    });
}

// Update hangman drawing
function updateHangmanDrawing() {
    const incorrectLetters = guessedLetters.filter(
        letter => !wordToGuess.includes(letter)
    );
    
    // Show body parts based on number of incorrect guesses
    for (let i = 0; i < BODY_PARTS.length; i++) {
        const part = document.getElementById(BODY_PARTS[i]);
        if (i < incorrectLetters.length) {
            part.style.display = "block";
        } else {
            part.style.display = "none";
        }
    }
}

// Check if game is over
function checkGameEnd() {
    const incorrectLetters = guessedLetters.filter(
        letter => !wordToGuess.includes(letter)
    );
    
    // Check loss condition
    if (incorrectLetters.length >= BODY_PARTS.length) {
        showResultPopup("Game Over!", `The word was: ${wordToGuess}`);
        return;
    }
    
    // Check win condition
    const allLettersGuessed = wordToGuess.split("").every(letter => 
        guessedLetters.includes(letter)
    );
    
    if (allLettersGuessed) {
        let message = `The word was: ${wordToGuess}`;
        if (!hintUsed) {
            message += "<br>Great job solving it without using a hint!";
        }
        showResultPopup("You Won!", message);
    }
}

function showResultPopup(title, message) {
    const popup = document.getElementById("result-popup");
    const titleEl = document.getElementById("result-title");
    const messageEl = document.getElementById("result-message");
    const playAgainBtn = document.getElementById("play-again-btn");
    
    titleEl.textContent = title;
    messageEl.innerHTML = message;
    popup.classList.add("show");
    
    playAgainBtn.addEventListener("click", function() {
        popup.classList.remove("show");
        initGame();
    });
}

// Handle keyboard events
document.addEventListener("keypress", (e) => {
    const key = e.key.toLowerCase();
    if (!key.match(/^[a-z]$/)) return;
    
    e.preventDefault();
    addGuessedLetter(key);
});

// Start game when page loads
document.addEventListener("DOMContentLoaded", () => {
    setupHintButton();
    initGame();
});