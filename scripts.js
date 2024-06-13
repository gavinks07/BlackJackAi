document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');

    const playerCountInput = document.getElementById('player-count');
    const deckCountInput = document.getElementById('deck-count');
    const userPositionInput = document.getElementById('user-position');
    const startGameButton = document.getElementById('start-game');

    const playersDiv = document.getElementById('players');
    const runningCountSpan = document.getElementById('running-count');
    const suggestedPlaySpan = document.getElementById('suggested-play');

    let players = [];
    let currentPlayerIndex = 1;
    let runningCount = 0;

    startGameButton.addEventListener('click', () => {
        const playerCount = parseInt(playerCountInput.value);
        const deckCount = parseInt(deckCountInput.value);
        const userPosition = parseInt(userPositionInput.value);

        initializeDeck(deckCount);

        // Clear previous players
        playersDiv.innerHTML = '<div id="dealer" class="player">Dealer<br><span class="hand-value">Hand Value: 0</span></div>';
        players = [{ name: 'Dealer', hand: [], element: document.getElementById('dealer') }];
        
        for (let i = 1; i <= playerCount; i++) {
            const playerDiv = document.createElement('div');
            playerDiv.classList.add('player');
            playerDiv.id = `player-${i}`;
            playerDiv.innerHTML = `Player ${i}<br><span class="hand-value">Hand Value: 0</span>`;
            players.push({ name: `Player ${i}`, hand: [], element: playerDiv });
            playersDiv.appendChild(playerDiv);
        }

        players[userPosition].name = 'You';
        players[userPosition].element.innerHTML = 'You<br><span class="hand-value">Hand Value: 0</span>';

        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');

        highlightCurrentPlayer();
    });

    function updateHandValue(player) {
        let handValue = player.hand.reduce((sum, card) => sum + cardValues[card], 0);
        let acesCount = player.hand.filter(card => card === 'A').length;
        while (handValue > 21 && acesCount > 0) {
            handValue -= 10;
            acesCount--;
        }
        player.element.querySelector('.hand-value').textContent = `Hand Value: ${handValue}`;
        return handValue;
    }

    function updateSuggestedPlay() {
        const currentPlayer = players[currentPlayerIndex];
        const handValue = updateHandValue(currentPlayer);
        suggestedPlaySpan.textContent = getSuggestedPlay(handValue);
    }

    function highlightCurrentPlayer() {
        players.forEach((player, index) => {
            player.element.style.backgroundColor = index === currentPlayerIndex ? '#2980b9' : '';
        });
    }

    document.querySelectorAll('.card-btn').forEach(button => {
        button.addEventListener('click', () => {
            const cardValue = button.getAttribute('data-value');
            const currentPlayer = players[currentPlayerIndex];
            currentPlayer.hand.push(cardValue);
            const handValue = updateHandValue(currentPlayer);

            const suggestedPlay = getSuggestedPlay(handValue);
            if (suggestedPlay !== 'H') {
                updateAIModel(currentPlayer.hand.join(','), suggestedPlay, false);
            }

            runningCount += ['2', '3', '4', '5', '6'].includes(cardValue) ? 1 : 0;
            runningCount += ['10', 'J', 'Q', 'K', 'A'].includes(cardValue) ? -1 : 0;
            runningCountSpan.textContent = runningCount;

            if (handValue >= 21) {
                if (handValue === 21) {
                    currentPlayer.element.querySelector('.hand-value').textContent += ' - Blackjack!';
                } else {
                    currentPlayer.element.style.textDecoration = 'line-through';
                }
                nextPlayer();
            } else {
                updateSuggestedPlay();
            }
        });
    });

    function nextPlayer() {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        if (currentPlayerIndex === 0) {
            currentPlayerIndex = 1;
        }
        if (currentPlayerIndex === players.length - 1) {
            currentPlayerIndex = 0; // Switch to dealer's turn after all players have had their turn
            // Dealer's turn logic here
        }
        highlightCurrentPlayer();
    }

    document.getElementById('next-player').addEventListener('click', nextPlayer);

    document.getElementById('round-over').addEventListener('click', () => {
        players.forEach(player => {
            player.hand = [];
            player.element.querySelector('.hand-value').textContent = 'Hand Value: 0';
            player.element.style.textDecoration = '';
        });
        currentPlayerIndex = 1;
        highlightCurrentPlayer();
    });

    document.getElementById('deck-shuffle').addEventListener('click', () => {
        runningCount = 0;
        runningCountSpan.textContent = runningCount;
        updateSuggestedPlay();
    });

    document.getElementById('delete-entry').addEventListener('click', () => {
        players.forEach(player => {
            if (player.hand.length > 0) {
                const lastCard = player.hand.pop();
                updateHandValue(player);
                runningCount += ['2', '3', '4', '5', '6'].includes(lastCard) ? -1 : 0;
                runningCount += ['10', 'J', 'Q', 'K', 'A'].includes(lastCard) ? 1 : 0;
                runningCountSpan.textContent = runningCount;
                updateSuggestedPlay();
            }
        });
    });
});
