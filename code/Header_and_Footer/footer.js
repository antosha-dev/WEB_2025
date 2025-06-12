fetch("/code/Header_and_Footer/footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
    console.log("Footer загружен");
  })
  .catch((error) => console.error("Ошибка загрузки footer:", error));
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
setTimeout(() => {
  document
    .getElementById("subscribe-button")
    .addEventListener("click", async () => {
      const subscribe_input = document.getElementById("subscribe-input");
      if (subscribe_input.value) {
        if (validateEmail(subscribe_input.value)) {
          const email = {
            email: subscribe_input.value,
          };
          const postResponse = await fetch(
            `http://localhost:3000/Mailing_list`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(email),
            }
          );
          window.alert("Ваш email успешно принят, спасибо за то что следите за нашими новостями☺♥☺")
        }
        else{
          window.alert("Неверный формат email")
        }
      } else {
        window.alert("Сначала введите email");
        return;
      }
    });
}, 1000);
