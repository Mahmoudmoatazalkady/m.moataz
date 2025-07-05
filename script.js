
// Responsive navbar toggle with fullscreen menu and close button
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

function closeMenu() {
  navLinks.classList.remove('open');
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.add('open');
    // Add close button if not present
    if (!navLinks.querySelector('.close-btn')) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'close-btn';
      closeBtn.innerHTML = '&times;';
      closeBtn.setAttribute('aria-label', 'Close menu');
      closeBtn.onclick = closeMenu;
      navLinks.insertBefore(closeBtn, navLinks.firstChild);
    }
  });
}

// Close menu when clicking a nav link (mobile UX)
navLinks && navLinks.addEventListener('click', function(e) {
  if (e.target.tagName === 'A') {
    closeMenu();
  }
});

// Highlight active nav link (for single-page navigation)
const links = document.querySelectorAll('.nav-links a');
links.forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});
