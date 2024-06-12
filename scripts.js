let numPlayers = 0;
let numDecks = 1;
let playerPosition = 1;
let players = [];
let originalPlayers = [];
let currentPlayerIndex = 1; // Start with player 1
let runningCount = 0;
let history = [];
let model = {};

const cardValues = {
  'A': 11,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  'J': 10,
  'Q': 10,
  'K': 10
};

const hiLowValues = {
  'A': -1,
  '2': 1,
  '3': 1,
  '4': 1,
  '5': 1,
  '6': 1,
  '7': 0,
  '8': 0,
  '9': 0,
  '10': -1,
  'J': -1,
  'Q': -1,
  'K': -1
};

async function startGame() {
  numPlayers = parseInt(document.getElementById('num-players').value);
  numDecks = parseInt(document.getElementById('num-decks').value);
  playerPosition = parseInt(document.getElementById('player-position').value);

  if (isNaN(numPlayers) || isNaN(numDecks) || isNaN(playerPosition)) {
    alert('Please enter valid numbers for all fields.');
    return;
  }

  players = [];
  for (let i = 0; i < numPlayers; i++) {
    const playerName = i + 1 === playerPosition ? 'You' : `Player ${i + 1}`;
    players.push({ id: i + 1, name: playerName, cards: [], handValue: 0 });
    originalPlayers.push({ id: i + 1, name: playerName, cards: [], handValue: 0 });
  }

  renderPlayers();
  highlightCurrentPlayer();
  document.getElementById('home-screen').classList.remove('active');
  document.getElementById('main-screen').classList.add('active');
}

function renderPlayers() {
  const playersContainer = document.getElementById('players-container');
  playersContainer.innerHTML = '';

  players.forEach(player => {
    const playerDiv = document.createElement('div');
    playerDiv.className = 'player';
    playerDiv.id = `player${player.id}`;
    playerDiv.innerHTML = `
      <h2 id="player${player.id}-name">${player.name}</h2>
      <div class="cards" id="player${player.id}-cards"></div>
      <div>Hand Value: <span id="player${player.id}-value">0</span></div>
    `;
    playersContainer.appendChild(playerDiv);
  });
}

function highlightCurrentPlayer() {
  document.querySelectorAll('.player').forEach(player => player.classList.remove('highlight'));
  document.getElementById('dealer').classList.remove('highlight');
  if (currentPlayerIndex === 0) {
    document.getElementById('dealer').classList.add('highlight');
  } else {
    document.getElementById(`player${currentPlayerIndex}`).classList.add('highlight');
  }
}

function addCard(card) {
  if (currentPlayerIndex === 0) {
    addCardToPlayer('dealer', card);
  } else {
    addCardToPlayer(`player${currentPlayerIndex}`, card);
  }
  updateSuggestedPlay();
}

function addCardToPlayer(playerId, card) {
  const player = playerId === 'dealer' ? { name: 'Dealer', cards: dealerCards, handValue: dealerHandValue } : players.find(p => p.id === currentPlayerIndex);
  player.cards.push(card);

  if (playerId === 'dealer') {
    dealerCards.push(card);
    dealerHandValue = calculateHandValue(dealerCards);
    document.getElementById('dealer-cards').innerHTML = dealerCards.map(c => `<div class="card">${c}</div>`).join('');
    document.getElementById('dealer-value').textContent = dealerHandValue;
  } else {
    player.handValue = calculateHandValue(player.cards);
    document.getElementById(`${playerId}-cards`).innerHTML = player.cards.map(c => `<div class="card">${c}</div>`).join('');
    document.getElementById(`${playerId}-value`).textContent = player.handValue;
  }

  runningCount += hiLowValues[card];
  document.getElementById('running-count').textContent = runningCount;

  if (player.handValue > 21) {
    const aceIndex = player.cards.indexOf('A');
    if (aceIndex > -1) {
      player.cards[aceIndex] = '1';
      player.handValue = calculateHandValue(player.cards);
      document.getElementById(`${playerId}-cards`).innerHTML = player.cards.map(c => `<div class="card">${c}</div>`).join('');
      document.getElementById(`${playerId}-value`).textContent = player.handValue;
    } else {
      document.getElementById(`${playerId}-name`).style.textDecoration = 'line-through';
      nextPlayer();
    }
  }
}

function calculateHandValue(cards) {
  let value = cards.reduce((sum, card) => sum + cardValues[card], 0);
  let numAces = cards.filter(card => card === 'A').length;
  while (value > 21 && numAces > 0) {
    value -= 10;
    numAces--;
  }
  return value;
}

function nextPlayer() {
  currentPlayerIndex = (currentPlayerIndex + 1) % (players.length + 1);
  highlightCurrentPlayer();
}

function roundOver() {
  players.forEach(player => {
    player.cards = [];
    player.handValue = 0;
  });
  dealerCards = [];
  dealerHandValue = 0;
  runningCount = 0;
  currentPlayerIndex = 1;
  renderPlayers();
  highlightCurrentPlayer();
  document.getElementById('dealer-cards').innerHTML = '';
  document.getElementById('dealer-value').textContent = '0';
  document.getElementById('running-count').textContent = '0';
  document.getElementById('suggested-play').textContent = 'N/A';
}

function deckShuffle() {
  runningCount = 0;
  document.getElementById('running-count').textContent = '0';
}

function deleteEntry() {
  const player = currentPlayerIndex === 0 ? { name: 'Dealer', cards: dealerCards, handValue: dealerHandValue } : players.find(p => p.id === currentPlayerIndex);
  if (player.cards.length > 0) {
    const removedCard = player.cards.pop();
    runningCount -= hiLowValues[removedCard];
    document.getElementById('running-count').textContent = runningCount;
    if (currentPlayerIndex === 0) {
      dealerHandValue = calculateHandValue(dealerCards);
      document.getElementById('dealer-cards').innerHTML = dealerCards.map(c => `<div class="card">${c}</div>`).join('');
      document.getElementById('dealer-value').textContent = dealerHandValue;
    } else {
      player.handValue = calculateHandValue(player.cards);
      document.getElementById(`player${currentPlayerIndex}-cards`).innerHTML = player.cards.map(c => `<div class="card">${c}</div>`).join('');
      document.getElementById(`player${currentPlayerIndex}-value`).textContent = player.handValue;
    }
    updateSuggestedPlay();
  }
}

function updateSuggestedPlay() {
  // Placeholder logic for suggested play
  const player = players.find(p => p.id === currentPlayerIndex);
  if (player.handValue < 17) {
    document.getElementById('suggested-play').textContent = 'H';
  } else {
    document.getElementById('suggested-play').textContent = 'S';
  }
}

async function saveModel() {
  const githubToken = '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';
  const url = `https://api.github.com/repos/gavinks07/BlackJackAi/contents/blackjack_model.json`;
  const content = btoa(JSON.stringify(model, null, 2));
  const message = 'Update model';

  const headers = new Headers({
    'Authorization': `token ${githubToken}`,
    'Content-Type': 'application/json'
  });

  const getShaResponse = await fetch(url, { headers });
  const sha = getShaResponse.ok ? (await getShaResponse.json()).sha : undefined;

  const body = JSON.stringify({
    message,
    content,
    sha
  });

  try {
    const response = await fetch(url, { method: 'PUT', headers, body });
    if (!response.ok) {
      throw new Error(`Failed to save model: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error saving model:', error);
  }
}
