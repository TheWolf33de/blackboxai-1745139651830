/**
 * Blackjack game logic and UI
 * Modern, simple implementation with Tailwind CSS styling
 */

function initBlackjack() {
  const container = document.getElementById('blackjack-game');
  container.innerHTML = `
    <h2 class="text-3xl font-bold mb-4 text-yellow-400">Blackjack</h2>
    <div class="flex flex-col md:flex-row justify-between gap-6">
      <div class="flex-1 bg-gray-800 rounded-lg p-4 shadow-lg">
        <h3 class="text-xl font-semibold mb-2">Dealer</h3>
        <div id="dealer-cards" class="flex space-x-2 mb-4"></div>
        <p id="dealer-score" class="text-lg font-semibold"></p>
      </div>
      <div class="flex-1 bg-gray-800 rounded-lg p-4 shadow-lg">
        <h3 class="text-xl font-semibold mb-2">Player</h3>
        <div id="player-cards" class="flex space-x-2 mb-4"></div>
        <p id="player-score" class="text-lg font-semibold"></p>
      </div>
    </div>
    <div class="mt-6 flex justify-center space-x-4">
      <button id="btn-hit" class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-semibold transition">Hit</button>
      <button id="btn-stand" class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-semibold transition">Stand</button>
      <button id="btn-new-game" class="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-white font-semibold transition">New Game</button>
    </div>
    <p id="game-message" class="mt-6 text-center text-xl font-bold"></p>
  `;

  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  let deck = [];
  let playerHand = [];
  let dealerHand = [];
  let gameOver = false;

  const dealerCardsDiv = document.getElementById('dealer-cards');
  const playerCardsDiv = document.getElementById('player-cards');
  const dealerScoreP = document.getElementById('dealer-score');
  const playerScoreP = document.getElementById('player-score');
  const gameMessageP = document.getElementById('game-message');
  const btnHit = document.getElementById('btn-hit');
  const btnStand = document.getElementById('btn-stand');
  const btnNewGame = document.getElementById('btn-new-game');

  function createDeck() {
    deck = [];
    for (const suit of suits) {
      for (const value of values) {
        deck.push({ suit, value });
      }
    }
  }

  function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  function cardValue(card) {
    if (card.value === 'A') return 11;
    if (['K', 'Q', 'J'].includes(card.value)) return 10;
    return parseInt(card.value);
  }

  function calculateScore(hand) {
    let score = 0;
    let aceCount = 0;
    for (const card of hand) {
      score += cardValue(card);
      if (card.value === 'A') aceCount++;
    }
    while (score > 21 && aceCount > 0) {
      score -= 10;
      aceCount--;
    }
    return score;
  }

  function renderCard(card) {
    const suitSymbols = {
      hearts: '♥',
      diamonds: '♦',
      clubs: '♣',
      spades: '♠',
    };
    const colorClass = (card.suit === 'hearts' || card.suit === 'diamonds') ? 'text-red-600' : 'text-black';
    return `
      <div class="w-16 h-24 bg-white rounded-lg shadow-md flex flex-col justify-between p-2 select-none">
        <div class="text-lg font-bold ${colorClass}">${card.value}</div>
        <div class="text-2xl ${colorClass} self-end">${suitSymbols[card.suit]}</div>
      </div>
    `;
  }

  function renderHands() {
    dealerCardsDiv.innerHTML = dealerHand.map(renderCard).join('');
    playerCardsDiv.innerHTML = playerHand.map(renderCard).join('');
    dealerScoreP.textContent = `Score: ${calculateScore(dealerHand)}`;
    playerScoreP.textContent = `Score: ${calculateScore(playerHand)}`;
  }

  function checkForEnd() {
    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore(dealerHand);

    if (playerScore > 21) {
      gameMessageP.textContent = 'You busted! Dealer wins.';
      gameOver = true;
    } else if (dealerScore > 21) {
      gameMessageP.textContent = 'Dealer busted! You win!';
      gameOver = true;
    } else if (gameOver) {
      if (playerScore > dealerScore) {
        gameMessageP.textContent = 'You win!';
      } else if (playerScore < dealerScore) {
        gameMessageP.textContent = 'Dealer wins!';
      } else {
        gameMessageP.textContent = 'It\'s a tie!';
      }
    }
  }

  function dealerTurn() {
    while (calculateScore(dealerHand) < 17) {
      dealerHand.push(deck.pop());
      renderHands();
    }
    gameOver = true;
    checkForEnd();
    btnHit.disabled = true;
    btnStand.disabled = true;
  }

  function startGame() {
    gameOver = false;
    gameMessageP.textContent = '';
    createDeck();
    shuffleDeck();
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    renderHands();
    btnHit.disabled = false;
    btnStand.disabled = false;
  }

  btnHit.addEventListener('click', () => {
    if (!gameOver) {
      playerHand.push(deck.pop());
      renderHands();
      if (calculateScore(playerHand) > 21) {
        gameOver = true;
        checkForEnd();
        btnHit.disabled = true;
        btnStand.disabled = true;
      }
    }
  });

  btnStand.addEventListener('click', () => {
    if (!gameOver) {
      dealerTurn();
    }
  });

  btnNewGame.addEventListener('click', () => {
    startGame();
  });

  startGame();
}
