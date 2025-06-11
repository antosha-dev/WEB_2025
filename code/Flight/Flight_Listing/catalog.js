const AIRLINE_NAME_MAPPING = {
  Emirated: "Emirates",
  Fly_Dubai: "Fly Dubai",
  Qatar: "Qatar Airways",
  Etihad: "Etihad",
  Turkish_Airlines: "Turkish Airlines",
};

let currentUser = localStorage.getItem("currentUser");

if (!checkAuth()) {
  window.location.href = "/Log_in/index.html";
}

document.documentElement.setAttribute(
  "curent-type-of-user",
  currentUser.includes("admin") ? "admin" : "customer"
);

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

class FlightDataService {
  static async fetchFlights(params = new URLSearchParams()) {
    try {
      const response = await fetch(
        `http://localhost:3000/Flights?${params.toString()}`
      );
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const flights = await response.json();

      const countParams = new URLSearchParams(params);
      countParams.delete("_page");
      countParams.delete("_limit");
      const countResponse = await fetch(
        `http://localhost:3000/Flights?${countParams.toString()}`
      );
      if (!countResponse.ok)
        throw new Error(`HTTP error: ${countResponse.status}`);
      const countData = await countResponse.json();

      return { flights, totalCount: countData.length };
    } catch (error) {
      console.log("Ошибка при загрузке данных о рейсах с сервера:", error);
      FlightRenderer.renderError();
    }
  }
}

class FilterSettingsManager {
  static defaultSettings = {
    searchQuery: "",
    rating: "0+",
    airlines: [""],
    sortBy: "best",
  };

  static loadSettings() {
    const savedSettings = localStorage.getItem("filterSettings");
    return savedSettings
      ? JSON.parse(savedSettings)
      : { ...this.defaultSettings };
  }

  static saveSettings(settings) {
    localStorage.setItem("filterSettings", JSON.stringify(settings));
    localStorage.setItem("amount_of_items", "5");
  }

  static buildQueryParams(settings) {
    const params = new URLSearchParams();
    if (settings.searchQuery)
      params.append("flights.route", settings.searchQuery);
    if (settings.rating) {
      const minRating = parseInt(settings.rating) || 0;
      params.append("rating_gte", minRating);
    }
    if (settings.airlines[0] !== "all") {
      params.append(
        "airline",
        AIRLINE_NAME_MAPPING[settings.airlines] || settings.airlines
      );
    }

    switch (settings.sortBy) {
      case "cheapest":
        params.append("_sort", "price");
        params.append("_order", "asc");
        break;
      case "best":
        params.append("_sort", "rating");
        params.append("_order", "asc");
        break;
      case "quickest":
        params.append("_sort", "flights.duration");
        params.append("_order", "asc");
        break;
    }
    return params;
  }
}

class FlightRenderer {
  static getAirlineLogo(airline) {
    switch (airline) {
      case "Emirates":
        return "assets/Emirates.png";
      case "Fly Dubai":
        return "assets/FlyDubai.png";
      case "Qatar Airways":
        return "assets/QatarAirways.png";
      case "Etihad":
        return "assets/Etihad.png";
      case "Turkish Airlines":
        return "assets/TurkishAirlines.png";
      default:
        return "assets/UnknownAirline.png";
    }
  }

