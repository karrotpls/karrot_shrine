document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.dropdown-btn');
  const menu = document.querySelector('.dropdown-menu');
  btn.addEventListener('click', () => menu.classList.toggle('hidden'));
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) menu.classList.add('hidden');
  });
});
