const WA_NUMBER = "77027904001";

const header = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelectorAll(".nav a");

function syncHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

menuToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("menu-open");
  document.body.classList.toggle("menu-locked", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("menu-open");
    document.body.classList.remove("menu-locked");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("click", (event) => {
  if (header.classList.contains("menu-open") && !header.contains(event.target)) {
    header.classList.remove("menu-open");
    document.body.classList.remove("menu-locked");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

const heroMedia = document.querySelector(".hero-media");
if (heroMedia) {
  window.addEventListener("load", () => heroMedia.classList.add("loaded"));
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const contactSection = document.getElementById("contact");
const contactObserver = new IntersectionObserver(
  ([entry]) => {
    document.body.classList.toggle("contact-active", entry.isIntersecting);
  },
  { threshold: 0.18 }
);

contactObserver.observe(contactSection);

function formatKzPhone(value) {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("8")) digits = "7" + digits.slice(1);
  if (!digits.startsWith("7") && digits.length > 0) digits = "7" + digits;
  digits = digits.slice(0, 11);

  let formatted = "";
  if (digits.length > 0) formatted = "+" + digits.slice(0, 1);
  if (digits.length > 1) formatted += " (" + digits.slice(1, 4);
  if (digits.length >= 4) formatted += ")";
  if (digits.length > 4) formatted += " " + digits.slice(4, 7);
  if (digits.length > 7) formatted += "-" + digits.slice(7, 9);
  if (digits.length > 9) formatted += "-" + digits.slice(9, 11);
  return formatted;
}

function isValidPhone(value) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("7");
}

function openWhatsApp(message) {
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
}

const leadForm = document.getElementById("leadForm");
const phoneInput = document.getElementById("phone");
const phoneError = document.getElementById("phoneError");
const submitBtn = document.getElementById("submitBtn");
const formSuccess = document.getElementById("formSuccess");

phoneInput.addEventListener("input", () => {
  phoneInput.value = formatKzPhone(phoneInput.value);
  phoneInput.classList.remove("error");
  phoneError.classList.remove("show");
});

leadForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = phoneInput.value.trim();
  const service = document.getElementById("service").value;
  const message = document.getElementById("message").value.trim();

  if (!isValidPhone(phone)) {
    phoneInput.classList.add("error");
    phoneError.classList.add("show");
    phoneInput.focus();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Открываем WhatsApp...";

  const whatsappMessage =
    "Здравствуйте! Заявка с сайта bek-mebel:\n\n" +
    `Имя: ${name || "не указано"}\n` +
    `Телефон: ${phone}\n` +
    `Тип мебели: ${service || "не указан"}\n` +
    `Комментарий: ${message || "нет"}`;

  setTimeout(() => {
    openWhatsApp(whatsappMessage);
    leadForm.reset();
    formSuccess.textContent = "Заявка подготовлена. Если WhatsApp не открылся, нажмите кнопку еще раз.";
    submitBtn.disabled = false;
    submitBtn.textContent = "Отправить заявку";
  }, 500);
});

document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.getElementById("service").value = card.dataset.service;
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  });
});

const filterButtons = document.querySelectorAll(".filter-btn");
const portfolioItems = document.querySelectorAll(".portfolio-item");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;

    portfolioItems.forEach((item) => {
      const shouldShow = filter === "all" || item.dataset.category === filter;
      item.classList.toggle("hidden", !shouldShow);
    });
  });
});

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");

function openLightbox(src, title) {
  lightboxImage.src = src;
  lightboxImage.alt = title;
  lightboxCaption.textContent = title;
  lightbox.classList.add("open");
  document.body.classList.add("lightbox-open");
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.classList.remove("lightbox-open");
  lightboxImage.src = "";
}

portfolioItems.forEach((item) => {
  item.addEventListener("click", () => {
    openLightbox(item.dataset.src, item.dataset.title);
  });
});

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
    closeChat();
  }
});

const chatWidget = document.getElementById("chatWidget");
const chatToggle = document.getElementById("chatToggle");
const chatClose = document.getElementById("chatClose");
const chatMessages = document.getElementById("chatMessages");
const chatButtons = document.getElementById("chatButtons");
const chatPhoneRow = document.getElementById("chatPhoneRow");
const chatPhone = document.getElementById("chatPhone");
const chatPhoneSend = document.getElementById("chatPhoneSend");
const chatText = document.getElementById("chatText");
const chatTextSend = document.getElementById("chatTextSend");

const chatServices = [
  {
    name: "Кухня",
    question: "Какая кухня нужна?",
    options: ["Линейная", "Угловая", "С островом", "Пока не знаю"],
  },
  {
    name: "Шкаф",
    question: "Какой шкаф планируете?",
    options: ["Встроенный", "Распашной", "Шкаф-купе", "В нишу"],
  },
  {
    name: "Гардеробная",
    question: "Что важнее в гардеробной?",
    options: ["Больше полок", "Больше штанг", "Ящики", "Все вместе"],
  },
  {
    name: "Детская",
    question: "Что нужно для детской?",
    options: ["Шкаф", "Рабочая зона", "Полки", "Комплект"],
  },
  {
    name: "Прихожая",
    question: "Что добавить в прихожую?",
    options: ["Сиденье", "Зеркало", "Обувницу", "Закрытый шкаф"],
  },
  {
    name: "Санузел",
    question: "Какая мебель нужна в санузел?",
    options: ["Тумба", "Пенал", "Шкаф над инсталляцией", "Комплект"],
  },
  {
    name: "Другое",
    question: "Опишите задачу коротко.",
    options: ["Сервант", "ТВ-зона", "Комод", "Другое"],
  },
];

