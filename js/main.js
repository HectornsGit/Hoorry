"use strict";

import {
  getFlightsList,
  getCheapestFlight,
  getTomorrowDate,
  createFlightObject,
} from "./script.js";

const form = document.querySelector("form.search"); // Seleccionamos el formulario.
const results = document.querySelector("article.result"); // Selecccionamos el article donde irá nuestro resultado de la búsqueda.
const inputDate = document.querySelector("input#dateID");
const article = document.querySelector("article#resultID");
const modalBackground = document.querySelector("div.modal-background");
const modalContent = document.querySelector("div.modal-content");
const modalImg = document.querySelector("div>img.rotate-center");
inputDate.setAttribute("placeholder", `${getTomorrowDate()}`);

//^Función manejadora de nuestro evento.
const doSearch = async (event) => {
  event.preventDefault(); // Previene el funcionaminto por defecto del botón.
  article.id = "resultID";
  modalBackground.classList.toggle("display-none");
  modalContent.classList.toggle("display-none");
  modalImg.classList.toggle("display-none");
  const values = new FormData(form); // Guardamos en una variable los datos del formulario

  const origin = values.get("origin"); // Campo del formulario donde introducimos el aeropuerto de origen

  const destination = values.get("destination"); // Campo del formulario donde introducimos el aeropuerto de origen

  const urlAmadeus = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin.toUpperCase()}&destinationLocationCode=${destination.toUpperCase()}&departureDate=${getTomorrowDate()}&adults=1`;

  const flightList = await getFlightsList(urlAmadeus); // Guardamos los resultados del fetch en una variable para acceder a ellos más tarde

  const dict = flightList.dictionaries;

  const flightData = await getCheapestFlight(flightList); // Guardamos la información del vuelo más barato.

  const flightObject = await createFlightObject(flightData, dict); // Esto nos genera un objeto con la info que queremos mostrar

  // Hoy tenemos que hacer una función render o algo así más pro con try catch para que también nos salga en pantalla que no hay resultados o cosas así :)
  results.innerHTML = `<ul class="main-article"><li><ul><li><ul><li class="important">${flightObject.departureTime}</li>${flightObject.origin} · ${flightObject.departureDate}</li></ul><li><ul class="middle-ul"><li>${flightObject.duration}</li><li>${flightObject.stopovers}</li></ul></li><li class="arrival-result"><ul><li class="important">${flightObject.arrivalTime}</li><li>${flightObject.destination} · ${flightObject.arrivalDate}</li></ul></li></ul><li class="price">${flightObject.total} EUR</li></ul>`;
  article.id = "";

  modalBackground.classList.toggle("display-none");
  modalContent.classList.toggle("display-none");
  modalImg.classList.toggle("display-none");
};

form.addEventListener("submit", doSearch); // Añadimos el evento al botón y le asignamos la función manejadora previamente definida.
