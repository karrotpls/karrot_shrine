// Optional: enhance dropdown toggle for mobile
document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('button');
  const menu = button.nextElementSibling;

  button.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });
});
