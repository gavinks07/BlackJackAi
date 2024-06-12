document.addEventListener('DOMContentLoaded', () => {
    const playerCount = parseInt(prompt('Enter number of players (excluding dealer):'));
    const deckCount = parseInt(prompt('Enter number of decks:'));
    const userPosition = parseInt(prompt('Enter your position from the dealer:'));

    const playersDiv = document.getElementById('players');
    const runningCountSpan = document.getElementById('running-count');
    const suggestedPlaySpan = document.getElementById('suggested-play');

    let players = [{ name: 'Dealer', hand: [], element: document.getElementById('dealer') }];
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

    let currentPlayerIndex = 1;
    let runningCount = 0;

    const cardValues = {
        '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
        'J': 10, 'Q': 10, 'K': 10, 'A': 11
    };

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
        // Example: simple strategy based on running count
        suggestedPlaySpan.textContent = runningCount > 0 ? 'S' : 'H';
    }

    function nextPlayer() {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        highlightCurrentPlayer();
    }

    function highlightCurrentPlayer() {
        players.forEach((player, index) => {
            player.element.style.backgroundColor = index === currentPlayerIndex ? '#1abc9c' : '';
        });
    }

    document.querySelectorAll('.card-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const cardValue = btn.getAttribute('data-value');
            const currentPlayer = players[currentPlayerIndex];
            currentPlayer.hand.push(cardValue);
            const handValue = updateHandValue(currentPlayer);
            runningCount += ['2', '3', '4', '5', '6'].includes(cardValue) ? 1 : 0;
            runningCount += ['10', 'J', 'Q', 'K', 'A'].includes(cardValue) ? -1 : 0;
            runningCountSpan.textContent = runningCount;
            updateSuggestedPlay();
            if (handValue > 21) {
                currentPlayer.element.style.textDecoration = 'line-through';
                nextPlayer();
            }
        });
    });

    document.getElementById('next-player').addEventListener('click', nextPlayer);
    document.getElementById('round-over').addEventListener('click', () => {
        players.forEach(player => {
            player.hand = [];
            player.element.querySelector('.hand-value').textContent = 'Hand Value: 0';
            player.element.style.textDecoration = '';
        });
        currentPlayerIndex = 1;
        runningCount = 0;
        runningCountSpan.textContent = runningCount;
        updateSuggestedPlay();
        highlightCurrentPlayer();
    });

    document.getElementById('deck-shuffle').addEventListener('click', () => {
        runningCount = 0;
        runningCountSpan.textContent = runningCount;
        updateSuggestedPlay();
    });

    document.getElementById('delete-entry').addEventListener('click', () => {
        const currentPlayer = players[currentPlayerIndex];
        if (currentPlayer.hand.length > 0) {
            const lastCard = currentPlayer.hand.pop();
            runningCount += ['2', '3', '4', '5', '6'].includes(lastCard) ? -1 : 0;
            runningCount += ['10', 'J', 'Q', 'K', 'A'].includes(lastCard) ? 1 : 0;
            runningCountSpan.textContent = runningCount;
            updateHandValue(currentPlayer);
            updateSuggestedPlay();
        }
    });

    highlightCurrentPlayer();
});
