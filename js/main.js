"use strict";

import {
  getFlightsList,
  getCheapestFlight,
  getTomorrowDate,
  createFlightObject,
  render,
  renderError,
} from "./script.js";

const form = document.querySelector("form.search"); // Seleccionamos el formulario.
const results = document.querySelector("article.result"); // Selecccionamos el article donde irá nuestro resultado de la búsqueda.
const inputDate = document.querySelector("input#dateID");
const article = document.querySelector("article#resultID");
const modalBackground = document.querySelector("div.modal-background");
const modalContent = document.querySelector("div.modal-content");
const modalImg = document.querySelector("div>img.rotate-center");
const errorElement = document.querySelector("article.error");
inputDate.setAttribute("placeholder", `${getTomorrowDate()}`);

// Función manejadora de nuestro evento.
const doSearch = async (event) => {
  event.preventDefault(); // Previene el funcionaminto por defecto del botón.

  article.id = "resultID";

  modalBackground.classList.toggle("display-none");
  modalContent.classList.toggle("display-none");
  modalImg.classList.toggle("display-none");

  //---------------- GESTIONAR LOS ERRORES !!!----------------------//
  try {
    if (!errorElement.classList.contains("display-none")) {
      errorElement.classList.toggle("display-none");
    }

    const values = new FormData(form); // Guardamos en una variable los datos del formulario

    const origin = values.get("origin"); // Campo del formulario donde introducimos el aeropuerto de origen
    const destination = values.get("destination"); // Campo del formulario donde introducimos el aeropuerto de origen
    if (origin.length != 3) {
      throw new Error("EL CÓDIGO IATA DEBE CONTENER 3 CARÁCTERES");
    }
    if (destination.length != 3) {
      throw new Error("EL CÓDIGO IATA DEBE CONTENER 3 CARÁCTERES");
    }
    const urlAmadeus = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin.toUpperCase()}&destinationLocationCode=${destination.toUpperCase()}&departureDate=${getTomorrowDate()}&adults=1`;

    const flightList = await getFlightsList(urlAmadeus, results); // Guardamos los resultados del fetch en una variable para acceder a ellos más tarde
    if (typeof flightList != "object") {
      throw new Error(flightList);
    }
    if (flightList.data.length === 0) {
      throw new Error("Lo sentimos, no hay vuelos disponibles");
    }

    const dict = flightList.dictionaries;

    const flightData = await getCheapestFlight(flightList, results); // Guardamos la información del vuelo más barato.

    const flightObject = await createFlightObject(flightData, dict); // Esto nos genera un objeto con la info que queremos mostrar

    //--------------------------------------------------HACER UNA FUNCIÓN PARA MOSTRAR LOS RESULTADOS----------------------------------------//
    render(flightObject);
    article.id = "";
  } catch (error) {
    renderError(error);
  } finally {
    modalBackground.classList.toggle("display-none");
    modalContent.classList.toggle("display-none");
    modalImg.classList.toggle("display-none");
  }
};

form.addEventListener("submit", doSearch); // Añadimos el evento al botón y le asignamos la función manejadora previamente definida.
