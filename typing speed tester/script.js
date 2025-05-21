const quotes = [ 
  "Success doesn’t come overnight; it takes discipline, patience, and consistent hard work each day.",
  "Great ideas begin with a thought, but action turns them into incredible real-world achievements.",
  "Never let failure define you. Let it teach you, inspire you, and strengthen your resolve.",
  "Focus on learning something new daily, no matter how small it may seem at first.",
  "You are capable of achieving far more than you can currently imagine or even believe.",
  "Be so good they can’t ignore you, no matter how hard they may try.",
  "Chase progress, not perfection, because growth comes from the effort and lessons along the way.",
  "Dream big, plan wisely, start small, stay focused, and never give up your purpose.",
  "Every expert was once a beginner who kept showing up and improving every single day.",
  "Work hard in silence. Let success be your voice and actions prove your dedication.",
  "Discipline is doing what needs to be done, even when you don’t feel like it.",
  "Sometimes growth requires discomfort. Embrace the challenge and move through it with inner strength.",
  "The secret to getting ahead is simply getting started and staying consistent over time.",
  "Your future is created by what you do today, not tomorrow or next week.",
  "Take the risk or lose the chance; fear should never paralyze your potential forever.",
  "Hustle until your haters ask if you’re hiring them. Let success speak for itself.",
  "Don't stop when you’re tired. Stop when you’re done and proud of your work.",
  "Winners are not people who never fail, but people who never quit or surrender.",
  "The path may be hard, but it leads to something truly meaningful and life-changing.",
  "Greatness begins the moment you decide to keep going despite fear, doubt, and setbacks.",
  "Each morning gives you a brand-new chance to grow, improve, and rewrite your story.",
  "Strong people aren't born. They're forged through adversity, persistence, and faith in their journey.",
  "Let your hustle be louder than your complaints and your faith louder than your fears.",
  "Learning never ends. The more you know, the more you realize there’s more to learn.",
  "Believe in yourself deeply, because confidence is the first step toward achieving anything worthwhile.",
  "Your goals don’t care how you feel. Get up, show up, and do it.",
  "Comfort zones kill dreams. Progress only begins when you dare to step beyond the familiar.",
  "A goal without a plan is just a wish. Map it out and execute.",
  "Don’t compare your Chapter One to someone else’s Chapter Twenty. Trust your pace completely.",
  "Every minute spent working on your dream moves you closer to living it fully.",
  "Success grows through sacrifice, late nights, hard choices, and never giving up on yourself.",
  "You don’t have to be perfect; you just have to be persistent and keep moving.",
  "Small daily improvements over time lead to stunning results that change your life forever.",
  "Be accountable to yourself. No one else is responsible for your progress or consistency.",
  "You are one decision away from a completely different life. Make that decision today.",
  "Fall in love with the process, not just the goal, and joy will follow.",
  "You don’t need motivation; you need discipline. That’s what separates success from regret daily.",
  "Excuses don’t build empires. Work does. Show up even when you don’t feel ready.",
  "If it matters to you, you’ll make time. If not, you’ll make excuses instead.",
  "Dreams become goals when you write them down, commit, and pursue them with focus.",
  "Grind silently. Let results speak volumes. Make every step you take count toward something bigger.",
  "Every action today is a brick in the foundation of your tomorrow’s life success.",
  "If opportunity doesn’t knock, build a door with sweat, focus, and unstoppable inner drive.",
  "Be bold enough to believe in yourself, even when others doubt what you’re building.",
  "Make today count. You don’t get this day again, so use it with purpose.",
  "The most powerful weapon you can have is belief in yourself and your endless potential.",
  "Persistence crushes resistance. Keep moving forward no matter how many times you face rejection.",
  "Set goals that scare you a little and excite you a lot every day.",
  "Distractions destroy dreams. Choose your priorities wisely and protect your time like it’s gold.",
  "Energy flows where attention goes, so keep your focus locked on what really matters."
];

let quote = "";
let timerStarted = false;
let startTime;
let timerInterval;
let timeLeft = 60;
let totalXP = Number(localStorage.getItem("totalXP")) || 0;
let highXP = Number(localStorage.getItem("highXP")) || 0;

const quoteDisplay = document.getElementById("quoteDisplay");
const inputArea = document.getElementById("inputArea");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const timerDisplay = document.getElementById("timer");
const totalXPDisplay = document.getElementById("totalXP");
const highXPDisplay = document.getElementById("highXP");

function loadNewQuote() {
  quote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteDisplay.textContent = quote;
  quoteDisplay.classList.remove("fadeIn");
  void quoteDisplay.offsetWidth;
  quoteDisplay.classList.add("fadeIn");
  inputArea.value = "";
  inputArea.disabled = false;
  inputArea.classList.remove("error");
  inputArea.style.color = "#fff";
}

function updateXPDisplays() {
  totalXPDisplay.textContent = totalXP;
  highXPDisplay.textContent = highXP;
  totalXPDisplay.classList.add("xp-bounce");
  highXPDisplay.classList.add("xp-bounce");

  setTimeout(() => {
    totalXPDisplay.classList.remove("xp-bounce");
    highXPDisplay.classList.remove("xp-bounce");
  }, 400);
}

function startTimer() {
  timerStarted = true;
  startTime = new Date();
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      finishTest();
    }
  }, 1000);
}

inputArea.addEventListener("input", () => {
  if (!timerStarted) startTimer();
  const input = inputArea.value;
  let hasError = false;
  for (let i = 0; i < input.length; i++) {
    if (input[i] !== quote[i]) {
      hasError = true;
      break;
    }
  }
  inputArea.classList.toggle("error", hasError);

  let correctChars = 0;
  for (let i = 0; i < input.length && i < quote.length; i++) {
    if (input[i] === quote[i]) correctChars++;
  }

  const elapsedTime = (new Date() - startTime) / 1000 / 60;
  const wpm = Math.round((correctChars / 5) / elapsedTime);
  const accuracy = input.length > 0 ? (correctChars / input.length) * 100 : 0;

  wpmDisplay.textContent = isFinite(wpm) ? wpm : 0;
  accuracyDisplay.textContent = Math.round(accuracy);

  if (input.trim() === quote.trim()) {
    totalXP += 10;
    if (totalXP > highXP) highXP = totalXP;
    localStorage.setItem("totalXP", totalXP);
    localStorage.setItem("highXP", highXP);
    updateXPDisplays();
    loadNewQuote();
  }
});

function finishTest() {
  inputArea.value = "Your time has ended.";
  inputArea.style.color = "#ff4c4c";
  inputArea.disabled = true;
  inputArea.classList.remove("error");
  localStorage.setItem("totalXP", totalXP);
  localStorage.setItem("highXP", highXP);
  updateXPDisplays();
}

function resetTest() {
  clearInterval(timerInterval);
  timerStarted = false;
  timeLeft = 60;
  timerDisplay.textContent = timeLeft;
  wpmDisplay.textContent = 0;
  accuracyDisplay.textContent = 0;
  inputArea.disabled = false;
  inputArea.style.color = "#fff";
  totalXP = 0;
  localStorage.setItem("totalXP", totalXP);
  updateXPDisplays();
  loadNewQuote();
}

// Disable copy/paste/right-click on quote
quoteDisplay.addEventListener("contextmenu", (e) => e.preventDefault());
quoteDisplay.addEventListener("copy", (e) => e.preventDefault());

loadNewQuote();
updateXPDisplays();