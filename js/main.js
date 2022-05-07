/*
    CSS FILE FOR TEAM 10E WORDLE
    Date: 28/04/2022
    Authors: Team 10E Development Team
*/

// These do not go in the eventListener - can be commented out or removed for Sprint submission
// For the sake of our submission, this won't run
function toggleInstructions() {
  let instructions = document.querySelector("#instructions");

  if (instructions.style.visibility === "hidden") {
    instructions.style.visibility = "visible";
  }
  else {
    instructions.style.visibility = "hidden";
  }
}

// Load JavaScript on Page Load
document.addEventListener("DOMContentLoaded", () => {
  // variables for site-wide use
  let guessedWords;
  let freeSpace;
  let word = "proud"; // hard coded for testing, needs to change in Sprint 2
  let guessedWordCount = 0;
  let isGameEnd = false;


  // Initialise the game
  gameInit();

  // Setup function
  function gameInit() {
    // hard coded tile colours - for Sprint 2, will need changing for colour schemes
    //let correctPosition = rgb(83, 141, 78);
    //let incorrectLetter = rgb(58, 58, 60);
    //let incorrectPosition = rgb(181, 159, 59);

    // Run setup functions
    gridDraw(); // draw the grid

    // Array for storing guessed words
    guessedWords = [[]];

    // Available space letiable - starts at 1 for init
    freeSpace = 1;
  }

  // Draw grid function - Uses a loop to draw the squares instead of hard coding them in HTML
  function gridDraw() {
    let grid = document.querySelector("#grid")

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
    let numGuessedWords = guessedWords.length;
    return guessedWords[numGuessedWords - 1];
  }

  // Handles the output onto the board as well as storing guessed letters in an array
  function evaluateGuessedWords(keypad_key) {
    let guessedWordArr = getCurrentGuessedWords();

    if (guessedWordArr && guessedWordArr.length < 5) {
      guessedWordArr.push(keypad_key);

      // Determines the space for the letter to go in the array and board
      let freeSpaceID = document.getElementById(String(freeSpace));
      // Increase counter as output letters increase
      freeSpace += 1;

      // Output the letter to the board
      freeSpaceID.textContent = keypad_key;
    }
  }
  // Changing square color green, orange, gray.
  function getSquareColor(letter, index) {
    let correctLetter = word.includes(letter);

    let letterIndex = word.charAt(index);
    let correctPosition = (letter === letterIndex);
    //Incorrect letter color gray
    if (!correctLetter) {
      return "rgb(180, 180, 180)";
    }
    //Correct letter color green
    if (correctPosition) {
      return "rgb(6, 214, 160)";
    }
    //Correct letter but incorrect position orange
    return "rgb(255, 209, 102)";
  }

  function delay(ms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(2);
      }, ms);
    });
  }

  // This is what happens when a user hits the enter key
  async function evaluateEnteredWord() {
    let currentguessedWordArr = getCurrentGuessedWords();
    // Alert if word less than 5
    if (currentguessedWordArr.length !== 5) {
      window.alert("Word Must be 5 Letters");
    } else {
      let currentGuesses = currentguessedWordArr.join("");

      //Changing square colors using getBoxColor function
      let firstLetterId = guessedWordCount * 5 + 1;
      for (let index = 0; index < currentguessedWordArr.length; index++) {
        let letter = currentguessedWordArr[index];
        let squareColor = getSquareColor(letter, index);
        let letterId = firstLetterId + index;
        let letterEl = document.getElementById(letterId);
        letterEl.style = `background-color:${squareColor};border-color:${squareColor}`;
        await delay(200)
      }


      guessedWordCount += 1;

      // Congratulation message if correct guess
      if (currentGuesses === word) {
        window.alert("Congratulations! You have won the wordle for today");
        isGameEnd = true;
      }
      // More than 6 wrong guesses
      else if (guessedWords.length === 6) {
        window.alert(`You Lose! The word for today is ${word}.`);
      }

      guessedWords.push([]);
    }
  }

  // This is what happens when a user hits the delete key
  function evaluateDeletedLetter() {
    let currentGuesses = getCurrentGuessedWords();
    if (currentGuesses.length - 1 >= 0) {
      let delLetter = currentGuesses.pop();

      guessedWords[guessedWords.length - 1] = currentGuesses;

      let freeSpaceID = document.getElementById(String(freeSpace - 1));

      freeSpaceID.textContent = '';
      freeSpace = freeSpace - 1;
    }
  }

  // THIS is what happens when a user hits a key on the keyboard
  // This letiable pulls the data from the HTML keyboard
  let keypad_keys = document.querySelectorAll(".keypad-row button");

  // This loop handles what happens when a button is clicked
  for (let i = 0; i < keypad_keys.length; i++) {
    // When the key is clicked, it pulls the data (i.e. the letter)
    keypad_keys[i].onclick = ({ target }) => {

      if (!isGameEnd) {
        let keypad_key = target.getAttribute("data-key");

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
  }
})
