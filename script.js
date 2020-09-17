// Variables that store the DOM element referring to introduction, quiz questions, high score page, and timer in the top right corner.
var introHeader = document.querySelector("#introHeader");
var introBody = document.querySelector("#introBody");
var introButton = document.querySelector("#introButton");
var quizQuestions = document.querySelector("#quizQuestions");
var quizAnswers = document.querySelector("#quizAnswers");
var quizResult = document.querySelector("#quizResult");
var yourScore = document.querySelector("#yourScore");
var allHighScores = document.querySelector("#allHighScores");
var returnToStart = document.querySelector("#returnToStart");
var timerCorner = document.querySelector("#timerCorner");

//Array that stores all the possible quiz questions.  Array elements are objects containing the question, list of answer choices, and a reference to the correct option.
var questionObject = [
    {
        question: "Are Java and Javascript very similar languages?",
        answers: ["Yes", "No", "Maybe", "So"],
        correct: "1",
    },
    {
        question: "Does Javascript have strictly defined variables?",
        answers: ["Um", "lol", "NO", "NOT AT ALL", "WTF"],
        correct: "2"
    },
    {
        question: "Do you enjoy debugging :)",
        answers: ["DEVIL", "lol", "NO"],
        correct: "0"
    }
];

//Score: keeps track of current score. Timer: time remaining until quiz end. Countdown: variable containing setInterval.Index: current quiz question. highScores: displays initials corresponding with score records.
var score;
var timer;
var countDown;
var index;
var highScores;
var finishedGame = false;

//Function that runs upon loading, updates high score page.  Checks local storage for high scores, and displays the top 3 in the dropdown tab. Limits records to the top 15 scores.
function updateHighScore(init, sco) {
    //Grabs the local storage scores if they exists, otherwise creates an empty array to hold the high scores
    if (localStorage.getItem("userScores")) {
        highScores = JSON.parse(localStorage.getItem("userScores"));
    } else {
        highScores = [];
    }

    //If the function was given valid parameters, adds the current score to the list of high scores
    if (init && sco) {
        var user = { initials: init, score: sco };
        highScores.push(user);
        highScores.sort((a, b) => {
            return b.score - a.score;
        });
    }

    //Limits the score history to a maximum of 15
    if (highScores.length > 15) {
        highScores.pop();
    }

    //Store the updated list of high scores
    localStorage.setItem("userScores", JSON.stringify(highScores));

    //If there are 3 scores, fills out the top three in the top-left hand corner dropdown menu.
    if (highScores[0]) {
        document.querySelector("#num1").textContent = `${(highScores[0].initials)} -- ${highScores[0].score}`
    }
    if (highScores[1]) {
        document.querySelector("#num2").textContent = `${(highScores[1].initials)} -- ${highScores[1].score}`
    } if (highScores[2]) {
        document.querySelector("#num3").textContent = `${(highScores[2].initials)} -- ${highScores[2].score}`
    }

}

//Runs upon loading the script, to be able to display high scores immediately. Since parameters are null, doesn't create a new record
updateHighScore();

//Starts the quiz when the start button is clicked
document.querySelector("#start").addEventListener("click", function (event) {

    //Makes the introduction dissapear and the quiz elements appear
    introHeader.style.display = "none";
    introBody.style.display = "none";
    introButton.style.display = "none";
    quizQuestions.style.display = "block";
    quizAnswers.style.display = "block";
    quizResult.style.display = "block";

    //Resets score, index, and timer between rounds. Updates top right corner timer with the time available
    score = 0;
    index = 0;
    timer = 30;
    finishedGame = false;
    timerCorner.textContent = timer;

    //First element of the loop of questions.
    generateQuestion(questionObject[0], 0);

    //AFTER the the start button has been clicked and timer has been reset, sets a time limit, and if it runs out, skips any remaining questions to go straight to the high score page. Note: asynchronous, so even though it is inside a function it will work at any time after it has been created!
    countDown = setInterval(() => {
        timer--;
        timerCorner.textContent = timer;
        if (timer === 0) {
            finishedGame = true;
            showHighScore();
        }
    }, 1000);

})

