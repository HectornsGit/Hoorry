"use strict";

import { getToken, getFlightsList, getCheapestFlight } from "./script.js";

const form = document.querySelector("form.search"); //Seleccionamos el formulario.
const results = document.querySelector("article.result");

//Función manejadora de nuestro evento.
const doSearch = async (event) => {
  event.preventDefault(); //previene el funcionaminto por defecto del botón.

  const values = new FormData(form); //Guardamos en una variable los datos del formulario

  const origin = values.get("origin"); //Campo del formulario donde introducimos el aeropuerto de origen

  const destination = values.get("destination"); //Campo del formulario donde introducimos el aeropuerto de origen

  const urlAmadeus = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin.toUpperCase()}&destinationLocationCode=${destination.toUpperCase()}&departureDate=2022-12-15&adults=1`;

  getToken(); //pedimos el token de acceso a la api
  const flightList = await getFlightsList(urlAmadeus); //Guardamos los resultados del fetch en una variable para acceder a ellos más tarde
  getCheapestFlight(flightList); //Llamamos a la función que nos seleccionará el vuelo más barato.
};

form.addEventListener("submit", doSearch); //Añadimos el evento al botón y le asignamos la función manejadora previamente definida.
