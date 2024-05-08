document.addEventListener("DOMContentLoaded", function() {
    const gridContainer = document.getElementById("grid-container");
    const timerElement = document.getElementById("timer");
    const resultElement = document.getElementById("result");
    const gridSize = 10;
    const numWalls = 15;
    let timerInterval;
    let elapsedTime = 0;
    let timerRunning = false;
    let gameOver = false;
    let result;

    function startTimer() {
        timerRunning = true;
        timerInterval = setInterval(function() {
            elapsedTime++;
            const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
            const seconds = (elapsedTime % 60).toString().padStart(2, '0');
            timerElement.textContent = `${minutes}:${seconds}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerRunning = false;
    }

    // Function to generate the grid
    function generateGrid() {
        // TO clear the grid
        gridContainer.innerHTML = "";

        // Create the grid
        for (let i = 0; i < gridSize * gridSize; i++) {
            const cell = document.createElement("div");
            cell.classList.add("dot");
            gridContainer.appendChild(cell);
        }

        // Add player and exit
        const dots = document.querySelectorAll(".dot");
        dots[0].classList.add("player");
        dots[dots.length - 1].classList.add("exit");

        // Generate walls
        const wallIndices = new Set();
        while (wallIndices.size < numWalls) {
            const randomIndex = Math.floor(Math.random() * (gridSize * gridSize));
            if (randomIndex !== 0 && randomIndex !== dots.length - 1) {
                wallIndices.add(randomIndex);
                dots[randomIndex].classList.add("wall");
            }
        }
    }

    generateGrid();

    // Move player
    document.addEventListener("keydown", function(event) {
        // Stop movement if the game is over
        if (gameOver) return;

        let new_position;
        const player_position = Array.from(gridContainer.children).findIndex(dot => dot.classList.contains("player"));

        if (!timerRunning) {
            startTimer();
        }

        switch (event.key) {
            case "ArrowUp":
                new_position = player_position - gridSize;
                break;
            case "ArrowDown":
                new_position = player_position + gridSize;
                break;
            case "ArrowLeft":
                new_position = player_position % gridSize === 0 ? player_position : player_position - 1;
                break;
            case "ArrowRight":
                new_position = (player_position + 1) % gridSize === 0 ? player_position : player_position + 1;
                break;
            default:
                return;
        }

        if (gridContainer.children[new_position] && !gridContainer.children[new_position].classList.contains("wall")) {
            gridContainer.children[player_position].classList.remove("player");
            gridContainer.children[new_position].classList.add("player");

            if (gridContainer.children[new_position].classList.contains("exit")) {
                stopTimer();
                gameOver = true;
                if (elapsedTime <= 2) {
                    result = "Fast Escape";
                } 
                else if (elapsedTime < 5) {
                    result = "Steady Escape";
                } 
                else {
                    result = "Slow Escape";
                }
                resultElement.textContent = result;
            }
        }
    });

    // Reset button
    const resetButton = document.getElementById("reset");
    resetButton.addEventListener("click", function() {
        stopTimer();
        elapsedTime = 0;
        timerElement.textContent = "00:00";
        resultElement.textContent = "Result";
        gameOver = false;
        generateGrid();
    });

});


