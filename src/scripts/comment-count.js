const s_sheetId = "1nineXFzxuUwbKlg6OA2VqcoKHbb5Hcww04ZDQP539A0";

// Processes comment data with the Google Sheet ID
function getCommentCount() {
  // Get the data
  const url = `https://docs.google.com/spreadsheets/d/${s_sheetId}/gviz/tq?`;
  const retrievedSheet = getSheet(url);

  retrievedSheet.then((result) => {
    const json = JSON.parse(
      result
        .split("\n")[1]
        .replace(/google.visualization.Query.setResponse\(|\);/g, ""),
    );

    console.log(json);

    const isPage = (col) => col.label == "Page";
    let pageIdx = json.table.cols.findIndex(isPage);

    console.log(pageIdx);
    const blogPostsCommentCount = document.querySelectorAll("a[data-url]");
    console.log(blogPostsCommentCount);
    blogPostsCommentCount.forEach((commentLink) => {
      const url = commentLink.getAttribute("data-url");
      console.log(url);
      let commentCount = 0;
      if (json.table.parsedNumHeaders > 0) {
        // Check if any comments exist in the sheet at all before continuing
        for (r = 0; r < json.table.rows.length; r++) {
          // Check for null rows
          let val1;
          if (!json.table.rows[r].c[pageIdx]) {
            val1 = "";
          } else {
            val1 = json.table.rows[r].c[pageIdx].v;
          }

          // Check if the page name matches before adding to comment array
          if (val1.toLowerCase() == url.toLowerCase()) {
            commentCount++;
          }
        }
        console.log("comment count: ", commentCount);
        if (commentCount == 1) {
          commentLink.innerHTML = "1 comment";
        } else {
          commentLink.innerHTML = commentCount + " comments";
        }
      }
    });
  });
}

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

getCommentCount();