  static renderFlights(flights, totalCount, amountOfItems) {
    const container = document.getElementById("flights-container");
    const results = document.getElementById("results-count");
    container.innerHTML = "";
    results.innerHTML = "";

    const showing = document.createElement("div");
    showing.innerHTML = `
      <span data-i18n="catalog_showing">Showing</span> ${Math.min(
        amountOfItems,
        totalCount
      )} <span data-i18n="catalog_of">of</span> ${totalCount} <span data-i18n="catalog_places">flights</span>`;
    results.appendChild(showing);

    for (let i = 0; i < Math.min(amountOfItems, totalCount); i++) {
      let flight = flights[i];
      const flightCard = document.createElement("div");
      flightCard.className = "flight-card";

      flightCard.innerHTML = `
        <article class="flight-card">
          <img
            src="${this.getAirlineLogo(flight.airline)}"
            alt="${flight.airline} logo"
            class="airline-logo"
          />
          <div class="flight-details">
            <div class="flight-header">
              <div class="rating-section">
                <button class="rating-badge">${flight.rating}</button>
                <span class="rating-text">${flight.reviews}</span>
              </div>
              <div class="price-section">
                <span class="price-label" data-i18n="catalog_starting_from">starting from</span>
                <span class="price-amount">${flight.price}$</span>
              </div>
            </div>
            <div class="flight-info">
              <div class="flight-segments">
                  <div class="flight-segment">
                    <div class="segment-time">
                      <div class="time-range">
                        <span class="time">${flight.departure} - ${
        flight.arrival
      }</span>
                      </div>
                      <span class="airline-name">${flight.airline}</span>
                    </div>
                    <span class="flight-type">${flight.type}</span>
                    <div class="duration-info">
                      <span class="flight-duration">${flight.duration}</span>
                      <span class="route-code">${flight.route}</span>
                    </div>
                  </div>
              </div>
            </div>
            <div class="flight-actions">
              <button id="add-to-cart-btn" class="view-deals-button ${
                flight.id
              }">Add to cart</button>
              <button id="delete-btn" class="delete-button">
              <img src="assets/delete.png" alt="delete">
              </button>
            </div>
          </div>
        </article>`;

      const showMoreButton = document.getElementById("show-more-button");
      if (showMoreButton) {
        showMoreButton.className =
          amountOfItems >= totalCount
            ? "hidden show-more-button"
            : "show-more-button";
      }

      container.appendChild(flightCard);
    }

    const showMoreButton = document.getElementById("show-more-button");
    if (showMoreButton) {
      showMoreButton.className =
        amountOfItems >= totalCount
          ? "hidden show-more-button"
          : "show-more-button";
    }

    setTimeout(() => {
      const buttons = document.querySelectorAll("#add-to-cart-btn");
      buttons.forEach((el) => {
        el.addEventListener("click", (e) => {
          const addToCartBtn = e.target;
          addToCart(addToCartBtn.classList[1]);
        });
      });
    }, 100);
  }

  static renderError() {
    const results = document.getElementById("results-count");
    results.innerHTML = "";
    const showing = document.createElement("div");
    showing.innerHTML = `
      <span style="color:red;">ERROR LOADING DATA FROM SERVER</span>`;
    results.appendChild(showing);
  }
}

class FlightCatalogController {
  static async loadFlights(
    amountOfItems = parseInt(localStorage.getItem("amount_of_items") || 5)
  ) {
    try {
      const filterSettings = FilterSettingsManager.loadSettings();
      const params = FilterSettingsManager.buildQueryParams(filterSettings);
      console.log(`параметры json: ${params.toString()}`);
      const { flights, totalCount } = await FlightDataService.fetchFlights(
        params
      );
      if (params.has("_sort", "rating")) {
        flights.reverse();
      }
      FlightRenderer.renderFlights(flights, totalCount, amountOfItems);
    } catch (error) {
      console.error("Ошибка при загрузке данных о рейсах:", error);
      FlightRenderer.renderError();
    }
  }

  static async showMoreFlights() {
    let amountOfItems = parseInt(localStorage.getItem("amount_of_items") || 5);
    amountOfItems += 5;
    localStorage.setItem("amount_of_items", amountOfItems);
    await this.loadFlights(amountOfItems);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let filterSettings = FilterSettingsManager.defaultSettings;

  function loadSettings() {
    filterSettings = FilterSettingsManager.loadSettings();
    document.getElementById("search-input").value = filterSettings.searchQuery;

    document.querySelectorAll(".rating-radio").forEach((radio) => {
      radio.checked = radio.id === `rating-radio-${filterSettings.rating[0]}`;
    });

    document.querySelectorAll(".checkbox").forEach((checkbox) => {
      const airline = checkbox.id.split("-").pop();
      checkbox.checked = filterSettings.airlines.includes(airline);
    });

    document.querySelectorAll(".sort-radio").forEach((radio) => {
      radio.checked = radio.id === `sort-by-${filterSettings.sortBy}`;
    });
  }

  function saveSettings() {
    FilterSettingsManager.saveSettings(filterSettings);
    FlightCatalogController.loadFlights();
  }

  document.getElementById("search-input").addEventListener("input", (e) => {
    filterSettings.searchQuery = e.target.value;
    saveSettings();
  });

  document.querySelectorAll(".rating-radio").forEach((radio) => {
    radio.addEventListener("change", (e) => {
      if (e.target.checked) {
        filterSettings.rating = e.target.id.split("-").pop() + "+";
        saveSettings();
      }
    });
  });

  document.querySelectorAll(".checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      const airline = e.target.id.split("-").pop();
      if (e.target.checked) {
        if (!filterSettings.airlines.includes(airline)) {
          filterSettings.airlines = [airline];
        }
      } else {
        filterSettings.airlines = filterSettings.airlines.filter(
          (a) => a !== airline
        );
      }
      saveSettings();
    });
  });

  document.querySelectorAll(".sort-radio").forEach((radio) => {
    radio.addEventListener("change", (e) => {
      if (e.target.checked) {
        filterSettings.sortBy = e.target.id.split("-").pop();
        let type_of_sort = document.getElementById("type-of-sort");
        type_of_sort.innerHTML = `${radio.id.replace("sort-by-", "")}`;
        saveSettings();
      }
    });
  });

  const showMoreButton = document.getElementById("show-more-button");

  loadSettings();
  FlightCatalogController.loadFlights();
});

