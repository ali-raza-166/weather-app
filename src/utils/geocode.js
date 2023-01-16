import request from "request";

export const geocode = (address, callback) => {
  const url1 = `http://api.positionstack.com/v1/forward?access_key=722146318622c2d16b999b6c6e0e759b&query=${encodeURIComponent(
    address
  )}`;

  request({ url: url1, json: true }, (error, response) => {
    if (error) {
      //   console.log("Unable to connect to API");
      callback("Unable to connect to API", undefined); //we are returning whatever happend here to the caller function
    } else if (response.body.error) {
      callback("Unable to find latitude and longitude", undefined);
      // console.log(response.body.error.context);
      // console.log("Unable to find latitude and longitude");
    } else {
      //   console.log(
      //     `The longitude is ${response.body.data[0].longitude} and latitude is ${response.body.data[0].latitude}`
      //   );
      if (response.body.data.length === 0) {
        callback(
          "Unable to find long/lat for this location, Try different location",
          undefined
        );
      } else {
        //console.log(response.body.data);
        const latitude = response.body.data[0].latitude;
        const longitude = response.body.data[0].longitude;
        const location = response.body.data[0].label;
        callback(undefined, { latitude, longitude, location });
      }
    }
  });
};
