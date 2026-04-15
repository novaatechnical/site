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