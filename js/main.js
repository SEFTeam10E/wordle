/*
    Main.js
    Date: 28/04/2022
    Authors: Team 10E Development Team
*/

// Draw grid as much as numOfRow
const drawGrid = (numOfRow) => {
  let gridElement = document.querySelector("#grid")

  for (let index = 0; index < numOfRow * 5; index++) {
    let gridCubeElement = document.createElement("div");
    // Add class to element to add styles
    gridCubeElement.classList.add("square");
    // Set element ID to identify it on the input
    gridCubeElement.setAttribute("id", index);
    gridElement.appendChild(gridCubeElement);
  }
}

const getCurrentlyGuessedWord = (guessedWords) => guessedWords[guessedWords.length - 1];

const delay = (ms) => new Promise(resolve => setTimeout(() => resolve(2), ms))

// Get color depending on the correctness of the guess
const getColor = (letter, index, word) => {
  // TODO: on sprint 2 add functionalities to change color here
  if (letter === word[index]) return "rgb(6, 214, 160)";
  if (word.includes(letter)) return "rgb(255, 209, 102)";
  return "rgb(180, 180, 180)";
}


// FIXME: This function contains side-effect and may effect future implementation
// Handles the output onto the board as well as storing guessed letters in an array
const evaluateGuessedWords = (keypadKey, guessedWords, freeSpace) => {
  let currentGuess = getCurrentlyGuessedWord(guessedWords);
  if (currentGuess && currentGuess.length < 5) {
    // FIXME: SIDE EFFECT
    // Pass by reference (refering to guessedword internal array)
    currentGuess.push(keypadKey);
    // Determines the space for the letter to go in the array and board
    let freeSpaceIDElement = document.getElementById(String(freeSpace));
    // Increase counter as output letters increase
    freeSpace += 1;
    // Output the letter to the board
    freeSpaceIDElement.textContent = keypadKey;
  }
  return freeSpace
}

// FIXME: This function contains side-effect and may effect future implementation
const evaluateDeletedLetter = (isAnimating, guessedWords, freeSpace) => {
  // Do not allow delete when the animation is being displayed (disable delete when full)
  if (isAnimating) return;

  let currentGuess = getCurrentlyGuessedWord(guessedWords);
  if (currentGuess.length - 1 >= 0) {
    // FIXME: SIDE EFFECT
    currentGuess.pop();

    guessedWords[guessedWords.length - 1] = currentGuess;

    let freeSpaceIDElement = document.getElementById(String(freeSpace - 1));

    freeSpaceIDElement.textContent = '';
    freeSpace--;
  }

  return freeSpace;
}

// FIXME: This function contains side-effect and may effect future implementation
async function evaluateEnteredWord(word, animationStateUpdater, guessedWordCountUpdater, guessedWords, guessedWordCount) {
  let currentGuess = getCurrentlyGuessedWord(guessedWords);
  // Letter inputed is not upto guessing length
  if (currentGuess.length !== 5) {
    window.alert("Word Must be 5 Letters");
  } else {
    // FIXME: SIDE EFFECT
    let currentGuesses = currentGuess.join("");

    //Changing square colors using getBoxColor function
    let firstLetterId = guessedWordCount * 5;
    animationStateUpdater(true)
    for (let index = 0; index < currentGuess.length; index++) {
      let letter = currentGuess[index];
      let squareColor = getColor(letter, index, word);
      let letterId = firstLetterId + index;
      let letterEl = document.getElementById(letterId);
      letterEl.style = `background-color:${squareColor};border-color:${squareColor}`;
      await delay(200)
    }
    animationStateUpdater(false)

    // guessedWordCount += 1;
    guessedWordCountUpdater()

    // Congratulation message if correct guess
    if (currentGuesses === word) {
      window.alert("Congratulations! You have won the wordle for today");
      isGameEnd = true;
    }
    // More than 6 wrong guesses
    else if (guessedWords.length === 6) {
      window.alert(`You Lose! The word for today is ${word}.`);
    }

    // FIXME: SIDE EFFECT
    guessedWords.push([]);
  }
}


const main = () => {
  // 2D array containing all guessed word
  let guessedWords = [[]];
  // Free space state corresponds to the grid id
  let freeSpace = 0;
  // TODO: Change me to dynamic content in sprint 2
  let word = "proud";
  let guessedWordCount = 0;
  let isGameEnd = false;
  let isAnimating = false

  // Draw the grid
  drawGrid(6)

  const updateAnimationState = (state) => isAnimating = state
  const incrementGuessedWordCount = () => guessedWordCount++

  // Get all keybords element and add event listener
  let keypadKeysElements = document.querySelectorAll(".keypad-row button");

  for (const keypadKeyElementInstance of keypadKeysElements) {
    // Get the clicked key and destructure the target (the letter pressed)
    keypadKeyElementInstance.onclick = ({ target }) => {
      if (!isGameEnd) {
        let keypadKey = target.getAttribute("data-key");

        if (keypadKey === 'enter') {
          evaluateEnteredWord(word, updateAnimationState, incrementGuessedWordCount, guessedWords, guessedWordCount);
          return;
        }

        if (keypadKey === 'del') {
          evaluateDeletedLetter(isAnimating, guessedWords, freeSpace);
          return;
        }
        // Update guessworrds array
        freeSpace = evaluateGuessedWords(keypadKey, guessedWords, freeSpace);
      }
    }
  }

}

// Run function after page initialized
document.addEventListener("DOMContentLoaded", main)
