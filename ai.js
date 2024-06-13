let aiModel = {};

function getSuggestedPlay(handValue) {
    if (handValue < 17) {
        return 'H'; // Hit
    } else if (handValue >= 17 && handValue < 21) {
        return 'S'; // Stand
    } else {
        return 'H'; // Hit (this should rarely happen)
    }
}

function updateAIModel(hand, suggestedPlay, result) {
    if (!aiModel[hand]) {
        aiModel[hand] = { H: 0, S: 0 };
    }
    aiModel[hand][suggestedPlay] += result ? 1 : -1;
    saveAIModel();
}

function saveAIModel() {
    localStorage.setItem('aiModel', JSON.stringify(aiModel));
}

function loadAIModel() {
    const model = localStorage.getItem('aiModel');
    if (model) {
        aiModel = JSON.parse(model);
    }
}

document.addEventListener('DOMContentLoaded', loadAIModel);
let deck = [];

function initializeDeck(deckCount) {
    const suits = ['H', 'D', 'C', 'S'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    deck = [];

    for (let i = 0; i < deckCount; i++) {
        for (let suit of suits) {
            for (let value of values) {
                deck.push(value);
            }
        }
    }

    shuffleDeck();
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function drawCard() {
    return deck.pop();
}

const cardValues = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 10, 'Q': 10, 'K': 10, 'A': 11
};