const faqAnswers = [
  {
    keys: ["срок", "долго", "когда", "быстро"],
    answer: "Срок зависит от сложности и материалов. После замера и согласования проекта можно назвать точнее. Напишите, что хотите изготовить, и мы сориентируем.",
  },
  {
    keys: ["замер", "выезд", "приед", "адрес"],
    answer: "Да, выезжаем на замер по Алматы и Алматинской области. На месте смотрим размеры, стены, розетки, трубы и технику.",
  },
  {
    keys: ["материал", "лдсп", "мдф", "эмаль", "фурнитур"],
    answer: "Материалы подбираем под бюджет и нагрузку: ЛДСП, МДФ, эмаль, пленка, пластик, стекло, подсветка и разная фурнитура.",
  },
  {
    keys: ["гарант"],
    answer: "Гарантия обсуждается по проекту и зависит от материалов и фурнитуры. В любом случае перед сдачей проверяем фасады, зазоры и механизмы.",
  },
  {
    keys: ["оплат", "каспи", "налич"],
    answer: "Оплату можно обсудить после расчета. Обычно проект делится на предоплату перед запуском и остаток после монтажа.",
  },
  {
    keys: ["алматы", "область", "район", "каска"],
    answer: "Основная зона работы - Алматы и Алматинская область. Напишите район, и мы подскажем по выезду.",
  },
];

let chatState = {
  service: null,
  detail: null,
};

function bubble(text, who) {
  const element = document.createElement("div");
  element.className = `chat-bubble ${who}`;
  element.textContent = text;
  chatMessages.appendChild(element);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function setChatButtons(labels, onClick) {
  chatButtons.innerHTML = "";
  chatPhoneRow.classList.remove("show");
  labels.forEach((label) => {
    const button = document.createElement("button");
    button.className = "chat-btn";
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", () => onClick(label));
    chatButtons.appendChild(button);
  });
}

function showChatPhone() {
  chatButtons.innerHTML = "";
  chatPhoneRow.classList.add("show");
  chatPhone.focus();
}

function startChat() {
  chatMessages.innerHTML = "";
  chatState = { service: null, detail: null };
  bubble("Здравствуйте! Я помогу быстро оформить заявку. Что хотите заказать?", "bot");
  setChatButtons(
    chatServices.map((service) => service.name),
    (label) => {
      const service = chatServices.find((item) => item.name === label);
      chatState.service = service.name;
      bubble(label, "user");
      setTimeout(() => {
        bubble(service.question, "bot");
        setChatButtons(service.options, (detail) => {
          chatState.detail = detail;
          bubble(detail, "user");
          setTimeout(() => {
            bubble("Отлично. Оставьте телефон, и мы откроем WhatsApp с готовой заявкой.", "bot");
            showChatPhone();
          }, 250);
        });
      }, 250);
    }
  );
}

function openChat() {
  chatWidget.classList.add("open");
  chatWidget.setAttribute("aria-hidden", "false");
  chatToggle.style.display = "none";
  if (!chatMessages.children.length) startChat();
}

function closeChat() {
  chatWidget.classList.remove("open");
  chatWidget.setAttribute("aria-hidden", "true");
  chatToggle.style.display = "";
}

chatToggle.addEventListener("click", openChat);
chatClose.addEventListener("click", closeChat);

chatPhone.addEventListener("input", () => {
  chatPhone.value = formatKzPhone(chatPhone.value);
  chatPhone.style.outline = "";
});

function sendChatLead() {
  const phone = chatPhone.value.trim();
  if (!isValidPhone(phone)) {
    chatPhone.style.outline = "2px solid var(--error)";
    return;
  }

  bubble(phone, "user");
  chatPhoneRow.classList.remove("show");
  const message =
    "Здравствуйте! Заявка с помощника Bek Mebel:\n\n" +
    `Тип мебели: ${chatState.service || "не указан"}\n` +
    `Детали: ${chatState.detail || "не указано"}\n` +
    `Телефон: ${phone}`;

  setTimeout(() => {
    bubble("Готово. Открываю WhatsApp с вашей заявкой.", "bot");
    openWhatsApp(message);
    setTimeout(() => {
      setChatButtons(["Новая заявка"], () => startChat());
    }, 350);
  }, 250);
}

chatPhoneSend.addEventListener("click", sendChatLead);
chatPhone.addEventListener("keydown", (event) => {
  if (event.key === "Enter") sendChatLead();
});

function findFaqAnswer(text) {
  const normalized = text.toLowerCase();
  const found = faqAnswers.find((item) => item.keys.some((key) => normalized.includes(key)));
  return found ? found.answer : null;
}

function handleChatText() {
  const text = chatText.value.trim();
  if (!text) return;
  bubble(text, "user");
  chatText.value = "";

  setTimeout(() => {
    const answer = findFaqAnswer(text);
    if (answer) {
      bubble(answer, "bot");
    } else {
      bubble("Я передам вопрос мастеру. Оставьте телефон, и мы ответим в WhatsApp.", "bot");
      showChatPhone();
    }
  }, 250);
}

chatTextSend.addEventListener("click", handleChatText);
chatText.addEventListener("keydown", (event) => {
  if (event.key === "Enter") handleChatText();
});
