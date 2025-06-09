document
  .getElementById("password-toggle-btn")
  .addEventListener("click", async function togglePassword() {
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const toggleIconOn = document.getElementById("toggle-icon-on");
    const toggleIconOff = document.getElementById("toggle-icon-off");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      confirmPasswordInput.type = "text";
      passwordInput.placeholder = "passwordExample";
      confirmPasswordInput.placeholder = "passwordExample";
      toggleIconOn.style.display = "inline";
      toggleIconOff.style.display = "none";
    } else {
      passwordInput.type = "password";
      confirmPasswordInput.type = "password";
      passwordInput.placeholder = "•••••••••••••••••••••••••";
      confirmPasswordInput.placeholder = "•••••••••••••••••••••••••";
      toggleIconOn.style.display = "none";
      toggleIconOff.style.display = "inline";
    }
  });
