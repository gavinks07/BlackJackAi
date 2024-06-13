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
