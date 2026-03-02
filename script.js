const progress = document.querySelector('.progress');
const sections = document.querySelectorAll('.reveal');

const updateProgress = () => {
  const scrollTop = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const percent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  progress.style.width = `${percent}%`;
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.2 }
);

sections.forEach((section) => observer.observe(section));
window.addEventListener('scroll', updateProgress);
updateProgress();
