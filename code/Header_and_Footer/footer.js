fetch("/Header_and_Footer/footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
    console.log("Footer загружен");
  })
  .catch((error) => console.error("Ошибка загрузки footer:", error));
