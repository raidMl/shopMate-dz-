// Company Page JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
  
  // Smooth scrolling for navigation links
  document.querySelectorAll('.company-nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update active nav item
        document.querySelectorAll('.company-nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });

  // Update active nav item on scroll & back to top visibility
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.company-section');
    const navLinks = document.querySelectorAll('.company-nav-link');
    
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.pageYOffset >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
    
    // Show/hide back to top button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
      if (window.pageYOffset > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  });

  // Back to top functionality
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Set initial active nav item
  if (window.location.hash) {
    const activeLink = document.querySelector(`a[href="${window.location.hash}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  } else {
    const firstNavLink = document.querySelector('.company-nav-link');
    if (firstNavLink) {
      firstNavLink.classList.add('active');
    }
  }

  // Theme Toggle Functionality
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.querySelector('.theme-icon');
  
  if (themeToggle && themeIcon) {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update theme icon based on current theme
    function updateThemeIcon(theme) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    
    // Initialize theme icon
    updateThemeIcon(savedTheme);
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }
});