async function addToCart(flightId) {
  if (!checkAuth()) {
    window.location.href = "/Log_in/index.html";
    return;
  }
  try {
    const response = await fetch(
      `http://localhost:3000/Flights?id=${flightId}`
    );
    if (!response.ok) throw new Error("Failed to load product data");
    const flight = await response.json();
    console.log(flight);
    const cartItem = {
      airline: flight[0].airline,
      rating: flight[0].rating,
      reviews: flight[0].reviews,
      price: flight[0].price,
      flights: flight[0].flights,
      flightId: flightId,
      userName: currentUser,
    };
    console.log(cartItem);

    fetch("http://localhost:3000/Cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cartItem),
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
}

function deleteFlight(flightId) {
  if (!isAdmin()) {
    throw new Error("Failed, get admin permission");
  }

  fetch(`http://localhost:3000/Flights/${flightId}`)
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load flights");
      return response.json();
    })
    .then(() => {
      showModal("catalog_page.modal.delete_confirm", true, flightId);
    })
    .catch((error) => {
      console.error("Error checking flights for deletion:", error);
      showModal("catalog_page.modal.delete_error");
    });
}

function confirmDelete() {
  if (!pendingDeleteProductId) return;

  fetch(`http://localhost:3000/Cart?flightId=${pendingDeleteProductId}`)
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load cart");
      return response.json();
    })
    .then((cartItems) => {
      const deleteCartPromises = cartItems.map((item) =>
        fetch(`http://localhost:3000/Cart?id=${item.id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        })
      );
      return Promise.all(deleteCartPromises);
    })
    .then(() => {
      return fetch(`http://localhost:3000/Flight?Id=${pendingDeleteProductId}`);
    })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load purchased items");
      return response.json();
    })
    .then((purchasedItems) => {
      const deletePurchasedPromises = purchasedItems.map((item) =>
        fetch(`http://localhost:3000/Flights/${item.id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        })
      );
      return Promise.all(deletePurchasedPromises);
    })
    .then(() => {
      return fetch(`http://localhost:3000/Flights/${pendingDeleteProductId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
    })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to delete Flights");
      closeModal();
      fetchProducts();
    })
    .catch((error) => {
      console.error("Error deleting Flights:", error);
      closeModal();
      showModal("catalog_page.modal.delete_error");
    });
}

function showModal(messageKey, isConfirm = false, productId = null) {
  const t = getCurrentTranslations();
  const modal = document.getElementById("delete-modal");
  const modalMessage = document.getElementById("modal-message");
  const confirmButton = document.getElementById("modal-confirm");
  const cancelButton = document.getElementById("modal-cancel");

  if (!modal || !modalMessage || !cancelButton) {
    console.error("Modal elements not found");
    return;
  }

  let message = messageKey;
  try {
    const keys = messageKey.split(".");
    let translation = t;
    for (const key of keys) {
      translation = translation[key];
      if (!translation) throw new Error("Translation not found");
    }
    message = translation;
  } catch (e) {
    console.warn(`Translation not found`, e);
  }

  modalMessage.textContent = message;
  confirmButton.style.display = isConfirm ? "block" : "none";
  cancelButton.textContent = isConfirm
    ? t.catalog_page.modal.cancel || "Cancel"
    : t.catalog_page.modal.close || "Close";
  pendingDeleteProductId = isConfirm ? productId : null;

  modal.style.display = "flex";
}

setTimeout(() => {
  const buttons = document.querySelectorAll("#delete-btn");
  buttons.forEach((el) => {
    el.addEventListener("click", (e) => {
      deleteFlight(addToCartBtn.classList[1]);
    });
  });
}, 100);
