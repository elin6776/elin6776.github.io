window.addEventListener('load', () => {
  fetch('projects.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(projects => {
      const container = document.getElementById("container");
      let currentBouncingImg = null;

      projects.forEach(project => {
        const box = document.createElement("div");
        box.classList.add("box");

        // Link to page 
        if (project.page) {
          box.style.cursor = 'pointer';

          box.addEventListener('click', () => {
            window.location.href = project.page;
          });
        }

        // Title
        const title = document.createElement("div");
        title.classList.add("box-title");
        title.textContent = project.title;
        box.appendChild(title);
        
        // Image
        if (project.icon) {
          const img = document.createElement("img");
          img.src = project.icon;
          img.alt = project.title;
          img.classList.add("project-img");

          // Bounce for both box and img
          img.addEventListener("mouseenter", () => {
            if (currentBouncingImg && currentBouncingImg !== img) {
              gsap.killTweensOf(currentBouncingImg);
              gsap.to(currentBouncingImg, { y: 0, duration: 0.1 });
            }
            currentBouncingImg = img;

            gsap.to(img, {
              duration: 0.5,
              y: -15,
              repeat: 5,
              yoyo: true,
              ease: "power1.inOut",
              onComplete: () => {
                gsap.to(img, { y: 0, duration: 0.2, ease: "power1.out" });
                if (currentBouncingImg === img) currentBouncingImg = null; 
              }
            });
          });

          img.addEventListener("mouseleave", () => {
            if (currentBouncingImg === img) currentBouncingImg = null;
          });

          box.appendChild(img);
        }

        // Description
        if (project.description) {
          const desc = document.createElement("p");
          desc.classList.add("box-description");

          const isSmallScreen = window.innerWidth < 1200;

          if (isSmallScreen) {
            const words = project.description.split(" ");
            const shortened = words.slice(0, 15).join(" ");
            desc.textContent = shortened + (words.length > 15 ? "..." : "");
          } else {
            desc.textContent = project.description;
          }

          box.appendChild(desc);
        }

        // Fade other boxes
        box.addEventListener("mouseenter", () => {
          gsap.to(box, { y: -10, duration: 0.2, ease: "bounce.out" });

          const allBoxes = container.querySelectorAll(".box");
          allBoxes.forEach(otherBox => {
            if (otherBox !== box) {
              gsap.killTweensOf(otherBox.querySelectorAll("img"));
              otherBox.querySelectorAll("img").forEach(img => {
                gsap.to(img, { y: 0, duration: 0.1 });
              });
              otherBox.classList.add("faded");
            }
          });
        });

        box.addEventListener("mouseleave", () => {
          gsap.to(box, { y: 0, duration: 0.2, ease: "power1.out" });

          const allBoxes = container.querySelectorAll(".box");
          allBoxes.forEach(otherBox => {
            otherBox.classList.remove("faded");
          });
        });

        container.appendChild(box);
      });
    })
    .catch(error => {
      console.error('Error loading project data:', error);
    });

  // Typewriter
  const text = "Hi welcome to my website\nI'm happy you're here!";
  const element = document.getElementById("typewriter");
  let index = 0;

  function type() {
    if (index < text.length) {
      const char = text[index] === '\n' ? '<br>' : text[index];
      element.innerHTML += char;
      index++;
      setTimeout(type, 75); 
    } else {
      element.classList.add('done-typing');
    }
  }

  type();

  // Toggle Theme with localStorage
  const toggleButton = document.getElementById('theme-toggle');
  const githubIcon = document.getElementById('github-icon');

  // Apply saved theme on load
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    toggleButton.checked = true;
    githubIcon.src = 'https://cdn-icons-png.flaticon.com/512/5968/5968866.png'; 
    githubIcon.style.width = '36px';  
    githubIcon.style.height = '36px';
  } else {
    document.body.classList.remove('dark-mode');
    toggleButton.checked = false;
    githubIcon.src = 'https://cdn-icons-png.flaticon.com/512/733/733609.png'; 
  }

  // Toggle event listener to update theme 
  toggleButton.addEventListener('change', () => {
    const isDark = document.body.classList.toggle('dark-mode');

    if (isDark) {
      githubIcon.src = 'https://cdn-icons-png.flaticon.com/512/5968/5968866.png'; 
      githubIcon.style.width = '36px';  
      githubIcon.style.height = '36px';
      localStorage.setItem('theme', 'dark');
    } else {
      githubIcon.src = 'https://cdn-icons-png.flaticon.com/512/733/733609.png'; 
      localStorage.setItem('theme', 'light');
    }
  });
});
