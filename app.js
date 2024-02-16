// Define listContainer variable
const listContainer = document.querySelector('.question-container');

let quizquestions = []; 

// Object to store selected option for each question
const selectedOptions = {};

// Adding click event listener to the listContainer
listContainer.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
      const clickedOption = e.target;
      const questionContainer = clickedOption.closest('.question-container');
      const questionId = questionContainer.getAttribute('data-question-id');

      // Deselect all other options in the same question
      const questionOptions = questionContainer.querySelectorAll('li');
      questionOptions.forEach(option => {
          if (option !== clickedOption) {
              option.classList.remove("checked");
          }
      });

      // Toggle the clicked option
      clickedOption.classList.toggle("checked");

      // Save the selected option for the question
      selectedOptions[questionId] = clickedOption.classList.contains("checked")
          ? clickedOption.textContent
          : null;


  } else if (e.target.tagName === "SPAN") {
      e.target.parentElement.remove();
  
  }
}, false);


// Function to load questions from the API
async function loadQuestions() {
  const APIUrl = "https://opentdb.com/api.php?amount=10&category=23";
  const result = await fetch(`${APIUrl}`);
  const data = await result.json();
  console.log(data);
  quizquestions = data.results; // Assign quizquestions in the outer scope

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
              handleAnswer(option, correctAnswer, quizquestions);
          });
          optionsElement.appendChild(optionItem);
      });

      // Append elements to the document
      questionContainer.appendChild(questionElement);
      questionContainer.appendChild(optionsElement);
      listContainer.appendChild(questionContainer);
  });
}

function handleAnswer(selectedAnswer, correctAnswer, quizquestions) {
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




//Timer starts here
  let timer = document.querySelector('.timer');
  let timerElement = document.createElement("p");
  timer.appendChild(timerElement);

  let timeLeft = 600; // Set the initial time to 10 minutes (10 minutes * 60 seconds/minute)

  // Function to update the timer
 function updateTimer() {
    timerElement.textContent = `Time Left: ${Math.floor(timeLeft / 60)}:${(timeLeft % 60)
      .toString()
      .padStart(2, '0')} minutes`;
  
    if (timeLeft === 0) {
      clearInterval(timerInterval);
      showScoreModal(); // Show the score when the timer reaches 0
    } else {
      timeLeft--;
    }
  }

  // Update the timer every second
  let timerInterval = setInterval(updateTimer, 1000);


  function saveData() {
    //existing saveData logic...
  
    // Calculate and show total score
    const totalScore = calculateTotalScore();
    showModal(totalScore);
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



  // Function to show the score modal
  function showScoreModal(event) {
    clearInterval(timerInterval); // Stop the timer
    const totalScore = calculateTotalScore();
    showModal(totalScore);
    event.preventDefault(); 
  }

  // Function to show the modal
function showModal(totalScore) {
  const modal = document.getElementById('scoreModal');
  const scoreText = document.getElementById('scoreText');
  scoreText.textContent = `Your Total Score is: ${totalScore}`;
  modal.style.display = 'block';
}

//Quiz form submit event listener
const quizForm = document.getElementById('quizForm');
quizForm.addEventListener('submit', (event) => {
    event.preventDefault(); 
    showScoreModal();
    saveData();
});

  
// Submit button click event listener
const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', showScoreModal);

  
// Close button click event listener
const closeButton = document.querySelector('.close');
closeButton.addEventListener('click', () => {
    const modal = document.getElementById('scoreModal');
    modal.style.display = 'none';
});;



