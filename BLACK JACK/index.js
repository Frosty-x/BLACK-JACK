let player = { name: "", chips: 0, bet: 0 };
let cards = [];
let sum = 0;
let hasBlackJack = false;
let isAlive = false;
let message = "";
let wins = 0;
let losses = 0;

let setupContainer = document.getElementById("setup-container");
let gameContainer = document.getElementById("game-container");
let nameInput = document.getElementById("name-input");
let chipsInput = document.getElementById("chips-input");

let messageEl = document.getElementById("message-el");
let sumEl = document.getElementById("sum-el");
let cardsEl = document.getElementById("cards-el");
let playerEl = document.getElementById("player-el");
let betEl = document.getElementById("bet-el");
let betInput = document.getElementById("bet-input");

let winSound = new Audio("gwon.mp3");
let loseSound = new Audio("gover.mp3");
let drawSound = new Audio("draw.mp3");
let clickSound = new Audio("rc.mp3");

function startGameSetup() {
    let name = nameInput.value.trim();
    let chips = parseFloat(chipsInput.value);

    if (!name || isNaN(chips) || chips < 50) {
        alert("Please enter a valid name and at least $50 in chips to start.");
        return;
    }

    player.name = name;
    player.chips = chips;
    setupContainer.style.display = "none";
    gameContainer.style.display = "block";

    updatePlayerInfo();
}

function updatePlayerInfo() {
    playerEl.innerHTML = `<span>${player.name}: $${player.chips}</span>`;
    betEl.textContent = `Current Bet: $${player.bet}`;
}

function updateWinLossStats() {
    document.getElementById("wins-el").textContent = "Wins: " + wins;
    document.getElementById("losses-el").textContent = "Losses: " + losses;
}

function getRandomCard() {
    let randomNumber = Math.floor(Math.random() * 13) + 1;
    return randomNumber > 10 ? 10 : (randomNumber === 1 ? 11 : randomNumber);
}

function placeBet() {
    clickSound.play();
    let betAmount = parseFloat(betInput.value);
    
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > player.chips) {
        alert("Invalid bet amount!");
        return;
    }

    player.bet = betAmount;
    player.chips -= betAmount;
    updatePlayerInfo();
    startGame();
}

function startGame() {
    if (player.chips <= 0) {
        messageEl.textContent = "Game Over! No money left!";
        return;
    }

    isAlive = true;
    hasBlackJack = false;
    cards = [getRandomCard(), getRandomCard()];
    sum = cards.reduce((acc, card) => acc + card, 0);
    
    adjustForAces();
    renderGame();
}

function renderGame() {
    drawSound.play();
    
    cardsEl.textContent = "Your Cards: " + cards.join(" ");
    sumEl.textContent = "Sum: " + sum;

    if (sum === 21) {
        message = "🎉 Blackjack! You win 1.5x your bet!";
        hasBlackJack = true;
        player.chips += Math.floor(player.bet * 1.5);
        wins++;
        winSound.play();
    } else if (sum > 21) {
        message = "😵 You busted! You lost!";
        isAlive = false;
        losses++;
        loseSound.play();
    } else {
        message = "Draw a new card?";
    }

    updatePlayerInfo();
    updateWinLossStats();
    messageEl.textContent = message;
}

function newCard() {
    if (isAlive && !hasBlackJack) {
        drawSound.play();
        let card = getRandomCard();
        cards.push(card);
        sum += card;
        
        adjustForAces();
        renderGame();
    }
}

function adjustForAces() {
    if (sum > 21 && cards.includes(11)) {
        for (let i = 0; i < cards.length; i++) {
            if (cards[i] === 11) {
                cards[i] = 1;
                sum -= 10;
                if (sum <= 21) break;
            }
        }
    }
}

function resetGame() {
    player.chips = parseFloat(chipsInput.value);
    player.bet = 0;
    isAlive = false;
    hasBlackJack = false;
    cards = [];
    sum = 0;
    message = "Want to play a round?";

    updatePlayerInfo();
    messageEl.textContent = message;
    cardsEl.textContent = "Your Cards:";
    sumEl.textContent = "Sum:";
}
