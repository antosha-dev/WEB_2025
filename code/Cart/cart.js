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
        `http://localhost:3000/Cart?userName=${currentUser}`
      );
      const flights = await response.json();
      return { flights };
    } catch (error) {
      console.log("Ошибка при загрузке данных о рейсах с сервера:", error);
      FlightRenderer.renderError();
    }
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

  static renderFlights(flights) {
    const container = document.getElementById("flights-container");
    container.innerHTML = "";
    if(flights.flights.length==0){
      window.alert("No flights in cart :(");
    }
    for (let i = 0; i < flights.flights.length; i++) {
      let flight = flights.flights[i];
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
                <span id="price-amount" class="price-amount">${
                  flight.price
                }$</span>
              </div>
            </div>
            <div class="flight-info">
              <div class="flight-segments">
                  <div class="flight-segment">
                    <div class="segment-time">
                      <div class="time-range">
                        <span class="time">${flight.departure} - ${flight.arrival}</span>
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
              <button id="delete-btn" class="delete-button">
              <img src="assets/delete.png" alt="delete">
              </button>
            </div>
          </div>
        </article>`;

      container.appendChild(flightCard);
    }
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
  static async loadFlights() {
    try {
      const flights = await FlightDataService.fetchFlights();
      FlightRenderer.renderFlights(flights);
    } catch (error) {
      console.error("Ошибка при загрузке данных о рейсах:", error);
      FlightRenderer.renderError();
    }
  }
}

await FlightCatalogController.loadFlights();

const total_price = document.getElementById("total-price");
let total = 0;
document.querySelectorAll("#price-amount").forEach((el) => {
  total = parseInt(el.innerHTML.replace("$", ""));
  console.log(total);
});
total_price.innerHTML = `${total}$`;
console.log(`ы${total_price.innerHTML}`);
