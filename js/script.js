"use strict";

async function getToken() {
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

    throw new Error("hubo un error");
  } catch (error) {
    console.error(error.message);
  }
}

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
    console.log(response);
    throw new Error(
      `Ha habido un error ${response.status} ${response.statusText}!`
    );
  } catch (error) {
    console.error(error.message);
  }
}

export { getToken, getFlightsList };
