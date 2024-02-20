// Define selectedOptions in the global scope
const selectedOptions = {};

// Define listContainer variable
const listContainer = document.querySelector(".question-container");

let quizquestions = [];

// Adding click event listener to the listContainer
if (listContainer) {
  listContainer.addEventListener(
    "click",
    (e) => {
      if (e.target.tagName === "LI") {
        const clickedOption = e.target;
        const questionContainer = clickedOption.closest(".question-container");
        const questionId = questionContainer.getAttribute("data-question-id");

        // Deselect all other options in the same question
        const questionOptions = questionContainer.querySelectorAll("li");
        questionOptions.forEach((option) => {
          if (option !== clickedOption) {
            option.classList.remove("checked");
          }
        });

        // Toggle the clicked option
        clickedOption.classList.toggle("checked");

        // Save the selected option for the question
        selectedOptions[questionId] = clickedOption.classList.contains(
          "checked"
        )
          ? clickedOption.textContent
          : null;
      } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
      }
    },
    false
  );
}


// Define categoryContainer variables
const categoryContainerOne = document.querySelector(".category-one ul");

// Check if categoryContainerOne exists before adding event listener
if (categoryContainerOne) {
  categoryContainerOne.addEventListener("click", toggleChecked);
}

// Function to toggle the "checked" class on list items
function toggleChecked(e) {
  if (e.target.tagName === "LI") {
    const clickedOption = e.target;
    const categoryOptions = e.currentTarget.querySelectorAll("li");

    // Deselect all other options in the same category
    categoryOptions.forEach((option) => {
      if (option !== clickedOption) {
        option.classList.remove("checked");
      }
    });

    // Toggle the clicked option
    clickedOption.classList.toggle("checked");
  }
}

let APIUrl;
// Add event listener to the start button
const startButton = document.getElementById("start-btn");

// Check if startButton exists before adding event listener
if (startButton) {
  startButton.addEventListener("click", async (e) => {
    // Get the selected category
    const selectedCategory = document.querySelector(".checked").textContent;

    // Construct the URL with query parameters
    const queryParams = new URLSearchParams();
    queryParams.append("category", selectedCategory);

    // Redirect to the second HTML page with the constructed URL
    window.location.href = `quiz.html?${queryParams.toString()}`;

    e.preventDefault(); // Prevent default form submission behavior
  });
}

// Get the category from the query parameters
const queryParams = new URLSearchParams(window.location.search);
const selectedCategory = queryParams.get("category");

// Function to load questions from the API
async function loadQuestions() {
  const categoryMap = {
    "Mathematics": 19,
    "Sports": 21,
    "General Knowledge": 9,
    "Politics": 24,
    "Geography": 22,
    "Video Games": 15,
    "Computer": 18,
    "Science": 17,
    "History": 23,
    "Arts and Literature": 25,
  };

 // Get the selected category from the query parameters
const queryParams = new URLSearchParams(window.location.search);
const selectedCategory = queryParams.get('category');

// Update the sub-header text with the selected category
const subheader = document.getElementById('category-subheader');
if (subheader) {
    subheader.textContent = `${selectedCategory}`;
}

  const categoryId = categoryMap[selectedCategory];
  const APIUrl = `https://opentdb.com/api.php?amount=10&category=${categoryId}`;

  // Fetch data from the API
  const result = await fetch(APIUrl);
  const data = await result.json();

  // Clear existing questions
  if (listContainer) {
    listContainer.innerHTML = "";
  }

  quizquestions = data.results;

  quizquestions.forEach((data, index) => {
    let question = data.question;
    let correctAnswer = data.correct_answer;
    let incorrectAnswers = data.incorrect_answers;
    let optionsList = [...incorrectAnswers, correctAnswer]; // Include correct answer in the options list


    // Shuffle options list
    for (let i = optionsList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionsList[i], optionsList[j]] = [optionsList[j], optionsList[i]];
    }

    // Create separate elements for each question and its options
    let questionContainer = document.createElement("div");
    questionContainer.classList.add("question-container");
    questionContainer.setAttribute("data-question-id", index + 1);

    let questionElement = document.createElement("p");
    let optionsElement = document.createElement("ul");

    questionElement.innerHTML = `<p> ${index + 1}. ${question}</p>`;
    optionsList.forEach((option, i) => {
      const optionItem = document.createElement("li");
      optionItem.textContent = option;
      optionItem.addEventListener("click", () => {
        handleAnswer(option, correctAnswer);
      });
      optionsElement.appendChild(optionItem);
    });

    // Append elements to the document
    questionContainer.appendChild(questionElement);
    questionContainer.appendChild(optionsElement);
    listContainer.appendChild(questionContainer);
  });
}

function handleAnswer(selectedAnswer, correctAnswer) {
  if (selectedAnswer === correctAnswer) {
    console.log("Correct!");
    // Handle correct answer behavior
  } else {
    console.log("Incorrect!");
    // Handle incorrect answer behavior
  }
}

// Call the function to load questions when needed
loadQuestions();


// Timer starts here
let timer = document.querySelector(".timer");
let timerElement = document.createElement("p");

if (timer) {
  timer.appendChild(timerElement);
}

let timeLeft = 300; // Set the initial time to 10 minutes (10 minutes * 60 seconds/minute)

// Function to update the timer
function updateTimer() {
  timerElement.textContent = `Time Left: ${Math.floor(timeLeft / 60)}:${(
    timeLeft % 60
  )
    .toString()
    .padStart(2, "0")} minutes`;

  if (timeLeft === 0) {
    clearInterval(timerInterval);
    showScoreModal(); // Show the score when the timer reaches 0
  } else {
    timeLeft--;
  }
}
// Update the timer every second
let timerInterval = setInterval(updateTimer, 1000);


// Function to handle saving data
async function saveData() {
  try {
    // Existing saveData logic...
    // Calculate and show total score
    const totalScore = calculateTotalScore();
    showModal(totalScore);
  } catch (error) {
    console.error("Error in saving data:", error);
  }
}

function calculateTotalScore() {
  // logic to calculate the score based on selectedOptions
  // Fiterate through selectedOptions and compare with correct answers
  let score = 0;
  for (const questionId in selectedOptions) {
    // scoring logic here
    // For simplicity, let's assume 1 point per correct answer
    if (selectedOptions[questionId] === correctAnswerForQuestion(questionId)) {
      score++;
    }
  }
  return score;
}

function correctAnswerForQuestion(questionId) {
  // logic to get the correct answer for a question based on questionId
  return quizquestions[questionId - 1].correct_answer;
}

// Define showScoreModal function in the global scope
function showScoreModal(event) {
  clearInterval(timerInterval); // Stop the timer
  const totalScore = calculateTotalScore();
  showModal(totalScore);
  event.preventDefault();
}

// Function to show the modal
function showModal(totalScore) {
  const modal = document.getElementById("scoreModal");
  const scoreText = document.getElementById("scoreText");
  scoreText.textContent = `Your Total Score is: ${totalScore}/10`;
  modal.style.display = "block";
}

// Quiz form submit event listener
const quizForm = document.getElementById("quizForm");

if (quizForm) {
  quizForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    try {
      showScoreModal();
      saveData();
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  });
}

// Submit button click event listener
const submitButton = document.getElementById("submitButton");
if (submitButton) {
  submitButton.addEventListener("click", showScoreModal);
}

// Close button click event listener
const closeButton = document.querySelector(".close");
if (closeButton) {
  closeButton.addEventListener("click", () => {
    const modal = document.getElementById("scoreModal");
    modal.style.display = "none";
  });
}
