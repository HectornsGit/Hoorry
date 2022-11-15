"use strict";

import {
  getFlightsList,
  getCheapestFlight,
  getTomorrowDate,
} from "./script.js";

const form = document.querySelector("form.search"); //Seleccionamos el formulario.
const results = document.querySelector("article.result");

//Función manejadora de nuestro evento.
const doSearch = async (event) => {
  event.preventDefault(); //previene el funcionaminto por defecto del botón.

  const values = new FormData(form); //Guardamos en una variable los datos del formulario

  const origin = values.get("origin"); //Campo del formulario donde introducimos el aeropuerto de origen

  const destination = values.get("destination"); //Campo del formulario donde introducimos el aeropuerto de origen

  const urlAmadeus = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin.toUpperCase()}&destinationLocationCode=${destination.toUpperCase()}&departureDate=${getTomorrowDate()}&adults=1`;

  const flightList = await getFlightsList(urlAmadeus); //Guardamos los resultados del fetch en una variable para acceder a ellos más tarde

  const dict = flightList.dictionaries;

  const flightInfo = await getCheapestFlight(flightList, dict); //Guardamos la información del vuelo más barato.
  results.innerHTML = `<ul><li>${flightInfo.departureTime}-${flightInfo.arrivalTime}</li><li>${flightInfo.segments}</li><li>${flightInfo.total} EUR</li></ul>`;
};

form.addEventListener("submit", doSearch); //Añadimos el evento al botón y le asignamos la función manejadora previamente definida.
