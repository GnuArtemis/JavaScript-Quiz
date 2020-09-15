var introHeader = document.querySelector("#introHeader");
var introBody = document.querySelector("#introBody");
var introButton = document.querySelector("#introButton");
var quizQuestions = document.querySelector("#quizQuestions");
var quizAnswers = document.querySelector("#quizAnswers");
var quizResult = document.querySelector("#quizResult");

var questionObject =
{
    question: "Are Java and Javascript very similar languages?",
    answers: ["Yes", "No", "Maybe", "So"],
    correct: "1",
};

//TODO: Function that runs upon loading.  Checks local storage 

function generateQuestion(trivia) {
    // Updates top of the page with the new question
    var newQuestion = document.createElement("h1");
    newQuestion.textContent = trivia.question;
    quizQuestions.appendChild(newQuestion);

    // Creates a list of possible answers and updates the page with the completed list. Each list element has a unique id.
    var answerList = document.createElement("ul");
    answerList.classList.add("list-group");
    answerList.setAttribute("id", "answerList");
    for (i = 0; i < trivia.answers.length; i ++) {
        var choice = document.createElement("li");
        choice.textContent = trivia.answers[i];
        choice.classList.add("list-group-item", "choice");
        choice.setAttribute("id",i);
        answerList.append(choice);
    }
    quizAnswers.append(answerList);
}


function checkAnswer(trivia,score) {
    var answerList = document.querySelector("#answerList");
    answerList.addEventListener("click", function(event) {
        if(event.target.id == trivia.correct) {
            
            score++;
            alert("Correct!");
            return score;
        } else {
            //timer--;
            alert("Wrong!");
            return 0;
        }
    })
}

document.querySelector("#start").addEventListener("click", function (event) {
    event.preventDefault();

    introHeader.style.display = "none";
    introBody.style.display = "none";
    introButton.style.display = "none";
    quizQuestions.style.display = "block";
    quizAnswers.style.display = "block";
    quizResult.style.display = "block";

    score = 0;

    generateQuestion(questionObject);
    score = checkAnswer(questionObject,score);
    console.log(score);
})
