"use strict";

import {
  getFlightsList,
  getCheapestFlight,
  getTomorrowDate,
  createFlightObject,
} from "./script.js";

const form = document.querySelector("form.search"); // Seleccionamos el formulario.
const results = document.querySelector("article.result"); // Selecccionamos el article donde irá nuestro resultado de la búsqueda.

//^Función manejadora de nuestro evento.
const doSearch = async (event) => {
  event.preventDefault(); // Previene el funcionaminto por defecto del botón.

  const values = new FormData(form); // Guardamos en una variable los datos del formulario

  const origin = values.get("origin"); // Campo del formulario donde introducimos el aeropuerto de origen

  const destination = values.get("destination"); // Campo del formulario donde introducimos el aeropuerto de origen

  const urlAmadeus = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin.toUpperCase()}&destinationLocationCode=${destination.toUpperCase()}&departureDate=${getTomorrowDate()}&adults=1`;

  const flightList = await getFlightsList(urlAmadeus); // Guardamos los resultados del fetch en una variable para acceder a ellos más tarde

  const dict = flightList.dictionaries;

  const flightData = await getCheapestFlight(flightList); // Guardamos la información del vuelo más barato.

  const flightObject = await createFlightObject(flightData, dict); // Esto nos genera un objeto con la info que queremos mostrar

  // Hoy tenemos que hacer una función render o algo así más pro con try catch para que también nos salga en pantalla que no hay resultados o cosas así :)
  results.innerHTML = `<ul><li>${flightObject.departureTime}-${flightObject.arrivalTime}</li><li>${flightObject.stopovers}</li><li>${flightObject.total} EUR</li></ul>`;
};

form.addEventListener("submit", doSearch); // Añadimos el evento al botón y le asignamos la función manejadora previamente definida.