//Takes a single object with a question and an array of answers, and puts that question and answer set on the page
function generateQuestion(trivia, index) {
    // Updates top of the page with the new question
    quizQuestions.children[0].textContent = trivia.question;

    // Creates a list of possible answers and updates the page with the completed list. Each list element has a unique id.
    var answerList = document.createElement("ul");
    answerList.classList.add("list-group");
    answerList.setAttribute("id", "answerList");
    for (i = 0; i < trivia.answers.length; i++) {
        var choice = document.createElement("li");
        choice.textContent = trivia.answers[i];
        choice.classList.add("list-group-item", "choice");
        choice.setAttribute("id", i);
        answerList.append(choice);
    }
    quizAnswers.replaceChild(answerList, quizAnswers.children[0]);

    //After answers have been added to the page, waits for an answer to be chosen. Once it has, it checks the answer. If there are more questions, then it recursively calls "this" function(generate question) for the next question
    answerList.addEventListener("click", function (event) {
        index = checkAnswer(trivia, event, index);
        if (index < questionObject.length) {
            generateQuestion(questionObject[index], index);
        } else {
            finishedGame = true;
            score += Math.floor(timer / 5);
            showHighScore();
        }
    });

}

//Checks to see if user input (clicking on one element of the list of answer) is correct, updates score if correct, reduces time if incorrect
function checkAnswer(trivia, event) {

    index++;
    if (event.target.id == trivia.correct) {
        var result = quizResult.children[0];
        score++;
        result.textContent = "Correct!";
    } else {
        var result = quizResult.children[0];
        result.textContent = "Wrong!";
        timer = timer - 5;
    }

    return index;

}


function showHighScore() {
    clearInterval(countDown);
    timerCorner.textContent = "Timer";
    var currentInit = document.querySelector("#initials");
    currentInit.value = "";

    if (finishedGame) {
        currentInit.readOnly = false;
        document.querySelector(".btn-outline-success").disabled = false;
    } else {
        score = "Not applicable"
    }

    quizQuestions.style.display = "none";
    quizAnswers.style.display = "none";
    quizResult.style.display = "none";
    yourScore.style.display = "block";
    allHighScores.style.display = "block";
    returnToStart.style.display = "inline";

    yourScore.children[0].textContent = `Your score: ${score}`;
    showHighScoreList();

    document.querySelector(".form-group").addEventListener("submit", function functionListener(event) {
        event.preventDefault();
        finishedGame = false;
        var init = currentInit.value;
        currentInit.readOnly = true;
        document.querySelector(".btn-outline-success").disabled = true;
        updateHighScore(init, score);
        showHighScoreList();
        document.querySelector(".form-group").removeEventListener("submit",  functionListener);
    })



    returnToStart.children[0].addEventListener("click", function () {
        yourScore.style.display = "none";
        allHighScores.style.display = "none";
        returnToStart.style.display = "none";
        introHeader.style.display = "block";
        introBody.style.display = "block";
        introButton.style.display = "block";
    })
}

function showHighScoreList() {
    var scoreList = document.createElement("ul");
    scoreList.classList.add("list-group");
    for (var i = 0; i < highScores.length; i++) {
        var newScore = document.createElement('li');
        newScore.textContent = `Number ${i + 1}:  ${highScores[i].initials} with  ${highScores[i].score} points`;
        newScore.classList.add("list-group-item", "score");
        scoreList.append(newScore);
    }
    var scoreDisplay = document.getElementById("highScoreList");
    scoreDisplay.replaceChild(scoreList, scoreDisplay.children[0]);
}

document.querySelector("#allScores").addEventListener("click", function () {
    introHeader.style.display = "none";
    introBody.style.display = "none";
    introButton.style.display = "none";
    
    showHighScore();
})