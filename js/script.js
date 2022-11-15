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

      console.log(data);

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

// Función encargada de escoger el vuelo más barato entre los vuelos guardados en un JSON.

async function getCheapestFlight(JSON) {
  try {
    // Si no hubiese vuelos disponibles nos dará un error correspondiente.
    if (JSON.meta.count === 0) {
      throw new Error("No hay vuelos disponibles");
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

    //Por ahora esto solo imprime una string que siempre será el vuelo más barato es flight-offer: 1 (porque están ordenados por precio los vuelos)
    console.log(
      `El vuelo más barato es ${cheapestFlight.type}: ${cheapestFlight.id}`
    );
  } catch (error) {
    console.error(error.message);
  }
}

export { getToken, getFlightsList, getCheapestFlight };
