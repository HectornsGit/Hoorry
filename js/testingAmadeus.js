"use strict";
/* 
Por si es de ayuda dejo también estos links para tenerlos a mano!

**********TUTORIAL DE AUTENTICACIÓN Y OBTENCIÓN DE TOKENS DE AMADEUS**********

https://developers.amadeus.com/self-service/apis-docs/guides/authorization-262

******************************************************************************

***********************PÁGINAS SOBRE FETCH*********************************

https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
---------------------------------------------------------------------------
https://javascript.info/fetch

***************************************************************************

*/

// Aquí tenemos nuestras credenciales que luego enviaremos en la petición POST para recibir nuestro token
const APIkey = "d8pgZY1izvGNlhEvDbPM53apBUxeiBPf";
const APIsecret = "qgTe58ynZsqrqUqr";

//URL a la que hay que hacer la petición POST para recibir el token
const amadeusAutUrl = `https://test.api.amadeus.com/v1/security/oauth2/token`;

//URL a la que hacer peticiones con unos parámetros y nos devuelve unos vuelos
const amadeusUrl =
  "https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=MAD&destinationLocationCode=BOS&departureDate=2022-11-21&adults=1";

//Esta función se encarga de hacer una petición POST a un servidor para que nos envíen un token para poder acceder a la API de búsqueda de vuelos.

async function getToken() {
  try {
    //La petición la hacemos con la URL que definimos previamente y un objeto con unos parámetros que describen como es la petición
    const response = await fetch(amadeusAutUrl, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded", //Esto le dice a la API que tipo de datos va a recibir
      },
      body: `grant_type=client_credentials&client_id=${APIkey}&client_secret=${APIsecret}`, //Aquí envíamos nuestras credenciales en un formato según lo que ponía en la web
    });

    //Si nuestra fetch fue exitosa, se ejecuta esto
    if (response.ok) {
      const data = await response.json(); //Obtenemos el JSON que contiene la respuesta de nuestra fetch

      console.log(data); //Console log para saber que recibimos con nuestra fetch

      const accessToken = data.access_token; //Aquí guardamos nuestro PRECIADO token para poder autentificarnos al usar la API (aunque no sepamos como aún)

      return accessToken;
    }
    //Si esto no ocurre lanzamos un error
    throw new Error("hubo un error");
  } catch (error) {
    //Esto solo se ejecuta si algo falla
    console.log(error.message);
  }
}

//Esta función se encargará de hacer la petición a la API de búsqueda de los vuelos, aquí es donde no estamos consiguiendo autenticarnos
async function main() {
  //Aquí ejecutamos la función de arriba para obtener nuestro token
  const token = await getToken();

  const response = await fetch(amadeusUrl, {
    method: "GET",
    headers: {
      Authoritation: `Bearer ${token}`, //Supuestamente esta es la manera de autenticarnos
    },
    mode: "cors", //Nos da un error de CORS así que he probado a poner esta línea, pero no parece funcionar
  });

  if (response.ok) {
    const data = await response.json();
    console.log(data); //Lo mismo que antes, si todo sale bien esto se ejecuta y podemos ver que nos devuelve esta fantástica API
  }
}
main();
