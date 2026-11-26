// Mobile menu
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
const setMenu = (open) => {
  nav.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
};
burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

// Photos: hide placeholder label once the real image loads
document.querySelectorAll(".photo").forEach((el) => {
  const m = el.style.getPropertyValue("--img").match(/url\(['"]?(.*?)['"]?\)/);
  if (!m) return;
  const img = new Image();
  img.onload = () => el.classList.add("has-img");
  img.src = m[1];
});

// Accordion
document.querySelectorAll(".acc__head").forEach((head) => {
  head.addEventListener("click", () => {
    const item = head.parentElement;
    const open = !item.classList.contains("is-open");
    item.classList.toggle("is-open", open);
    head.setAttribute("aria-expanded", String(open));
  });
});

// Reviews slider
const track = document.getElementById("track");
const cards = [...track.children];
const dots = document.getElementById("dots");
let active = 0;

cards.forEach((_, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.setAttribute("aria-label", `Отзыв ${i + 1}`);
  b.addEventListener("click", () => goTo(i));
  dots.appendChild(b);
});

function goTo(i) {
  const idx = (i + cards.length) % cards.length;
  const card = cards[idx];
  track.scrollTo({ left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2 });
  setActive(idx);
}

function setActive(idx) {
  active = idx;
  cards.forEach((c, i) => c.classList.toggle("is-active", i === idx));
  [...dots.children].forEach((d, i) => d.classList.toggle("is-active", i === idx));
}

let raf;
track.addEventListener("scroll", () => {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => {
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0, dist = Infinity;
    cards.forEach((c, i) => {
      const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
      if (d < dist) { dist = d; best = i; }
    });
    if (best !== active) setActive(best);
  });
});

document.getElementById("prev").addEventListener("click", () => goTo(active - 1));
document.getElementById("next").addEventListener("click", () => goTo(active + 1));
window.addEventListener("load", () => goTo(1));
setActive(1);

// File label
const file = document.getElementById("file");
const fileLabel = document.getElementById("fileLabel");
file.addEventListener("change", () => {
  fileLabel.textContent = file.files[0] ? file.files[0].name : "Прикрепить резюме или сертификат";
});

// Form (demo: validates and shows a message, no backend)
const form = document.getElementById("form");
const status = document.getElementById("formStatus");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll("input[required], input[pattern], input[min]").forEach((input) => {
    const valid = input.checkValidity();
    input.classList.toggle("is-invalid", !valid);
    if (!valid) ok = false;
  });
  status.className = "form__status";
  if (!ok) {
    status.textContent = "Проверьте поля, отмеченные красным (возраст — от 18 лет).";
    status.classList.add("is-error");
    return;
  }
  status.textContent = "Спасибо! Заявка отправлена — мы свяжемся с вами в Telegram.";
  status.classList.add("is-ok");
  form.reset();
  fileLabel.textContent = "Прикрепить резюме или сертификат";
});
form.addEventListener("input", (e) => e.target.classList.remove("is-invalid"));
