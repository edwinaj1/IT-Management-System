// script.js - basic behaviors for the html pages
// save as js/script.js

document.addEventListener('DOMContentLoaded', function() {
  // eye toggle buttons (works for all pages)
  const eyes = document.querySelectorAll('.eye-btn, .eye');
  eyes.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const targetId = this.dataset.toggle || this.getAttribute('data-toggle') || this.getAttribute('for');
      if (!targetId) {
        // try to toggle nearest password input
        const parent = this.closest('.pw-row') || this.closest('.password-wrapper');
        if (parent) {
          const input = parent.querySelector('input[type="password"], input[type="text"]');
          toggleInput(input);
        }
        return;
      }
      const input = document.getElementById(targetId);
      toggleInput(input);
    });
  });

  function toggleInput(input) {
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
    } else {
      input.type = 'password';
    }
    // keep focus
    input.focus();
  }

  // basic client-side form checks for signup (match passwords)
  const signup = document.getElementById('signup-form');
  if (signup) {
    signup.addEventListener('submit', function(e) {
      const p1 = document.getElementById('pw1');
      const p2 = document.getElementById('pw2');
      const msg = document.getElementById('signup-msg');
      if (p1 && p2 && p1.value !== p2.value) {
        e.preventDefault();
        if (msg) msg.textContent = 'passwords do not match';
        p2.focus();
        return false;
      }
      if (msg) msg.textContent = 'sending...';
      // allow normal submit (backend will handle registration)
    });
  }

  // ticket form ajax (if using php endpoint, fallback to normal submit)
  const ticketForm = document.getElementById('ticket-form');
  if (ticketForm) {
    ticketForm.addEventListener('submit', async function(e){
      e.preventDefault();
      const formData = new FormData(this);
      const msg = document.getElementById('ticket-msg');
      if (msg) msg.textContent = 'sending...';
      try {
        const res = await fetch(this.action, { method: 'POST', body: formData });
        const data = await res.json();
        if (data.status === 'ok') {
          if (msg) { msg.textContent = 'ticket created'; msg.style.color = 'green'; }
          setTimeout(()=> location.href = 'tickets.html', 900);
        } else {
          if (msg) { msg.textContent = data.msg || 'error creating ticket'; msg.style.color = 'red'; }
        }
      } catch (err) {
        if (msg) { msg.textContent = 'network error'; msg.style.color = 'red'; }
      }
    });
  }

  // simple load functions to fill tables (placeholders if backend not set)
  loadPlaceholders();
  function loadPlaceholders() {
    // fill systems list if present
    const systemsList = document.getElementById('systems-list');
    if (systemsList) {
      systemsList.innerHTML = `
        <tr>
          <td>campus erp</td><td>erp</td><td>online</td><td><a href="#">link</a></td><td>it admin</td>
          <td><button class="btn small">edit</button></td>
        </tr>
        <tr>
          <td>moodle</td><td>e-learning</td><td>maintenance</td><td><a href="#">link</a></td><td>it admin</td>
          <td><button class="btn small">edit</button></td>
        </tr>
      `;
    }

    const hardwareList = document.getElementById('hardware-list');
    if (hardwareList) {
      hardwareList.innerHTML = `
        <tr><td>SRV-001</td><td>server</td><td>data centre</td><td>working</td><td>2025-07-01</td><td><button class="btn small">edit</button></td></tr>
        <tr><td>LAB-PC-01</td><td>pc</td><td>lab a</td><td>needs repair</td><td>2025-06-15</td><td><button class="btn small">edit</button></td></tr>
      `;
    }

    const ticketsList = document.getElementById('tickets-list');
    if (ticketsList) {
      ticketsList.innerHTML = `
        <tr><td>1</td><td>cant login to moodle</td><td>john student</td><td>e-learning</td><td>high</td><td>open</td><td><button class="btn small">view</button></td></tr>
        <tr><td>2</td><td>printer not printing</td><td>mary staff</td><td>hardware</td><td>medium</td><td>in progress</td><td><button class="btn small">view</button></td></tr>
      `;
    }

    const resourcesList = document.getElementById('resources-list');
    if (resourcesList) {
      resourcesList.innerHTML = `
        <div class="card"><strong>how to use moodle</strong><div class="muted small">guide • pdf</div></div>
        <div class="card"><strong>password reset video</strong><div class="muted small">video</div></div>
      `;
    }

    // dashboard stats
    const stTickets = document.getElementById('stat-tickets');
    const stHardware = document.getElementById('stat-hardware');
    const stSystems = document.getElementById('stat-systems');
    const stAlerts = document.getElementById('stat-alerts');
    if (stTickets) stTickets.textContent = '12';
    if (stHardware) stHardware.textContent = '28';
    if (stSystems) stSystems.textContent = '3';
    if (stAlerts) stAlerts.textContent = '2';
  }

});
