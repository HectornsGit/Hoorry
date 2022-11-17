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
async function getCheapestFlight(JSON) {
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
    return cheapestFlight;
  } catch (error) {
    console.error(error.message);
  }
}

// Función para crear un objeto ordenadito con nuestra información más relevante :)
async function createFlightObject(flightData, dict) {
  // Estas variables me permiten moverme por el JSON de manera más cómoda.
  const carrierCode = flightData.validatingAirlineCodes[0];
  const itineraries = flightData.itineraries[0];
  const segments = itineraries.segments;

  let getSegments; // Aquí guardaré la string que nos dice cuantas escalas hay

  getSegments = itineraries.segments.length - 1; // El tamaño de esta array -1 es el número de escalas

  // Si no hay escalas, que escriba que es un vuelo directo
  if (getSegments === 0) {
    getSegments = "Directo";
  } else {
    getSegments = getSegments + ` escalas`;
  }

  // Aquí creamos nuestro objeto con nuestra info
  const flightObject = {
    // IATA del aeropuerto de origen.
    origin: segments[0].departure.iataCode,

    /* Hora de salida del primer vuelo nos venía en formato "2022-11-16T12:10:00" así que separamos la string con split cogiendo la T y nos quedamos con la segunda mitad.
       A esta le quitamos los segundos con un slice (0,-3) ==> esto coge toda la string salvo los 3 últimos caracteres.*/
    departureTime: segments[0].departure.at.split("T")[1].slice(0, -3),
    departureDate: segments[0].departure.at.split("T")[0].slice(5),
    destination: segments[segments.length - 1].arrival.iataCode, //IATA del aeropuerto destino es segments[segments.lenght-1] porque esto nos devuelve el último vuelo del viaje siempre.

    // Hora de llegada, lo mismo que con la de arriba solo que aquí prettier me separa el código.
    arrivalTime: segments[segments.length - 1].arrival.at
      .split("T")[1]
      .slice(0, -3),
    arrivalDate: segments[segments.length - 1].arrival.at
      .split("T")[0]
      .slice(5),
    // Precio total del viaje
    total: flightData.price.total,

    // String que nos dice si hay escalas y cuantas
    stopovers: getSegments,

    // Duración del viaje nos lo da en formato PT15H20M el slice es para quitar el PT
    duration: itineraries.duration.slice(2),

    /* Esto nos da el nombre de la aerolínea, dirigiéndonos a la key con el código de la aerolínea ej:
       escribiendo dict["IB"] el diccionario nos devuelve el valor de la propiedad "IB" que es "IBERIA"  */
    airline: dict.carriers[carrierCode],
  };
  return flightObject;
}

export {
  getFlightsList,
  getCheapestFlight,
  getTomorrowDate,
  createFlightObject,
};
