import request from "request";

export const forecast = (lat, long, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=${process.env.API_KEY_WEATHER_STACK}&query=${lat},${long}`;

  request({ url: url, json: true }, (error, response) => {
    if (error) {
      callback("Unable to connect to the weather", undefined);
      //   console.log("Unable to connect to the weather");
      //console.log(response.statusCode);
      //console.log(error);
    } else if (response.body.error) {
      callback("Unable to find location, try with correct query", undefined);
      //   console.log("Unable to find location");
    } else {
      const resultString = `${response.body.current.weather_descriptions}. It is currently ${response.body.current.temperature} and feels like ${response.body.current.feelslike} `;
      callback(undefined, resultString);
      // console.log(response.statusCode);
      // console.log("In response");
      //   console.log(response.body);
      //   console.log(
      //     `It is currently ${response.body.current.temperature} and feels like ${response.body.current.feelslike} `
      //   );
    }
  });
};
