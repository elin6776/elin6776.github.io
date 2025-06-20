window.addEventListener('load', () => {
  const toggleButton = document.getElementById('theme-toggle');
  const githubIcon = document.getElementById('github-icon');

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (toggleButton) toggleButton.checked = true;
    if (githubIcon) {
      githubIcon.src = 'https://cdn-icons-png.flaticon.com/512/5968/5968866.png';
      githubIcon.style.width = '36px';
      githubIcon.style.height = '36px';
    }
  } else {
    document.body.classList.remove('dark-mode');
    if (toggleButton) toggleButton.checked = false;
    if (githubIcon) {
      githubIcon.src = 'https://cdn-icons-png.flaticon.com/512/733/733609.png';
    }
  }
});
