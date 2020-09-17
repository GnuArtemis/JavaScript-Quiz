// Variables that store the DOM element to add and hide introduction, quiz questions, and
//TODO: high score page
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

//Score: keeps track of current score. Timer: time remaining until quiz end. Countdown: variable containing setInterval
var score;
var timer;
var countDown;
var index;
//TODO: Function that runs upon loading, updates high score page.  Checks local storage for high scores, and displays the top 3 in the dropdown tab.
//TODO: checks local storage to see what the all time high score is, and if new high score, updates local storage.
function updateHighScore(init, sco) {
    var temp;
    if (localStorage.getItem("userScores")) {
        temp = JSON.parse(localStorage.getItem("userScores"));
    }else {
        temp = [];
    } 

    if(init&&sco){
    var user = {initials: init, score: sco};
    temp.push(user);
    temp.sort((a, b) => {
        return b.score - a.score;
    });
}
    localStorage.setItem("userScores", JSON.stringify(temp));
    if(temp[0]){
        document.querySelector("#num1").textContent = `${(temp[0].initials)} ||| ${temp[0].score}`
    }
    if(temp[1]){
        document.querySelector("#num2").textContent = `${(temp[1].initials)} ||| ${temp[1].score}`
    }if(temp[2]){
        document.querySelector("#num3").textContent = `${(temp[2].initials)} ||| ${temp[2].score}`
    }

}
updateHighScore();

//Starts the quiz when the start button is clicked
document.querySelector("#start").addEventListener("click", function (event) {

    introHeader.style.display = "none";
    introBody.style.display = "none";
    introButton.style.display = "none";
    quizQuestions.style.display = "block";
    quizAnswers.style.display = "block";
    quizResult.style.display = "block";

    score = 0;
    index = 0;
    timer = 30;
    timerCorner.textContent = timer;

    generateQuestion(questionObject[0], 0);

    countDown = setInterval(() => {
        timer--;
        timerCorner.textContent = timer;
        if (timer === 0) {
            showHighScore();
        }
    }, 1000);

})

//TODO: clicking dropdown brings up a modal with all scores


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


    answerList.addEventListener("click", function (event) {
        index = checkAnswer(trivia, event, index);
        if (index < questionObject.length) {
            generateQuestion(questionObject[index], index);
        } else {

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

    quizQuestions.style.display = "none";
    quizAnswers.style.display = "none";
    quizResult.style.display = "none";
    yourScore.style.display = "block";
    allHighScores.style.display = "block";
    returnToStart.style.display = "inline";

    yourScore.children[0].textContent = `Your score: ${score}`

    var init = prompt("What are your initials?");
    updateHighScore(init, score);

    returnToStart.children[0].addEventListener("click", function () {
        yourScore.style.display = "none";
        allHighScores.style.display = "none";
        returnToStart.style.display = "none";
        introHeader.style.display = "block";
        introBody.style.display = "block";
        introButton.style.display = "block";
    })
}

