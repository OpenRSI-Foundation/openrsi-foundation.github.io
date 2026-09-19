const field = document.querySelector('.iteration-field');
const label = document.querySelector('.iteration-label');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
let timers = [];
function play() {
  timers.forEach(clearTimeout); timers = [];
  field.classList.remove('is-playing');
  if (reduced.matches) { label.textContent = 'Five iterations. Shared progress.'; return; }
  void field.getBoundingClientRect();
  field.classList.add('is-playing');
  label.textContent = 'Iteration 01 / 05';
  for (let i = 1; i < 5; i++) timers.push(setTimeout(() => {
    label.textContent = `Iteration 0${i + 1} / 05`;
  }, i * 1800));
  timers.push(setTimeout(() => { label.textContent = 'Each iteration builds on the last.'; }, 9000));
}
reduced.addEventListener('change', play);
play();
