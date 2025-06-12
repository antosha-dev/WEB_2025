import commonPasswords from "./common-passwords.js";
//import { getTranslations } from '/header_footer/language-switcher.js';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form");
  const phoneInput = document.getElementById("phone");
  const emailInput = document.getElementById("email");
  const birthdateInput = document.getElementById("birth-date");
  const passwordMethodRadios = document.getElementsByName("password-method");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const regeneratePasswordBtn = document.getElementById("regenerate-password");
  const fullNameInput = document.getElementById("name");
  const usernameInput = document.getElementById("username");
  const regenerateUsernameBtn = document.getElementById("regenerate-username");
  const agreementCheckbox = document.getElementById("agreement");
  /* const agreementLink = document.querySelector(".agreement-link");
  const agreementModal = document.getElementById("agreement-modal");*/
  const closeModal = document.querySelector(".close");
  // const agreementAcceptBtn = document.getElementById("agreement-accept");
  const registerBtn = document.getElementById("register-btn");
  const registerBtnContent = document.getElementById("register-btn-content");

  let usernameAttempts = 5;

  // Получение переводов
  //const getCurrentTranslations = () => getTranslations(localStorage.getItem('language') || 'en');

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateBirthdate = (birthdate) => {
    const today = new Date();
    const birth = new Date(birthdate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    let adjustedAge = age;
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      adjustedAge = age - 1;
    }
    return adjustedAge >= 16 && adjustedAge <= 120;
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
    return regex.test(password) && !commonPasswords.includes(password);
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return validatePassword(password) ? password : generatePassword();
  };

  const generateUsername = () => {
    const adjectives = [
      "Blaze",
      "Quantum",
      "Frenzy",
      "Gloomy",
      "Stealth",
      "Rad",
      "Zesty",
      "Turbo",
      "Mystic",
      "Chill",
    ];
    const nouns = [
      "Llama",
      "Pixel",
      "Waffle",
      "Noodle",
      "Sloth",
      "Comet",
      "Bloop",
      "Yeti",
      "Muffin",
      "Chonk",
    ];
    const randomNum = Math.floor(Math.random() * 100);
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${
      nouns[Math.floor(Math.random() * nouns.length)]
    }${randomNum}`;
  };

  const togglePasswordFields = () => {
    const method = document.querySelector(
      'input[name="password-method"]:checked'
    ).value;
    const toggleBtn = document.getElementById("password-toggle");
    if (method === "manual") {
      regeneratePasswordBtn.style.display = "none";
      toggleBtn.style.display = "flex";
      passwordInput.type = "password";
      confirmPasswordInput.type = "password";
      passwordInput.required = true;
      confirmPasswordInput.required = true;
      passwordInput.disabled = false;
      confirmPasswordInput.disabled = false;
    } else {
      regeneratePasswordBtn.style.display = "inline";
      toggleBtn.style.display = "none";
      passwordInput.type = "text";
      confirmPasswordInput.type = "text";
      passwordInput.required = false;
      confirmPasswordInput.required = false;
      passwordInput.disabled = true;
      confirmPasswordInput.disabled = true;
      let newPassword = generatePassword();
      passwordInput.value = newPassword;
      confirmPasswordInput.value = newPassword;
    }
    validateForm();
  };

  const setError = (element, messageKey) => {
    //const t = getCurrentTranslations();
    const formGroup = element.closest(".signup-form");
    const errorSpan = formGroup.querySelector(".error-message");
    if (errorSpan) {
      const keys = messageKey.split(".");
      let message = messageKey;
      keys.forEach((key) => (message = message?.[key]));
      errorSpan.textContent = message || "Error";
    }
    element.classList.add("invalid");
  };

  const clearError = (element) => {
    const formGroup = element.closest(".signup-form");
    const errorSpan = formGroup.querySelector(".error-message");
    if (errorSpan) {
      errorSpan.textContent = "";
    }
    element.classList.remove("invalid");
  };

  const updateUsernameAttempts = () => {
    //const t = getCurrentTranslations();
    if (usernameAttempts == 0) {
      regenerateUsernameBtn.style.display = "none";
      usernameInput.disabled = false;
      usernameInput.required = true;
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (!birthdateInput.value) {
      setError(birthdateInput, "register_page.form.birthdate.required");
      isValid = false;
    } else if (!validateBirthdate(birthdateInput.value)) {
      setError(birthdateInput, "register_page.form.birthdate.invalid");
      isValid = false;
    } else {
      clearError(birthdateInput);
    }

    const method = document.querySelector(
      'input[name="password-method"]:checked'
    ).value;
    if (method === "manual") {
      if (!passwordInput.value) {
        setError(passwordInput, "register_page.form.password.required");
        isValid = false;
      } else if (!validatePassword(passwordInput.value)) {
        setError(passwordInput, "register_page.form.password.invalid");
        isValid = false;
      } else {
        clearError(passwordInput);
      }

      if (!confirmPasswordInput.value) {
        setError(
          confirmPasswordInput,
          "register_page.form.password.confirm_required"
        );
        isValid = false;
      } else if (confirmPasswordInput.value !== passwordInput.value) {
        setError(confirmPasswordInput, "register_page.form.password.mismatch");
        isValid = false;
      } else {
        clearError(confirmPasswordInput);
      }
    } else {
      if (!passwordInput.value) {
        setError(
          generatedPasswordpasswordInput,
          "register_page.form.generated_password.required"
        );
        isValid = false;
      } else {
        clearError(passwordInput);
      }
    }

    if (!emailInput.value) {
      setError(emailInput, "register_page.form.email.required");
      isValid = false;
    } else if (!validateEmail(emailInput.value)) {
      setError(emailInput, "register_page.form.email.invalid");
      isValid = false;
    } else {
      clearError(emailInput);
    }

    if (!agreementCheckbox.checked) {
      setError(agreementCheckbox, "register_page.form.agreement.required");
      isValid = false;
    } else {
      clearError(agreementCheckbox);
    }

    if (!phoneInput.value || !emailInput.value || !birthdateInput.value) {
      isValid = false;
    }
    registerBtn.disabled = !isValid;
    isValid
      ? registerBtnContent.classList.remove("disabled")
      : registerBtnContent.classList.add("disabled");
    return isValid;
  };

  usernameInput.value = generateUsername();
  updateUsernameAttempts();

  passwordMethodRadios.forEach((radio) => {
    radio.addEventListener("change", togglePasswordFields);
  });

  regeneratePasswordBtn.addEventListener("click", () => {
    let newPassword = generatePassword();
    passwordInput.value = newPassword;
    confirmPasswordInput.value = newPassword;
    validateForm();
  });

  regenerateUsernameBtn.addEventListener("click", () => {
    if (usernameAttempts > 0) {
      usernameInput.value = generateUsername();
      usernameAttempts--;
      updateUsernameAttempts();
      if (usernameAttempts === 0) {
        usernameInput.readOnly = false;
        regenerateUsernameBtn.disabled = true;
      }
      validateForm();
    }
  });

  [
    phoneInput,
    emailInput,
    birthdateInput,
    passwordInput,
    confirmPasswordInput,
    usernameInput,
    agreementCheckbox,
  ].forEach((input) => {
    input.addEventListener("input", validateForm);
    input.addEventListener("change", validateForm);
  });

  confirmPasswordInput.addEventListener("input", (e) => {
    e.preventDefault();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const user = {
      username: usernameInput.value,
      password: passwordInput.value,
      phone: phoneInput.value,
      email: emailInput.value,
      birthdate: birthdateInput.value,
      fullname: fullNameInput.value,
      cart: [],
    };

    try {
      const response = await fetch(
        `http://localhost:3000/Users?username=${encodeURIComponent(
          user.username
        )}`
      );
      const users = await response.json();
      if (users.length > 0) {
        window.alert(
          `Пользователь с ником \"${user.username}\" уже существует, выберете другой ник`
        );
        setError(usernameInput, "register_page.form.username.exists");
        return;
      }

      const postResponse = await fetch(`http://localhost:3000/Users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (!postResponse.ok) throw new Error("Registration failed");

      localStorage.setItem("currentUser", `${user.username}`);
      window.location.assign("/code/Flight/Flight_Listing/index.html");
    } catch (error) {
      console.error("Error registering user:", error);
      setError(form, "register_page.form.server_error");
    }
  });
  //});

  // Обновление переводов при смене языка
  document.addEventListener("languageChanged", () => {
    updateUsernameAttempts();
    validateForm();
  });

  togglePasswordFields();
});
