const url = `https://docs.google.com/spreadsheets/d/1q1SABaMYJv1TskOMJpmFGBeg9UZXknHk3IVGtJouUs8/gviz/tq?`;
const retrievedSheet = getSheet(url);

console.log(retrievedSheet);

// Fetches the Google Sheet resource from the provided URL
function getSheet(url) {
  return new Promise(function (resolve, reject) {
    fetch(url).then((response) => {
      if (!response.ok) {
        reject("Could not find Google Sheet with that URL");
      } // Checking for a 404
      else {
        response.text().then((data) => {
          if (!data) {
            reject("Invalid data pulled from sheet");
          }
          resolve(data);
        });
      }
    });
  });
}
