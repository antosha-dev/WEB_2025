import { translations } from "/code/Header_and_Footer/translations.js";

let isApplyingLanguage = false;

function applyLanguage(lang, caller = "unknown") {
  console.log(`применение перевода ${lang}`);
  if (isApplyingLanguage) {
    console.log(
      `applyLanguage пропущен (уже выполняется) от ${caller}, lang: ${lang}`
    );
    return;
  }
  isApplyingLanguage = true;
  console.log(
    `applyLanguage вызван от ${caller}, lang: ${lang}, DOM готов: ${document.readyState}`
  );
  try {
    if (!translations) {
      console.error("Объект переводов не загружен, повтор через 100мс");
      setTimeout(() => {
        isApplyingLanguage = false;
        applyLanguage(lang, caller);
      }, 100);
      return;
    }
    if (!translations[lang]) {
      console.warn(`Язык ${lang} не поддерживается, откат на 'en'`);
      lang = "en";
      localStorage.setItem("language", "en");
    }

    document.documentElement.lang = lang;
    const t = getTranslations(lang);

    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach((el) => {
      const keys = el.getAttribute("data-i18n").split(".");
      let translation = t;
      for (let key of keys) {
        translation = translation?.[key];
      }

      if (translation) {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          el.placeholder = translation;
        } else {
          el.textContent = translation;
        }
      } else {
        console.warn(
          "Перевод не найден для:",
          el.getAttribute("data-i18n"),
          "в элементе:",
          el
        );
      }
    });

    document.querySelectorAll(".image-placeholder").forEach((placeholder) => {
      placeholder.textContent = "[Image]";
    });

    const event = new CustomEvent("languageChanged", {
      detail: { language: lang },
    });
    document.dispatchEvent(event);
  } finally {
    isApplyingLanguage = false;
  }
}
function getTranslations(lang) {
  return translations[lang] || translations["en"];
}

setTimeout(() => {
  updateThemeInput();
  const lang = localStorage.getItem("language") || "en";
  applyLanguage(lang, "headerLoaded");
  applyVisibility();
  const languageToggle = document.getElementById("language-toggle");
  languageToggle.addEventListener("change", () => {
    const newLang = languageToggle.checked ? "ru" : "en";
    applyLanguage(newLang);
  });
}, 1000);

