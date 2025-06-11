document
  .getElementById("login-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const nameInput = document.getElementById("login");
    const passwordInput = document.getElementById("password");
    let errorMessage = document.getElementById("error-message");

    if (errorMessage) {
      errorMessage.textContent = "";
    }

    const name = nameInput.value.trim();
    const password = passwordInput.value;

    try {
      const response = await fetch(
        `http://localhost:3000/Users?username=${name}`
      );
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const users = await response.json();

      if (users.length == 1 && users[0].password === password) {
        localStorage.setItem("currentUser", users[0].username);

        window.location.href = "/code/Flight/Flight_Listing/index.html";
      } else {
        nameInput.style.borderColor = "red";
        passwordInput.style.borderColor = "red";

        if (!errorMessage) {
          errorMessage = document.createElement("div");
          errorMessage.id = "error-message";
          errorMessage.style.color = "red";
          errorMessage.style.marginTop = "10px";
          document.getElementById("loginForm").appendChild(errorMessage);
        }
        errorMessage.textContent = "Invalid username or password";
      }
    } catch (error) {
      console.error("Error during login:", error.message, error.stack);

      if (!errorMessage) {
        errorMessage = document.createElement("div");
        errorMessage.id = "error-message";
        errorMessage.style.color = "red";
        errorMessage.style.marginTop = "10px";
        document.getElementById("login-form").appendChild(errorMessage);
      }
      errorMessage.textContent = "An error occurred. Please try again.";
    }
  });

async function togglePassword() {
  const passwordInput = document.getElementById("password");
  const toggleIconOn = document.getElementById("toggle-icon-on");
  const toggleIconOff = document.getElementById("toggle-icon-off");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    passwordInput.placeholder = "passwordExample";
    toggleIconOn.style.display = "inline";
    toggleIconOff.style.display = "none";
  } else {
    passwordInput.type = "password";
    passwordInput.placeholder = "•••••••••••••••••••••••••";
    toggleIconOn.style.display = "none";
    toggleIconOff.style.display = "inline";
  }
}
