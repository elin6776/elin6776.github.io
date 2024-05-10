document.addEventListener("DOMContentLoaded", function() {
    const grid_container = document.getElementById("grid-container");
    const timer_element = document.getElementById("timer");
    const result_element = document.getElementById("result");
    const grid_size = 10;
    let num_walls = 15;
    let timer_interval;
    let elapsed_time = 0;
    let timer_running = false;
    let game_end = false;
    let result;

    function startTimer() {
        timer_running = true;
        timer_interval = setInterval(function() {
            elapsed_time++;
            const minutes = Math.floor(elapsed_time / 60).toString().padStart(2, '0');
            const seconds = (elapsed_time % 60).toString().padStart(2, '0');
            timer_element.textContent = `${minutes}:${seconds}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer_interval);
        timer_running = false;
    }

    // Function to generate the grid
    function generateGrid() {
        // TO clear the grid
        grid_container.innerHTML = "";

        // Create the grid
        for (let i = 0; i < grid_size * grid_size; i++) {
            const cell = document.createElement("div");
            cell.classList.add("dot");
            grid_container.appendChild(cell);
        }

        // Add player and exit
        const dots = document.querySelectorAll(".dot");
        dots[0].classList.add("player");
        dots[dots.length - 1].classList.add("exit");

        // Generate walls
        const wallIndices = new Set();
        while (wallIndices.size < num_walls) {
            const randomIndex = Math.floor(Math.random() * (grid_size * grid_size));
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
        if (game_end) return;

        let new_position;
        const player_position = Array.from(grid_container.children).findIndex(dot => dot.classList.contains("player"));

        if (!timer_running) {
            startTimer();
        }

        switch (event.key) {
            case "ArrowUp":
                new_position = player_position - grid_size;
                break;
            case "ArrowDown":
                new_position = player_position + grid_size;
                break;
            case "ArrowLeft":
                new_position = player_position % grid_size === 0 ? player_position : player_position - 1;
                break;
            case "ArrowRight":
                new_position = (player_position + 1) % grid_size === 0 ? player_position : player_position + 1;
                break;
            default:
                return;
        }

        if (grid_container.children[new_position] && !grid_container.children[new_position].classList.contains("wall")) {
            grid_container.children[player_position].classList.remove("player");
            grid_container.children[new_position].classList.add("player");

            if (grid_container.children[new_position].classList.contains("exit")) {
                stopTimer();
                grid_container.children[new_position].style.backgroundColor = 'orange';
                game_end = true;
                if (elapsed_time <= 2) {
                    result = "Fast Escape";
                } 
                else if (elapsed_time < 5) {
                    result = "Steady Escape";
                } 
                else {
                    result = "Slow Escape";
                }
                result_element.textContent = result;
                result_element.classList.add("pop");

                setTimeout(function() {
                    result_element.classList.remove("pop");
                }, 1000);
            }
        }
        if(num_walls == 25){
            document.getElementById("smokescreen").style.visibility = "hidden";
        }
    });

    document.getElementById("hamburger").addEventListener("click", function() {
        var dropdownContent = document.getElementById("dropdown-content");
        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none";
        } else {
            dropdownContent.style.display = "block";
        }
    });
    
    // Reset button
    const resetButton = document.getElementById("reset");
    resetButton.addEventListener("click", function() {
        if(num_walls == 25){
            document.getElementById("smokescreen").style.visibility = "visible";
        }
        stopTimer();
        elapsed_time = 0;
        timer_element.textContent = "00:00";
        result_element.textContent = "";
        game_end = false;
        generateGrid();
    });

    // Easy
    const easyButton = document.getElementById("easy");
    easyButton.addEventListener("click", function() {
        stopTimer();
        elapsed_time = 0;
        timer_element.textContent = "00:00";
        result_element.textContent = "";
        game_end = false;
        num_walls = 15;
        document.getElementById("smokescreen").style.visibility = "hidden";
        generateGrid();
    });

    // Normal
    const normalButton = document.getElementById("normal");
    normalButton.addEventListener("click", function() {
        stopTimer();
        elapsed_time = 0;
        timer_element.textContent = "00:00";
        result_element.textContent = "";
        game_end = false;
        num_walls = 20;
        document.getElementById("smokescreen").style.visibility = "hidden";
        generateGrid();
    });

    // Hard
    const hardButton = document.getElementById("hard");
    hardButton.addEventListener("click", function() {
        stopTimer();
        elapsed_time = 0;
        timer_element.textContent = "00:00";
        result_element.textContent = "";
        game_end = false;
        num_walls = 25;
        document.getElementById("smokescreen").style.visibility = "visible";
        generateGrid();

    });
});


