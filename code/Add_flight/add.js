document.getElementById("apply-btn").addEventListener("click", async () => {
  const airline = document.getElementById("airline").value.trim();
  const rating = parseFloat(document.getElementById("rating").value.trim());
  const reviews = document.getElementById("reviews").value.trim();
  const price = parseInt(document.getElementById("price").value.trim());
  const departure = document.getElementById("departure").value.trim();
  const arrival = document.getElementById("arrival").value.trim();
  const type = document.getElementById("type").value.trim();
  const duration = document.getElementById("duration").value.trim();
  const route = document.getElementById("route").value.trim();

  if (!airline) {
    alert("Airline name is required.");
    return;
  }
  if (isNaN(rating) || rating < 0 || rating > 5) {
    alert("Rating must be a number between 0 and 5.");
    return;
  }
  if (
    !reviews ||
    !/^(Excellent|Very Good|Good|Average)\s\d+\sreviews$/.test(reviews)
  ) {
    alert(
      'Reviews must be in the format: "Quality X reviews" (e.g., "Excellent 92 reviews").'
    );
    return;
  }
  if (isNaN(price) || price <= 0) {
    alert("Price must be a positive number.");
    return;
  }
  if (
    !departure ||
    !/^(0?[1-9]|1[0-2]):[0-5][0-9]\s(am|pm)$/i.test(departure)
  ) {
    alert('Departure must be in the format: "HH:MM am/pm" (e.g., "12:00 pm").');
    return;
  }
  if (!arrival || !/^(0?[1-9]|1[0-2]):[0-5][0-9]\s(am|pm)$/i.test(arrival)) {
    alert('Arrival must be in the format: "HH:MM am/pm" (e.g., "01:28 pm").');
    return;
  }
  if (!type || !/^(non stop|\d+ stop)$/.test(type)) {
    alert('Type must be either "non stop" or "1 stop".');
    return;
  }
  if (!duration || !/^\d+h\s\d+m$/.test(duration)) {
    alert('Duration must be in the format: "Xh Ym" (e.g., "2h 30m").');
    return;
  }
  if (!route || !/^[A-Z]{3}-[A-Z]{3}$/.test(route)) {
    alert('Route must be in the format: "XXX-XXX" (e.g., "EWR-BNA").');
    return;
  }

  const flightData = {
    airline,
    rating,
    reviews,
    price,
    flights: [
      {
        departure,
        arrival,
        type,
        duration,
        route,
      },
    ],
  };

  try {
    const response = await fetch("http://localhost:3000/Flights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(flightData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    alert("Flight added successfully!");
    document.querySelectorAll(".input").forEach((input) => (input.value = ""));
  } catch (error) {
    console.error("Error adding flight:", error);
    alert("Failed to add flight. Please try again.");
  }
});
