let currentUser = null;
const themeButton = document.getElementById("theme-button");
import { updateThemeInput } from "/Header_and_Footer/language-switcher.js";

function checkAuth() {
  const user = localStorage.getItem("currentUser");
  if (user) {
    currentUser = user;
    console.log("Текущий пользователь:", currentUser);
    return true;
  }
  currentUser = null;
  return false;
}

function updateHeader(isLoggedIn) {
  const no_user = document.getElementById("no-user");
  const with_user = document.getElementById("with-user");
  const isAdmin = (currentUser ? currentUser : "").includes("admin");
  const logOutBtn = document.getElementById("log-out-button");
  const userName = document.getElementById("username-span");

  if (isLoggedIn) {
    userName.innerHTML = `${currentUser}`;
    logOutBtn.removeEventListener("click", handleLogout);
    logOutBtn.addEventListener("click", handleLogout);
    no_user.style.display = "none";
    with_user.style.display = "flex";
    if (isAdmin) {
      const profile = document.getElementById("user-avatar");
      profile.src = "/Header_and_Footer/assets/admin.png";
    }
  } else {
    logOutBtn.removeEventListener("click", handleLogout);
    with_user.style.display = "none";
    no_user.style.display = "flex";
  }
}

function handleLogout(e) {
  e.preventDefault();
  localStorage.removeItem("currentUser");
  currentUser = null;
  updateHeader(false);
}

await fetch("/Header_and_Footer/header.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("header").innerHTML = data;
    console.log("Header загружен");
    updateThemeInput();
    const isLoggedIn = checkAuth();
    updateHeader(isLoggedIn);
    document.dispatchEvent(new CustomEvent("headerLoaded"));
  })
  .catch((error) => console.error("Ошибка загрузки header:", error));

/*fetch("/Header_and_Footer/index.html")
  .then((response) => response.text())
  .then((data) => {
    /*const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
    document.getElementById("header").innerHTML = data;
    /*
        const headerContent = doc.querySelector('#header');
        if (headerContent) {
            document.getElementById('header').innerHTML = headerContent.outerHTML;
        }
        console.log(doc);
        const footerContent = doc.querySelector('#footer');
        if (footerContent) {
            document.getElementById('footer').innerHTML = footerContent.outerHTML;
        }
        */
/*initBurgerMenu();
        initFooterSubscription();
        const isLoggedIn = checkAuth();
    //updateHeader(true);
  })
  .catch((error) => console.error("Ошибка загрузки хедера/футера:", error));*/

function initBurgerMenu() {
  //const hamMenu = document.querySelector('.ham-menu');
  const header = document.querySelector(".header");
  //const links = document.querySelectorAll('.links a');
  //const buttonCart = document.querySelector('.button-cart');

  /*if (!hamMenu || !header || !buttonCart) {
        console.error('Required elements not found:', { hamMenu, header, buttonCart });
        return;
    }langu
*/
  hamMenu.addEventListener("click", () => {
    hamMenu.classList.toggle("active");
    header.classList.toggle("active");

    if (window.innerWidth <= 768) {
      buttonCart.classList.toggle("active");
    } else {
      buttonCart.classList.remove("active");
    }
  });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      hamMenu.classList.remove("active");
      header.classList.remove("active");
      buttonCart.classList.remove("active");
    });
  });

  const shopLink = buttonCart.querySelector(".shop");
  if (shopLink) {
    shopLink.addEventListener("click", () => {
      window.location.href = "/catalog/catalog.html";
      hamMenu.classList.remove("active");
      header.classList.remove("active");
      buttonCart.classList.remove("active");
    });
  }

  buttonCart.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG" || e.target === buttonCart) {
      window.location.href = "/cart/cart.html";
      hamMenu.classList.remove("active");
      header.classList.remove("active");
      buttonCart.classList.remove("active");
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      buttonCart.classList.remove("active");
    } else if (header.classList.contains("active")) {
      buttonCart.classList.add("active");
    }
  });
}

function initFooterSubscription() {
  const subscribeButton = document.querySelector(".subscribe-form button");
  if (subscribeButton) {
    subscribeButton.addEventListener("click", (e) => {
      e.preventDefault();
      showNotification(
        "Subscription successful! You will receive updates soon."
      );
    });
  }
}