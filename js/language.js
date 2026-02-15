const langData = {
  ru: {
    headline: "Инженерное совершенство в архитектуре",
    our_projects: "Наши проекты",
    people: "Команда",
    careers: "Карьера",
    about: "О нас",
    contact: "Контакты",
    projects_completed: "Проектов завершено",
    years_experience: "Лет опыта",
    team_members: "Сотрудников",
    gallery_description: "Превосходство в инженерии и дизайне",
    quality: "Качество в каждой детали",
    precision: "Прецизионная инженерия",
    sustainability: "Устойчивое развитие",
    excellence: "Совершенство в проектировании",
    cta: "Начните ваш проект",
    footer_text: "© 2026 Premium Construction & Architecture. Все права защищены."
  },
  en: {
    headline: "Engineering Excellence in Architecture",
    our_projects: "Our Projects",
    people: "People",
    careers: "Careers",
    about: "About",
    contact: "Contact",
    projects_completed: "Projects Completed",
    years_experience: "Years of Experience",
    team_members: "Team Members",
    gallery_description: "Excellence in Engineering & Design",
    quality: "Quality in Every Detail",
    precision: "Precision Engineering",
    sustainability: "Sustainable Development",
    excellence: "Excellence in Design",
    cta: "Start Your Project",
    footer_text: "© 2026 Premium Construction & Architecture. All rights reserved."
  }
};

const ruBtn = document.getElementById('ru');
const enBtn = document.getElementById('en');
const allKeys = document.querySelectorAll('[data-key]');

function setLanguage(lang){
  allKeys.forEach(el => {
    const key = el.getAttribute('data-key');
    if(langData[lang][key]){
      el.innerText = langData[lang][key];
    }
  });
  ruBtn.classList.toggle('active', lang === 'ru');
  enBtn.classList.toggle('active', lang === 'en');
}

ruBtn.addEventListener('click', () => setLanguage('ru'));
enBtn.addEventListener('click', () => setLanguage('en'));

// Default language
setLanguage('ru');
