const listContainer = document.querySelector('.question-container');

// Object to store selected option for each question
const selectedOptions = {};

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

        saveData();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData();
    }
}, false);

// Function to load questions from the API
async function loadQuestions() {
    const APIUrl = "https://opentdb.com/api.php?amount=10&category=23";
    const result = await fetch(`${APIUrl}`);
    const data = await result.json();
    console.log(data);
    let quizquestions = data.results;

    quizquestions.forEach((data, index) => {
        let questions = data.question;
        let correctAnswer = data.correct_answer;
        let incorrectAnswer = data.incorrect_answers;
        let optionslist = [...incorrectAnswer];
        optionslist.splice(
            Math.floor(Math.random() * (incorrectAnswer.length + 1)),
            0,
            correctAnswer
        );

        // Create separate elements for each question and its options
        let questionContainer = document.createElement("div");
        questionContainer.classList.add("question-container");
        questionContainer.setAttribute("data-question-id", index + 1);

        let questionElement = document.createElement("p");
        let optionsElement = document.createElement("ul");

        questionElement.innerHTML = `<p> ${index + 1}. ${questions}</p>`;
        optionsElement.innerHTML = optionslist
            .map((option) => `<li>${option}</li>`)
            .join("");

        // Append elements to the document
        questionContainer.appendChild(questionElement);
        questionContainer.appendChild(optionsElement);
        listContainer.appendChild(questionContainer);
    });
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
      // Your scoring logic here
      // For simplicity, let's assume 1 point per correct answer
      if (selectedOptions[questionId] === correctAnswerForQuestion(questionId)) {
        score++;
      }
    }
    return score;
  }
  
  function correctAnswerForQuestion(questionId) {
    // Your logic to get the correct answer for a question based on questionId
    // This depends on how your questions are structured
    // For example, you might have an array of questions where each question has a correct answer
    return quizquestions[questionId - 1].correct_answer;
  }

  //for modal
  const submitButton = document.getElementById('submitButton');
  
 function showModal(totalScore) {
  const modal = document.getElementById('scoreModal');
  const scoreText = document.getElementById('scoreText');

  scoreText.textContent = `Your Total Score is: ${totalScore}`;

  modal.style.display = 'block';
 
}


 submitButton.addEventListener('click', (event) => showScoreModal(event));
  function showScoreModal(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    clearInterval(timerInterval); // Stop the timer
    const totalScore = calculateTotalScore();
    showModal(totalScore);
  }

  
 const closeButton = document.querySelector('.close');
 closeButton.addEventListener('click', () => {
  const modal = document.getElementById('scoreModal');
  modal.style.display = 'none';
});


const quizForm = document.getElementById('quizForm');
quizForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the default form submission behavior
  showScoreModal();
});
  
  