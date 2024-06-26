class Player {
    constructor(name, cube1, cube2) {
        this.name = name;
        this.totalScore = 0;
        this.currentScore = 0;
        this.cube1 = cube1;
        this.cube2 = cube2;
        this.currentClass1 = '';
        this.currentClass2 = '';
    }

    rollDice() {
        const roll1 = getRandomInt(1, 7);
        const roll2 = getRandomInt(1, 7);
        this.showDice(this.cube1, roll1);
        this.showDice(this.cube2, roll2);
        this.currentScore = this.calculateScore([roll1, roll2]);
        this.totalScore += this.currentScore;
        return [roll1, roll2];
    }

    showDice(cube, value) {
        const showClass = 'show-' + value;
        if (cube === this.cube1) {
            if (this.currentClass1) {
                cube.classList.remove(this.currentClass1);
            }
            this.currentClass1 = showClass;
        } else {
            if (this.currentClass2) {
                cube.classList.remove(this.currentClass2);
            }
            this.currentClass2 = showClass;
        }
        cube.classList.add(showClass);
    }

    calculateScore(roll) {
        if (roll.includes(1)) return 0;
        if (roll[0] === roll[1]) return (roll[0] + roll[1]) * 2;
        return roll[0] + roll[1];
    }

    reset() {
        this.totalScore = 0;
        this.currentScore = 0;
        this.currentClass1 = '';
        this.currentClass2 = '';
        this.cube1.className = 'cube player-cube1';
        this.cube2.className = 'cube player-cube2';
    }
}

class Game {
    constructor() {
        this.player = new Player('Player', document.querySelector('.player-cube1'), document.querySelector('.player-cube2'));
        this.computer = new Player('Computer', document.querySelector('.computer-cube1'), document.querySelector('.computer-cube2'));
        this.rolls = 0;

        document.getElementById('roll-button').addEventListener('click', () => this.rollDice());
        document.getElementById('reset-button').addEventListener('click', () => this.resetGame());

        this.initPopups();
    }

    initPopups() {
        const popup = document.getElementById('popup');
        const closePopup = document.getElementById('close-popup');

        closePopup.addEventListener('click', () => {
            popup.style.opacity = '0';
            setTimeout(() => {
                popup.style.display = 'none';
            }, 300);
        });

        document.querySelectorAll('.close-result-popup').forEach(button => {
            button.addEventListener('click', () => {
                const parentPopup = button.closest('.result-popup');
                parentPopup.style.opacity = '0';
                setTimeout(() => {
                    parentPopup.style.display = 'none';
                    this.showPlayAgainPopup();
                }, 300);
            });
        });

        document.querySelector('.close-play-again-popup').addEventListener('click', () => {
            const playAgainPopup = document.getElementById('play-again-popup');
            playAgainPopup.style.opacity = '0';
            setTimeout(() => {
                playAgainPopup.style.display = 'none';
            }, 300);
        });

        setTimeout(() => {
            popup.style.display = 'flex';
            setTimeout(() => {
                popup.style.opacity = '1';
            }, 10);
        }, 300);
    }

    rollDice() {
        if (this.rolls < 3) {
            const playerRoll = this.player.rollDice();
            const computerRoll = this.computer.rollDice();

            this.updateScores(playerRoll, computerRoll);
            this.rolls++;
            if (this.rolls === 3) {
                setTimeout(() => this.determineWinner(), 1000);  // Delay to ensure dice faces and scores are updated before showing the popup
                document.getElementById('roll-button').disabled = true;
            }
        }
    }

    updateScores(playerRoll, computerRoll) {
        document.getElementById('player-roll').textContent = `Roll: [${playerRoll[0]}, ${playerRoll[1]}]`;
        document.getElementById('computer-roll').textContent = `Roll: [${computerRoll[0]}, ${computerRoll[1]}]`;
        document.getElementById('player-score').textContent = `Score: ${this.player.currentScore}`;
        document.getElementById('computer-score').textContent = `Score: ${this.computer.currentScore}`;
        document.getElementById('player-total').textContent = `Total: ${this.player.totalScore}`;
        document.getElementById('computer-total').textContent = `Total: ${this.computer.totalScore}`;
    }

    determineWinner() {
        if (this.player.totalScore > this.computer.totalScore) {
            this.showResultPopup('player-wins-popup');
            this.startAnimation('winner-panda-img', 'winner');
        } else if (this.player.totalScore < this.computer.totalScore) {
            this.showResultPopup('computer-wins-popup');
            this.startAnimation('loser-panda-img', 'loser');
        } else {
            this.showResultPopup('tie-popup');
            this.startAnimation('tie-panda-img', 'tie');
        }
    }

    showResultPopup(popupId) {
        const popup = document.getElementById(popupId);
        setTimeout(() => {
            popup.style.display = 'flex';
            setTimeout(() => {
                popup.style.opacity = '1';
            }, 10);
        }, 500); // Delay to ensure player can see the final results before the popup appears
    }

    showPlayAgainPopup() {
        const playAgainPopup = document.getElementById('play-again-popup');
        playAgainPopup.style.display = 'flex';
        setTimeout(() => {
            playAgainPopup.style.opacity = '1';
        }, 10);
    }

    startAnimation(imgId, type) {
        const pandaImg = document.getElementById(imgId);
        let currentFrame = 1;
        let forward = true;

        clearInterval(window[`${type}PandaInterval`]);

        function updatePandaImage() {
            pandaImg.src = `images/pandas/${type}-panda-${String(currentFrame).padStart(2, '0')}.png`;

            if (forward) {
                currentFrame++;
                if (currentFrame > 13) {
                    forward = false;
                    currentFrame = 12;
                }
            } else {
                currentFrame--;
                if (currentFrame < 1) {
                    forward = true;
                    currentFrame = 2;
                }
            }
        }

        window[`${type}PandaInterval`] = setInterval(updatePandaImage, 100); // Change image every 100ms
    }

    resetGame() {
        this.player.reset();
        this.computer.reset();
        this.rolls = 0;

        document.getElementById('player-score').textContent = 'Score: 0';
        document.getElementById('computer-score').textContent = 'Score: 0';
        document.getElementById('player-total').textContent = 'Total: 0';
        document.getElementById('computer-total').textContent = 'Total: 0';
        document.getElementById('player-roll').textContent = 'Roll: [0, 0]';
        document.getElementById('computer-roll').textContent = 'Roll: [0, 0]';
        document.getElementById('roll-button').disabled = false;

        clearInterval(window.loserPandaInterval);
        clearInterval(window.winnerPandaInterval);
        clearInterval(window.tiePandaInterval);
    }
}

// Helper function to generate a random number between min and max
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

// Start the game
window.onload = () => {
    new Game();
};
