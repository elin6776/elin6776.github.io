document.addEventListener("DOMContentLoaded", function() {
    const grid_container = document.getElementById("grid-container");
    const timer_element = document.getElementById("timer");
    const result_element = document.getElementById("result");
    const easyButton = document.getElementById("easy");
    const normalButton = document.getElementById("normal");
    const hardButton = document.getElementById("hard");
    var closeButton = document.querySelector(".closeButton");
    var close_instructions = document.getElementById("close_instructions");
    var dropdownContent = document.getElementById("dropdown-content");
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

    function resultTime(elapsed_time){
        let result;
        if (elapsed_time <= 2) {
            result = "Fast Escape";
        } 
        else if (elapsed_time < 5) {
            result = "Steady Escape";
        } 
        else {
            result = "Slow Escape";
        }
        return result;
    }

    function generatePath(dots) {
        let path = [0];
        let current = 0;

        while (current < dots.length - 1) {
            let next;
            // Randomly choose to move right or down
            if (current % grid_size === grid_size - 1) {
                // Right edge, can only move down
                next = current + grid_size;
            } 
            else if (current + grid_size >= dots.length) {
                // Bottom edge, can only move right
                next = current + 1;
            } 
            else {
                next = Math.random() < 0.5 ? current + 1 : current + grid_size;
            }
            // Prevents loop 
            if (!path.includes(next)) {
                path.push(next);
                current = next;
            }
        }

        return path;
    }

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

        // Generate a guaranteed path
        let path = generatePath(dots);
        for (let index of path) {
            dots[index].classList.add("path");
        }

        // Generate walls
        const wallIndices = new Set();
        while (wallIndices.size < num_walls) {
            const randomIndex = Math.floor(Math.random() * (grid_size * grid_size));
            // Check if it's the start, end, or on the path
            if (randomIndex !== 0 && randomIndex !== dots.length - 1 && !path.includes(randomIndex)) {
                wallIndices.add(randomIndex);
                dots[randomIndex].classList.add("wall");
            }
        }
        
        if (num_walls == 15) {
            easyButton.style.backgroundColor = "grey";
            normalButton.style.backgroundColor = ""; 
            hardButton.style.backgroundColor = ""; 
        } 
        else if (num_walls == 20) {
            normalButton.style.backgroundColor = "grey";
            easyButton.style.backgroundColor = "";
            hardButton.style.backgroundColor = ""; 
        } 
        else if (num_walls == 25) {
            hardButton.style.backgroundColor = "grey";
            easyButton.style.backgroundColor = ""; 
            normalButton.style.backgroundColor = "";
        }
        
    }

    generateGrid();

    closeButton.addEventListener("click", function() {
        close_instructions.style.display = "none";
    });
    
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
                result = resultTime(elapsed_time);
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

    document.getElementById("hamburger").addEventListener("click", function(event) {
        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none";
        } 
        else {
            dropdownContent.style.display = "block";
        }
        // Prevents the document click event when hamburger is clicked
        event.stopPropagation();
    });
    
    document.addEventListener("click", function() {
        var dropdownContent = document.getElementById("dropdown-content");
        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none";
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


