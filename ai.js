const cardValues = {
    '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 10, 'Q': 10, 'K': 10, 'A': 11
};

let aiModel = JSON.parse(localStorage.getItem('aiModel')) || {};

function updateAIModel(situation, decision, outcome) {
    if (!aiModel[situation]) {
        aiModel[situation] = { H: 0, S: 0 };
    }
    aiModel[situation][decision] += outcome ? 1 : -1;
    localStorage.setItem('aiModel', JSON.stringify(aiModel));
}

function getSuggestedPlay(handValue) {
    const situation = `${handValue}`;
    if (!aiModel[situation]) return 'H';
    return aiModel[situation].H >= aiModel[situation].S ? 'H' : 'S';
}

let deck = [];

function initializeDeck(deckCount) {
    deck = [];
    for (let i = 0; i < deckCount; i++) {
        for (let key in cardValues) {
            for (let j = 0; j < 4; j++) {
                deck.push(key);
            }
        }
    }
}

function drawCard() {
    const randomIndex = Math.floor(Math.random() * deck.length);
    return deck.splice(randomIndex, 1)[0];
}
