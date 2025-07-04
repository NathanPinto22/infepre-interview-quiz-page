const questions = {
  1: {
    question: "Which country has the highest life expectancy?",
    a: "Hong Kong",
    b: "India",
    c: "Japan",
    d: "USA",
  },
  2: {
    question: "What is the most common surname in the United States?",
    a: "Smith",
    b: "Charles",
    c: "Dean",
    d: "Arthur",
  },
};

const solution = {
  1: "a",
  2: "b",
};

const container = document.getElementById("question-card-container");
const questionList = document.getElementById("question-list");
let current_question = 1;
const totalQuestions = Object.keys(questions).length;

for (let q in questions) {
  const questionCard = document.createElement("div");
  const questionTitle = document.createElement("h2");
  const questionText = document.createElement("p");
  const questionForm = document.createElement("form");

  const optionA = document.createElement("input");
  const optionB = document.createElement("input");
  const optionC = document.createElement("input");
  const optionD = document.createElement("input");

  const labelA = document.createElement("label");
  const labelB = document.createElement("label");
  const labelC = document.createElement("label");
  const labelD = document.createElement("label");

  const listItem = document.createElement("li");
  listItem.innerText = "Q" + q;
  listItem.dataset.qid = q;
  questionList.appendChild(listItem);

  questionCard.id = "qcard-" + q;
  questionCard.classList.add("question-card");
  if (q !== "1") questionCard.style.display = "none";

  questionTitle.innerText = "Question " + q;
  questionText.innerText = questions[q].question;

  questionForm.id = "form-" + q;

  for (const [x, opt, label] of [
    ["a", optionA, labelA],
    ["b", optionB, labelB],
    ["c", optionC, labelC],
    ["d", optionD, labelD],
  ]) {
    opt.type = "radio";
    opt.name = "q-" + q;
    opt.id = q + "-" + x;
    opt.value = x;
    label.setAttribute("for", opt.id);
    label.innerText = questions[q][x];
    questionForm.appendChild(opt);
    questionForm.appendChild(label);
    questionForm.appendChild(document.createElement("br"));
  }

  questionCard.appendChild(questionTitle);
  questionCard.appendChild(questionText);
  questionCard.appendChild(questionForm);
  container.appendChild(questionCard);
}

container.innerHTML += `
  <div id="button-bar">
    <button id="button-prev" disabled>&lt;&lt; Previous</button>
    <button id="button-next">Next &gt;&gt;</button>
  </div>
`;

const nextButton = document.getElementById("button-next");
const prevButton = document.getElementById("button-prev");

nextButton.addEventListener("click", () => {
  if (current_question < totalQuestions) {
    document.getElementById("qcard-" + current_question).style.display = "none";
    current_question += 1;
    document.getElementById("qcard-" + current_question).style.display =
      "block";
    prevButton.disabled = false;
    if (current_question === totalQuestions) nextButton.innerText = "Submit";
  } else {
    handleSubmit();
  }
});

prevButton.addEventListener("click", () => {
  if (current_question > 1) {
    document.getElementById("qcard-" + current_question).style.display = "none";
    current_question -= 1;
    document.getElementById("qcard-" + current_question).style.display =
      "block";
    nextButton.disabled = false;
    if (current_question === 1) prevButton.disabled = true;
    if (current_question != totalQuestions && nextButton.innerText === "Submit")
      nextButton.innerText = "Next >>";
  }
});

function goToQuestion(qid) {
  document.getElementById("qcard-" + current_question).style.display = "none";
  document.getElementById("qcard-" + qid).style.display = "block";
  current_question = parseInt(qid);
  prevButton.disabled = current_question === 1;
  if (current_question === totalQuestions) nextButton.innerText = "Submit";
  if (current_question != totalQuestions && nextButton.innerText === "Submit")
    nextButton.innerText = "Next >>";
}
document.querySelectorAll("#question-list li").forEach((item) => {
  item.addEventListener("click", () => {
    goToQuestion(item.dataset.qid);
  });
});

function handleSubmit() {
  let score = 0;
  let correctCount = 0;
  let wrongCount = 0;
  const summaryCard = document.createElement("div");
  summaryCard.id = "result-summary";
  summaryCard.classList.add("question-card");

  const summaryTitle = document.createElement("h2");
  summaryTitle.innerText = "Quiz Results";
  summaryCard.appendChild(summaryTitle);

  const list = document.createElement("ul");

  for (let q in questions) {
    const selected = document.querySelector(`input[name="q-${q}"]:checked`);
    const userAnswer = selected ? selected.id.split("-")[1] : null;
    const correctAnswer = solution[q];

    const item = document.createElement("li");
    if (userAnswer === correctAnswer) {
      score += 1;
      correctCount += 1;
      item.innerText = `Q${q}: Correct`;
      item.style.color = "green";
    } else {
      wrongCount += 1;
      item.innerText = `Q${q}: Wrong (Your Answer: ${
        userAnswer || "None"
      }, Correct: ${correctAnswer})`;
      item.style.color = "red";
    }
    list.appendChild(item);
  }

  const finalScore = document.createElement("p");
  finalScore.innerText = `Score: ${score}/${totalQuestions} | Correct: ${correctCount} | Wrong: ${wrongCount}`;
  summaryCard.appendChild(finalScore);
  summaryCard.appendChild(list);

  document.getElementById("qcard-" + current_question).style.display = "none";
  container.innerHTML = "";
  container.appendChild(summaryCard);
}
