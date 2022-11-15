"use strict";

// Función que obtiene nuestro token de autentificación
async function getToken() {
  //---URL Y CREDENCIALES PARA OBTENER EL TOKEN-------------------------------//
  const amadeusAutUrl = `https://test.api.amadeus.com/v1/security/oauth2/token`;
  const APIkey = "d8pgZY1izvGNlhEvDbPM53apBUxeiBPf";
  const APIsecret = "qgTe58ynZsqrqUqr";

  try {
    const response = await fetch(amadeusAutUrl, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${APIkey}&client_secret=${APIsecret}`,
    });

    if (response.ok) {
      const data = await response.json();

      const accessToken = data.access_token;

      return accessToken;
    }

    throw new Error(
      `Ha habido un error ${response.status}: ${response.statusText} `
    );
  } catch (error) {
    console.error(error.message);
  }
}

// Función encargada de obtener la lista con los vuelos
async function getFlightsList(amadeusUrl) {
  try {
    const token = await getToken();

    const response = await fetch(amadeusUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      mode: "cors",
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }

    throw new Error(
      `Ha habido un error ${response.status}: ${response.statusText}`
    );
  } catch (error) {
    console.error(error.message);
  }
}

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return `${tomorrow.getFullYear()}-${
    tomorrow.getMonth() + 1
  }-${tomorrow.getDate()}`;
}
// Función encargada de escoger el vuelo más barato entre los vuelos guardados en un JSON.
async function getCheapestFlight(JSON, dict) {
  try {
    // Si no hubiese vuelos disponibles nos dará un error correspondiente.
    if (JSON.meta.count === 0) {
      throw new Error("No hay vuelos disponibles o código IATA incorrecto");
    }

    const flights = await JSON.data; // Sacamos la información de los vuelos del JSON.

    let cheapestFlight = flights[0]; // Añadimos un vuelo cualquiera para poder comparar su precio con el resto.

    // Este bucle itera sobre todos los vuelos de nuestra array de objetos(vuelos).
    for (let flight of flights) {
      let price = parseFloat(flight.price.total); // Guardamos el precio en una variable para comparar de manera más cómoda

      // Si el vuelo más barato  es más caro que el vuelo actual, sobreescribimos el vuelo más barato.
      if (parseFloat(cheapestFlight.price.total) > price) {
        cheapestFlight = flight;
      }
    }
    const carrierCode = cheapestFlight.validatingAirlineCodes[0];

    let getSegments = cheapestFlight.itineraries[0].segments.length - 1;

    if (getSegments === 0) {
      getSegments = "Directo";
    } else {
      getSegments = getSegments + ` escalas`;
    }
    return {
      origin: cheapestFlight.itineraries[0].segments[0].departure.iataCode,

      departureTime: cheapestFlight.itineraries[0].segments[0].departure.at
        .split("T")[1]
        .slice(0, -3),

      destination:
        cheapestFlight.itineraries[0].segments[
          cheapestFlight.itineraries[0].segments.length - 1
        ].arrival.iataCode,

      arrivalTime: cheapestFlight.itineraries[0].segments[
        cheapestFlight.itineraries[0].segments.length - 1
      ].arrival.at
        .split("T")[1]
        .slice(0, -3),

      total: cheapestFlight.price.total,

      segments: getSegments,

      duration: cheapestFlight.itineraries[0].duration.slice(2),

      airline: dict.carriers[carrierCode],
    };
  } catch (error) {
    console.error(error.message);
  }
}

export { getFlightsList, getCheapestFlight, getTomorrowDate };
