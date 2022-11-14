"use strict";

import { getToken, getFlightsList } from "./script.js";

const form = document.querySelector("form.search");

const flights = document.querySelector("article.result");

const doSearch = async (event) => {
  event.preventDefault();

  const values = new FormData(form);

  const origen = values.get("origin");
  const destination = values.get("destination");

  const urlAmadeus = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origen.toUpperCase()}&destinationLocationCode=${destination.toUpperCase()}&departureDate=2022-12-15&adults=1`;

  getToken();
  getFlightsList(urlAmadeus);
};

form.addEventListener("submit", doSearch);
