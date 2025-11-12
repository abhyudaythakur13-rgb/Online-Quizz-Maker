let quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
let currentQuiz = null;
let userAnswers = [];

function showCreateQuiz() {
  hideAll();
  document.getElementById("createQuiz").classList.remove("hidden");
}

function showQuizList() {
  hideAll();
  const list = document.getElementById("quizItems");
  list.innerHTML = "";

  quizzes.forEach((quiz, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${quiz.title} <button onclick="startQuiz(${index})">Start</button>`;
    list.appendChild(li);
  });

  document.getElementById("quizList").classList.remove("hidden");
}

function goHome() {
  hideAll();
  document.getElementById("home").classList.remove("hidden");
}

function hideAll() {
  document.querySelectorAll(".container > div").forEach(div => div.classList.add("hidden"));
}

function addQuestion() {
  const container = document.getElementById("questionsContainer");
  const div = document.createElement("div");
  div.classList.add("question");
  div.innerHTML = `
    <input type="text" placeholder="Question" class="questionText">
    <input type="text" placeholder="Option 1" class="optionInput">
    <input type="text" placeholder="Option 2" class="optionInput">
    <input type="text" placeholder="Option 3" class="optionInput">
    <input type="text" placeholder="Option 4" class="optionInput">
    <input type="number" placeholder="Correct option (1-4)" class="correctAnswer">
  `;
  container.appendChild(div);
}

function saveQuiz() {
  const title = document.getElementById("quizTitle").value;
  if (!title) return alert("Enter quiz title");

  const questions = [];
  document.querySelectorAll(".question").forEach(q => {
    const text = q.querySelector(".questionText").value;
    const options = [...q.querySelectorAll(".optionInput")].map(o => o.value);
    const correct = parseInt(q.querySelector(".correctAnswer").value);

    if (text && options.every(o => o) && correct >= 1 && correct <= 4) {
      questions.push({ text, options, correct });
    }
  });

  if (questions.length === 0) return alert("Add valid questions!");

  quizzes.push({ title, questions });
  localStorage.setItem("quizzes", JSON.stringify(quizzes));
  alert("Quiz saved!");
  goHome();
}

function startQuiz(index) {
  hideAll();
  currentQuiz = quizzes[index];
  userAnswers = [];
  document.getElementById("currentQuizTitle").textContent = currentQuiz.title;
  const area = document.getElementById("questionArea");
  area.innerHTML = "";

  currentQuiz.questions.forEach((q, i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><b>${i + 1}. ${q.text}</b></p>
      ${q.options
        .map((opt, idx) => 
          `<label><input type="radio" name="q${i}" value="${idx + 1}"> ${opt}</label><br>`
        )
        .join("")}
    `;
    area.appendChild(div);
  });

  document.getElementById("takeQuiz").classList.remove("hidden");
}

function submitQuiz() {
  const answers = [];
  currentQuiz.questions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    answers.push(selected ? parseInt(selected.value) : null);
  });
  userAnswers = answers;

  let score = 0;
  currentQuiz.questions.forEach((q, i) => {
    if (userAnswers[i] === q.correct) score++;
  });

  showResults(score);
}

function showResults(score) {
  hideAll();
  document.getElementById("score").textContent = `You scored ${score}/${currentQuiz.questions.length}`;
  
  const review = document.getElementById("answersReview");
  review.innerHTML = "";

  currentQuiz.questions.forEach((q, i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><b>${q.text}</b></p>
      <p>Your answer: ${userAnswers[i] ? q.options[userAnswers[i] - 1] : "No answer"}</p>
      <p>Correct answer: ${q.options[q.correct - 1]}</p>
      <hr>
    `;
    review.appendChild(div);
  });

  document.getElementById("results").classList.remove("hidden");
}
