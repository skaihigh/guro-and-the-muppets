// Guro and the Muppets - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }

  // Close mobile nav when clicking outside
  document.addEventListener('click', function(e) {
    if (navLinks && navLinks.classList.contains('active')) {
      if (!e.target.closest('.nav-links') && !e.target.closest('.nav-toggle')) {
        navLinks.classList.remove('active');
      }
    }
  });

  // Auto-close details when opening another
  const instrumentPlayers = document.querySelectorAll('.instrument-player');
  instrumentPlayers.forEach(function(player) {
    player.addEventListener('toggle', function() {
      if (this.open) {
        instrumentPlayers.forEach(function(other) {
          if (other !== player && other.open) {
            other.open = false;
          }
        });
      }
    });
  });
});
