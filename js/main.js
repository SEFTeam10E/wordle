/*
    CSS FILE FOR TEAM 10E WORDLE
    Date: 28/04/2022
    Authors: Team 10E Development Team
*/

// These do not go in the eventListener - can be commented out or removed for Sprint submission
// For the sake of our submission, this won't run
function toggleInstructions() {
    var instructions = document.getElementById("instructions");
    
    if (instructions.style.visibility==="hidden") {
        instructions.style.visibility="visible";
    }
    else {
        instructions.style.visibility="hidden";
    }
}

// Load JavaScript on Page Load
document.addEventListener("DOMContentLoaded", () => {
    // Variables for site-wide use
    var guessedWords;
    var freeSpace;
    var word = "proud";
    var guessedWordCount = 0;
    

    // Initialise the game
    gameInit();

    // Setup function
    function gameInit() {
        var word = "proud" // hard coded for testing, needs to change in Sprint 2
        // hard coded tile colours - for Sprint 2, will need changing for colour schemes
        //var correctPosition = rgb(83, 141, 78);
        //var incorrectLetter = rgb(58, 58, 60);
        //var incorrectPosition = rgb(181, 159, 59);
        
        // Run setup functions
        gridDraw(); // draw the grid

        // Array for storing guessed words
        guessedWords = [[]];

        // Available space variable - starts at 1 for init
        freeSpace = 1;
    }

    // Draw grid function - Uses a loop to draw the squares instead of hard coding them in HTML
    function gridDraw() {
        var grid = document.getElementById("grid")

        // Runs until counter = 30, meaning it draws 30 squares, five per guess
        for (let index = 0; index < 30; index++) {
            let gridCube = document.createElement("div");
            gridCube.classList.add("square");
            gridCube.setAttribute("id", index + 1); // Each square gets an attribute which helps for inputting the letter with the keyboard
            grid.appendChild(gridCube);
        }
    }

    // This pulls the array for the currentGuessedWords so it can be updated
    function getCurrentGuessedWords() {
        var numGuessedWords = guessedWords.length;
        return guessedWords[numGuessedWords - 1];
    }

    // Handles the output onto the board as well as storing guessed letters in an array
    function evaluateGuessedWords(keypad_key) {
        var guessedWordArr = getCurrentGuessedWords();

        if (guessedWordArr && guessedWordArr.length < 5) {
            guessedWordArr.push(keypad_key);

            // Determines the space for the letter to go in the array and board
            var freeSpaceID = document.getElementById(String(freeSpace));
            // Increase counter as output letters increase
            freeSpace += 1;

            // Output the letter to the board
            freeSpaceID.textContent = keypad_key;
        }
    }
    // Changing square color green, orange, gray.
    function getSquareColor(letter, index){
        var correctLetter = word.includes(letter);

        var letterIndex = word.charAt(index);
        var correctPosition = (letter === letterIndex);
        //Incorrect letter color gray
        if (!correctLetter){
            return "rgb(58, 58, 60)";
        }
        //Correct letter color green
        if (correctPosition){
            return "rgb(83, 141, 78)";
        }
        //Correct letter but incorrect position orange
        return "rgb(181, 159, 59)";
    }

    // This is what happens when a user hits the enter key
    function evaluateEnteredWord() {
        var currentguessedWordArr = getCurrentGuessedWords();
        // Alert if word less than 5
        if (currentguessedWordArr.length !== 5) {
            window.alert("Word Must be 5 Letters");
        }
        else {
            var currentGuesses = currentguessedWordArr.join("");

            //Changing square colors using getBoxColor function
            var firstLetterId = guessedWordCount * 5 + 1;
            var interval = 200;
            currentguessedWordArr.forEach((letter, index) => {
                setTimeout(() => {
                    var squareColor = getSquareColor(letter, index);
                    var letterId = firstLetterId + index;
                    var letterEl = document.getElementById(letterId);
                    letterEl.style = `background-color:${squareColor};border-color:${squareColor}`;
                }, interval * index);
            });

            guessedWordCount += 1;

            // Congratulation message if correct guess
            if (currentGuesses === word){
                window.alert("Congratulations! You have won the wordle for today");
            }
            // More than 6 wrong guesses
            else if (guessedWords.length === 6){
                window.alert(`You Lose! The word for today is ${word}.`);
            }

            guessedWords.push([]);
        }
    }

    // This is what happens when a user hits the delete key
    function evaluateDeletedLetter() {
        var currentGuesses = getCurrentGuessedWords();
        var delLetter = currentGuesses.pop();

        guessedWords[guessedWords.length - 1] = currentGuesses;

        var freeSpaceID = document.getElementById(String(freeSpace - 1));

        freeSpaceID.textContent = '';
        freeSpace = freeSpace - 1;

    }
    
    // THIS is what happens when a user hits a key on the keyboard
    // This variable pulls the data from the HTML keyboard
    var keypad_keys = document.querySelectorAll(".keypad-row button");

    // This loop handles what happens when a button is clicked
    for (let i = 0; i < keypad_keys.length; i++) {
        // When the key is clicked, it pulls the data (i.e. the letter)
        keypad_keys[i].onclick = ({ target }) => {
            var keypad_key = target.getAttribute("data-key");

            // When they hit enter
            if (keypad_key === 'enter') {
                evaluateEnteredWord();
                return;
            }

            // When they hit delete
            if (keypad_key === 'del') {
                evaluateDeletedLetter();
                return;
            }

            // Updates the array - must be kept below the If Statements, otherwise the functions don't work
            evaluateGuessedWords(keypad_key); // Stores the letter in an array
            //console.log(keypad_key); // Testing purposes, remove later.
        }
    }
})