'use strict';



const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const navbarToggler = document.querySelector("[data-nav-toggler]");

navbarToggler.addEventListener("click", function () {
  navbar.classList.toggle("active");
  this.classList.toggle("active");
});

for (let i = 0; i < navbarLinks.length; i++) {
  navbarLinks[i].addEventListener("click", function () {
    navbar.classList.remove("active");
    navbarToggler.classList.remove("active");
  });
}

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 200) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
});

function toggleDropdown(event) {
  event.preventDefault();
  const parent = event.target.closest(".dropdown");
  parent.classList.toggle("active");

  // Close others if you want only one open
  document.querySelectorAll(".dropdown").forEach(drop => {
    if (drop !== parent) drop.classList.remove("active");
  });

  document.addEventListener('click', function (e) {
      if (!e.target.closest('.dropdown')) {
          document.querySelectorAll('.dropdown').forEach(drop => drop.classList.remove('active'));
      }
  });
}



document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const submitBtn = form.querySelector('[type="submit"]');

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    submitBtn.disabled = true;
    status.textContent = 'Sending message...';
    status.style.color = '#00FFFF';

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
    .then(response => {
      if (response.ok) {
        status.textContent = 'Message sent successfully!';
        status.style.color = 'lightgreen';
        form.reset();
      } else {
        return response.json().then(data => {
          throw new Error(data.message || 'Form submission failed');
        });
      }
    })
    .catch(error => {
      status.textContent = `Error: ${error.message}`;
      status.style.color = '#ff5555';
      console.error('Form submission error:', error);
    })
    .finally(() => {
      submitBtn.disabled = false;
      setTimeout(() => { status.textContent = ''; }, 5000);
    });
  });
});


