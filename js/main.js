// Mobile menu and header lifecycle are managed centrally in include.js


function handleFormSubmit(event) {
  event.preventDefault();

  // 1. Enter target WhatsApp number (with Country Code, without + sign)
  const whatsappNumber = "919876543210"; // REPLACE WITH YOUR PHONE NUMBER

  // 2. Fetch input field values
  const name = document.getElementById('mpName').value.trim();
  const email = document.getElementById('mpEmail').value.trim();
  const phone = document.getElementById('mpPhone').value.trim() || 'Not provided';
  const details = document.getElementById('mpDetails').value.trim();

  // 3. Format the message for WhatsApp
  const whatsappMessage = `*New Project Inquiry*%0A%0A` +
    `*Name:* ${encodeURIComponent(name)}%0A` +
    `*Email:* ${encodeURIComponent(email)}%0A` +
    `*Phone:* ${encodeURIComponent(phone)}%0A` +
    `*Project Details:* ${encodeURIComponent(details)}`;

  // 4. Reveal success message bar
  const successAlert = document.getElementById('mpSuccessAlert');
  successAlert.style.display = 'block';

  // 5. Open WhatsApp chat in a new browser tab
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  setTimeout(() => {
    window.open(whatsappURL, '_blank');
  }, 400);
}


document.addEventListener("DOMContentLoaded", function () {
  const section = document.getElementById("mpAboutSection");

  // IntersectionObserver triggers animation when 20% of section enters viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          section.classList.add("mp-active");
          observer.unobserve(entry.target); // Triggers animation once
        }
      });
    },
    { threshold: 0.2 }
  );

  if (section) {
    observer.observe(section);
  }
});

document.addEventListener('DOMContentLoaded', function () {
  window.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
});




