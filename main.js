// =========================================================
// تعريف العناصر والمتغيرات
// =========================================================
const cards = document.querySelectorAll('.card');
const movesElement = document.querySelector('.moves');
const timerElement = document.querySelector('.timer');
const restartBtn = document.querySelector('.restart');
const starsContainer = document.querySelector('.stars');

// عناصر نافذة الفوز
const modal = document.getElementById("popup1");
const finalMove = document.getElementById("finalMove");
const totalTime = document.getElementById("totalTime");

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let seconds = 0;
let timerInterval = null;
let gameStarted = false;
let matchedPairs = 0;

// =========================================================
// دوال اللعبة
// =========================================================

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    incrementMoves();
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.children[0].src === secondCard.children[0].src;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    matchedPairs++;
    
    // عند الفوز (اكتشاف 8 أزواج)
    if (matchedPairs === 8) {
        clearInterval(timerInterval);
        // نشغل الاحتفال بدلاً من الـ alert
        congratulations();
    }
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 16);
        card.style.order = randomPos;
    });
}

// =========================================================
// دوال الفوز والمفرقعات (جديد)
// =========================================================

function congratulations() {
    // 1. عرض النافذة
    modal.classList.add("show");

    // 2. تحديث النصوص (الوقت والحركات)
    finalMove.innerHTML = moves;
    totalTime.innerHTML = timerElement.innerHTML;

    // 3. تشغيل المفرقعات (Confetti)
    fireworks();
}

function closeModal() {
    modal.classList.remove("show");
}

function playAgain() {
    closeModal();
    restartGame();
}

function fireworks() {
    // كود تشغيل المفرقعات لمدة 3 ثواني
    var duration = 3 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      var particleCount = 50 * (timeLeft / duration);
      // إطلاق مفرقعات من اليسار واليمين
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

// =========================================================
// دوال الواجهة
// =========================================================

function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        timerElement.innerText = formatTime(seconds);
    }, 1000);
}

function formatTime(sec) {
    let minutes = Math.floor(sec / 60);
    let remainderSeconds = sec % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
}

function incrementMoves() {
    moves++;
    movesElement.innerText = `${moves} Moves`;
    
    if (moves === 16) {
        starsContainer.children[2].firstElementChild.style.display = 'none';
    } else if (moves === 24) {
        starsContainer.children[1].firstElementChild.style.display = 'none';
    }
}

function restartGame() {
    clearInterval(timerInterval);
    seconds = 0;
    timerElement.innerText = "00:00";
    gameStarted = false;
    moves = 0;
    movesElement.innerText = "0 Moves";
    matchedPairs = 0;
    
    const allStars = starsContainer.querySelectorAll('i');
    allStars.forEach(star => star.style.display = 'inline-block');

    cards.forEach(card => {
        card.classList.remove('flip');
        card.addEventListener('click', flipCard);
    });

    resetBoard();
    setTimeout(shuffle, 500);
}

// تشغيل اللعبة
shuffle();
cards.forEach(card => card.addEventListener('click', flipCard));
restartBtn.addEventListener('click', restartGame);