export function applyVisibility() {
  console.log("Применение видимости");
  const visibility = localStorage.getItem("visibility") || "visible";
  const isHomePage = document.body.getAttribute("data-page") === "home";

  if (visibility === "accessibility") {
    applyTheme("accessibility");
    applyAccessibilitySettings();
  } else {
    localStorage.setItem("visibility", "visible");
    const theme = localStorage.getItem("theme") || "light";
    applyTheme(theme);
    document.documentElement.removeAttribute("data-font-size");
    document.documentElement.removeAttribute("data-color-scheme");
    document.documentElement.removeAttribute("data-images");
    /*document.querySelectorAll("img").forEach((img) => {
      img.style.display = "flex";
    });*/
    document.querySelectorAll(".image-placeholder").forEach((placeholder) => {
      placeholder.remove();
    });
  }

  const visibilityCheckbox = document.getElementById("visibility");
  if (visibilityCheckbox) {
    visibilityCheckbox.checked = visibility === "accessibility" && isHomePage;
  }
}
export function applyTheme(theme) {
  console.log(
    `data-theme: ${document.documentElement.getAttribute("data-theme")}`
  );
  console.log(
    `data-color-scheme: ${document.documentElement.getAttribute(
      "data-color-scheme"
    )}`
  );
  if (theme) {
    localStorage.setItem("currentTheme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  } else {
    let currentTheme = document.documentElement.getAttribute("data-theme");
    document.documentElement.setAttribute(
      "data-theme",
      currentTheme == "dark" ? "light" : "dark"
    );
    localStorage.setItem("currentTheme", currentTheme);
  }
}
export function updateThemeInput() {
  const themeToggle = document.getElementById("theme-toggle");
  const isHomePage = document.body.getAttribute("data-page") === "home";

  if (themeToggle) {
    themeToggle.classList.toggle("visible", isHomePage);
    const currentTheme = localStorage.getItem("theme") || "light";
    themeToggle.checked = currentTheme === "dark";

    const newThemeToggle = themeToggle.cloneNode(true);
    themeToggle.parentNode.replaceChild(newThemeToggle, themeToggle);

    newThemeToggle.addEventListener("change", function () {
      const theme = this.checked ? "dark" : "light";
      localStorage.setItem("theme", theme);
      applyTheme();
      const event = new CustomEvent("themeChanged", { detail: { theme } });
      document.dispatchEvent(event);
    });
  }
}

function applyAccessibilitySettings() {
  console.log("Применение настроек доступности");
  console.log(localStorage.getItem("data-theme"));
  console.log(localStorage.getItem("data-color-scheme"));
  const fontSize = localStorage.getItem("accessibilityFontSize") || "small";
  const colorScheme =
    localStorage.getItem("data-color-scheme") || "white-black";
  const images = localStorage.getItem("accessibilityImages") || "on";

  document.documentElement.setAttribute("data-font-size", fontSize);
  document.documentElement.setAttribute("data-color-scheme", colorScheme);
  document.documentElement.setAttribute("data-images", images);

  applyTheme("accessibility");

  const allImages = document.querySelectorAll(
    "img:not(.brand_icon):not(.restart-toggle img):not(.visibility-toggle img):not(.theme-toggle img):not(.settings-toggle img):not(.cart-icon-wrapper img):not(.social-icons img)"
  );
  const lang = localStorage.getItem("language") || "en";
  const t = getTranslations(lang);

  document
    .querySelectorAll(".image-placeholder")
    .forEach((placeholder) => placeholder.remove());

  if (images === "off") {
    allImages.forEach((img) => {
      if (
        !img.classList.contains("accessibility-panel") &&
        !img.closest(".accessibility-panel")
      ) {
        let placeholder = document.createElement("span");
        placeholder.className = "image-placeholder";
        placeholder.textContent = "[Image]";
        img.parentNode.insertBefore(placeholder, img);
        img.style.display = "none";
      }
    });
  } else {
    allImages.forEach((img) => {
      img.style.display = "block";
    });
  }
}

setTimeout(() => {
  updateThemeInput();
  const lang = localStorage.getItem("language") || "en";
  applyLanguage(lang, "headerLoaded");
  applyVisibility();
  initializeVisibilityCheckbox();
  initializeSettingsToggle();
}, 1000);

function showAccessibilityPanel() {
  console.log("Показ панели доступности");
  let panel = document.querySelector(".accessibility-panel");

  const lang = localStorage.getItem("language") || "en";
  const t = getTranslations(lang);

  if (panel) {
    panel.remove();
  }

  panel = document.createElement("div");
  panel.className = "accessibility-panel";
  panel.innerHTML = `
        <div class="accessibility-controls">
            <h3 data-i18n="accessibility.panelTitle">Accessibility Settings</h3>
            <div class="control-group font-size-control">
                <label data-i18n="accessibility.fontSize">Font Size</label>
                <div class="button-group">
                    <button class="font-size-button" data-font-size="small" data-i18n="accessibility.fontSizeSmall">Small</button>
                    <button class="font-size-button" data-font-size="medium" data-i18n="accessibility.fontSizeMedium">Medium</button>
                    <button class="font-size-button" data-font-size="large" data-i18n="accessibility.fontSizeLarge">Large</button>
                </div>
            </div>
            <div class="control-group color-scheme-control">
                <label data-i18n="accessibility.colorScheme">Color Scheme</label>
                <div class="button-group">
                    <button data-color-scheme="black-white" data-i18n="accessibility.colorSchemeBlackWhite">Black on White</button>
                    <button data-color-scheme="white-black" data-i18n="accessibility.colorSchemeWhiteBlack">White on Black</button>
                    <button data-color-scheme="black-green" data-i18n="accessibility.colorSchemeBlackGreen">Green on Black</button>
                    <button data-color-scheme="beige-brown" data-i18n="accessibility.colorSchemeBeigeBrown">Brown on Beige</button>
                    <button data-color-scheme="blue-lightblue" data-i18n="accessibility.colorSchemeBlueLightblue">Black on Light Blue</button>
                </div>
            </div>
            <div class="control-group images-control">
                <label data-i18n="accessibility.images">Images</label>
                <div class="button-group">
                    <button data-images="on" data-i18n="accessibility.imagesOn">On</button>
                    <button data-images="off" data-i18n="accessibility.imagesOff">Off</button>
                </div>
            </div>
            <div class="action-buttons">
                <button class="apply-settings" data-i18n="accessibility.apply">Apply</button>
                <button class="close-settings" data-i18n="accessibility.close">Close</button>
            </div>
        </div>
    `;
  document.body.appendChild(panel);

  const currentFontSize =
    localStorage.getItem("accessibilityFontSize") || "small";
  const currentColorScheme =
    localStorage.getItem("accessibilityColorScheme") || "white-black";
  const currentImages = localStorage.getItem("accessibilityImages") || "on";

  let tempFontSize = currentFontSize;
  let tempColorScheme = currentColorScheme;
  let tempImages = currentImages;

  // Font Size Buttons
  panel.querySelectorAll(".font-size-button").forEach((btn) => {
    btn.classList.toggle(
      "active",
      btn.getAttribute("data-font-size") === currentFontSize
    );
    btn.addEventListener("click", () => {
      tempFontSize = btn.getAttribute("data-font-size");
      applyFontSize(tempFontSize);
      panel
        .querySelectorAll(".font-size-button")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // Color Scheme Buttons
  panel.querySelectorAll(".color-scheme-control button").forEach((btn) => {
    btn.classList.toggle(
      "active",
      btn.getAttribute("data-color-scheme") === currentColorScheme
    );
    btn.addEventListener("click", () => {
      tempColorScheme = btn.getAttribute("data-color-scheme");
      console.log(`применено: ${tempColorScheme}`);
      panel
        .querySelectorAll(".color-scheme-control button")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // Images Buttons
  panel.querySelectorAll(".images-control button").forEach((btn) => {
    btn.classList.toggle(
      "active",
      btn.getAttribute("data-images") === currentImages
    );
    btn.addEventListener("click", () => {
      tempImages = btn.getAttribute("data-images");
      panel
        .querySelectorAll(".images-control button")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // Apply Settings
  panel.querySelector(".apply-settings").addEventListener("click", () => {
    localStorage.setItem("data-color-scheme", tempColorScheme);
    localStorage.setItem("accessibilityImages", tempImages);
    applyAccessibilitySettings();
    panel.style.display = "none";
  });

  // Close Settings
  panel.querySelector(".close-settings").addEventListener("click", () => {
    panel.style.display = "none";
  });

  panel.style.display = "block";
  applyLanguage(lang, "showAccessibilityPanel");
}

function initializeVisibilityCheckbox(attempt = 0, maxAttempts = 10) {
  console.log(`Инициализация visibilityCheckbox, попытка ${attempt + 1}`);
  const visibilityCheckbox = document.getElementById("visibility");
  if (visibilityCheckbox) {
    console.log("visibilityCheckbox найден:", visibilityCheckbox);
    visibilityCheckbox.checked = false;
    /*  localStorage.getItem("visibility") === "accessibility" &&
      document.body.getAttribute("data-page") === "home";*/
    const newVisibilityCheckbox = visibilityCheckbox.cloneNode(true);
    visibilityCheckbox.parentNode.replaceChild(
      newVisibilityCheckbox,
      visibilityCheckbox
    );
    newVisibilityCheckbox.addEventListener("change", function () {
      const isHomePage = document.body.getAttribute("data-page") === "home";
      if (this.checked && !isHomePage) {
        console.log("Режим доступности доступен только на главной странице");
        this.checked = false;
        return;
      }
      const visibility = this.checked ? "accessibility" : "visible";
      console.log(`Переключение видимости на: ${visibility}`);
      localStorage.setItem("visibility", visibility);
      applyVisibility();
      if (visibility === "accessibility") {
        showAccessibilityPanel();
      }
      if (!this.checked) {
        document.querySelector(".accessibility-panel").style.display = "none";
      }
    });
  } else if (attempt < maxAttempts) {
    console.warn(
      `visibilityCheckbox не найден, повтор (${attempt + 1}/${maxAttempts})`
    );
    setTimeout(
      () => initializeVisibilityCheckbox(attempt + 1, maxAttempts),
      500
    );
  } else {
    console.error("visibilityCheckbox не найден после максимума попыток");
  }
}

function initializeSettingsToggle() {
  console.log("Инициализация переключателя настроек");
  const settingsToggle = document.querySelector(".settings-toggle");
  if (settingsToggle) {
    const newSettingsToggle = settingsToggle.cloneNode(true);
    settingsToggle.parentNode.replaceChild(newSettingsToggle, settingsToggle);
    newSettingsToggle.addEventListener("click", () => {
      if (
        localStorage.getItem("visibility") === "accessibility" &&
        document.body.getAttribute("data-page") === "home"
      ) {
        showAccessibilityPanel();
      }
    });
  }
}
function applyFontSize(size) {
  console.log(`Применение размера шрифта: ${size}`);
  document.documentElement.setAttribute("data-font-size", size);
  localStorage.setItem("accessibilityFontSize", size);
}
