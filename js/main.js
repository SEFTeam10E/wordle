/*
    CSS FILE FOR TEAM 10E WORDLE
    Date: 28/04/2022
    Authors: Team 10E Development Team
*/

// Load JavaScript on Page Load
document.addEventListener("DOMContentLoaded", () => {
  // Variables for site-wide use
  var guessedWords;
  var freeSpace;
  let guessIndex;
  let word;

  // Initialise the game
  gameInit();


  // Setup function
  function gameInit() {
    word = "proud" // hard coded for testing, needs to change in Sprint 2
    // hard coded tile colours - for Sprint 2, will need changing for colour schemes
    //var correctPosition = rgb(83, 141, 78);
    //var incorrectLetter = rgb(58, 58, 60);
    //var incorrectPosition = rgb(181, 159, 59);

    // Run setup functions
    gridDraw(); // draw the grid
    //instructions(); // show the instructions - further implementation could be put it to only show this to first time players
    //alert("Welcome to WORDLE");

    // Array for storing guessed words
    guessedWords = [[]];

    // Available space variable - starts at 1 for init
    freeSpace = 1;

    // The n-th user guess
    guessIndex = 1;
  }

  /* Trying to see if we can get a pop-up, will try and fix later */
  function instructions() {
    document.getElementById("game").style.display = "block";
    document.getElementById("instructions").style.display = "none";
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

    if (guessedWordArr.length < (5 * guessIndex)) {
      guessedWordArr.push(keypad_key);

      // Determines the space for the letter to go in the array and board
      var freeSpaceID = document.getElementById(String(freeSpace));
      // Increase counter as output letters increase
      freeSpace += 1;

      // Output the letter to the board
      freeSpaceID.textContent = keypad_key;
    }
  }

  // This is what happens when a user hits the enter key
  function evaluateEnteredWord() {
    var currentGuess = getCurrentGuessedWords();
    if ((freeSpace - 1) % 5 == 0 && (freeSpace - 1) >= (5 * guessIndex)) {
      if (true) { // TODO: Validate english word
        for (let i = 0; i < 5; i++) {
          // Square IDs, may be helpful for coloring/styling, please after styling is finished.
          console.log(((guessIndex - 1) * 5) + i);
          if (currentGuess[i] == word[i]) { // Correct word
            // TODO: Colour the tile green 
          } else if (word[i].includes(currentGuess[i])) { // Wrong position
            // TODO: Colour the tile yellow 
          } else { // Wrong word
            // TODO: Colour the tile grey
          }
        }
        guessIndex++;
      }
    }
  }

  // This is what happens when a user hits the delete key
  function evaluateDeletedLetter() {
    var currentGuesses = getCurrentGuessedWords();
    if (currentGuesses.length > (5 * guessIndex - 5)) {
      var delLetter = currentGuesses.pop();

      guessedWords[guessedWords.length - 1] = currentGuesses;

      var freeSpaceID = document.getElementById(String(freeSpace - 1));

      freeSpaceID.textContent = '';
      freeSpace = freeSpace - 1;
    }

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
      console.log(keypad_key); // Testing purposes, remove later.
    }
  }
})
