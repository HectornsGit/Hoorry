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

const inputDate = document.querySelector("input#dateID"); // Seleccionamos el input donde se mostrará la fecha de mañana.
const nightModeButtonElement = document.querySelector("button#mode");
const results = document.querySelector("article.result"); // Selecccionamos el article donde irá nuestro resultado de la búsqueda.
const article = document.querySelector("article#resultID"); // Seleccionamos nuestro article con un nombre diferente, por conveniencia.

// Seleccionamos las partes de nuestra modal.
const modalBackground = document.querySelector("div.modal-background");
const modalContent = document.querySelector("div.modal-content");
const modalImg = document.querySelector("div>img.rotate-center");

// Mostramos la fecha de mañana en el formulario.
inputDate.setAttribute("placeholder", `${getTomorrowDate()}`);

// Función manejadora de nuestro evento.
const doSearch = async (event) => {
  event.preventDefault(); // Previene el funcionaminto por defecto del botón.

  article.id = "resultID"; // Nos aseguramos de que el ID esté puesto para ocultar nuestro article.

  // Iniciamos la modal para mostrar la animación de espera
  modalBackground.classList.toggle("display-none");
  modalContent.classList.toggle("display-none");
  modalImg.classList.toggle("display-none");

  try {
    const values = new FormData(form); // Guardamos en una variable los datos del formulario

    const origin = values.get("origin"); // Campo del formulario donde introducimos el aeropuerto de origen
    const destination = values.get("destination"); // Campo del formulario donde introducimos el aeropuerto de origen

    //---------------- GESTIÓN DE ERRORES DE INPUT---------------------------------//

    if (origin.length !== 3) {
      throw new Error("El código IATA debe contener 3 caracteres.");
    }

    if (destination.length !== 3) {
      throw new Error("El código IATA debe contener 3 caracteres.");
    }
    //--------------------------------------------------------------------//
    const urlAmadeus = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin.toUpperCase()}&destinationLocationCode=${destination.toUpperCase()}&departureDate=${getTomorrowDate()}&adults=1`;

    const flightList = await getFlightsList(urlAmadeus, results); // Guardamos los resultados del fetch en una variable para acceder a ellos más tarde

    // Si no devuelve un objeto, es porque algo ha fallado y lanzamos un error
    if (typeof flightList != "object") {
      throw new Error(flightList);
    }

    // Si la sección del JSON que define los vuelos está vacía es porque no ha encontrado ningún vuelo.
    if (flightList.data.length === 0) {
      throw new Error("Lo sentimos, no hay vuelos disponibles");
    }

    const dict = flightList.dictionaries; // Esto es necesario para sacar el nombre de la aerolínea usando su código de 2 caracteres.

    const flightData = await getCheapestFlight(flightList, results); // Guardamos la información del vuelo más barato.

    const flightObject = await createFlightObject(flightData, dict); // Esto nos genera un objeto con la info que queremos mostrar

    render(flightObject); //Mostramos los resultados en pantalla

    article.id = ""; // Quitamos el id del article, lo que lo  hace visible
  } catch (error) {
    renderError(error);
  } finally {
    // Haya habido errores o no la modal debe dejar paso a la página.
    modalBackground.classList.toggle("display-none");
    modalContent.classList.toggle("display-none");
    modalImg.classList.toggle("display-none");
  }
};

form.addEventListener("submit", doSearch); // Añadimos el evento al botón y le asignamos la función manejadora previamente definida.

nightModeButtonElement.addEventListener("click", () => {
  nightModeButtonElement.classList.toggle("night");
  const htmlElement = document.querySelector("html");
  htmlElement.classList.toggle("night");
});
