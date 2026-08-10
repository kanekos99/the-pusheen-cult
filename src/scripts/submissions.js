const submit_button = document.getElementById("submitButton");
const submit_form = document.getElementById("submit_form");
let submissions = document.getElementById("submissions");
const fullPath = window.location.pathname.split("/").filter(Boolean);
let lastPath = fullPath.pop(); 
let v_pagePath = `/${lastPath}/`; 

const s_formId = "1FAIpQLScSApUU3Hl57oWIsa2BPU-mTTE5UWCGSoeXUaFppoODRgzB_g";
const s_nameId = "936029012";
const s_websiteId = "930512521";
const s_messageId = "1237998829";
const s_pageId = "305815362";
const s_sheetId = "1GawHz1ZDObj3ft83adpjmecx_-4U7eeUhSnChxFf9mY";

const defaultTestmonialInnerHTML = `
  <p class="mt-3">
    <i>"Both the Internet and the Outernet should accept Pusheen as our
    Lord and Saviour! Pusheen is life. Life is Pusheen</i>
    <br/>
    -Anonymous
  </p>
  <p>
    <i>"Meow meow meow mew meow!"<br/>
    (which our feline translators have translated to: "Pusheen is great! We get free food thanks to her!")
    </i>
    <br/>
    - A friendly stray cat
  </p>
`;

const defaultPrayerInnerHtml = `
  <p class="mt-3">No submissions yet!</p>
`;

function getData() {
  // Disable the submit button while comments are reloaded
  submit_button.disabled;

  // Clear input fields too
  document.getElementById(`entry.${s_nameId}`).value = "";
  document.getElementById(`entry.${s_websiteId}`).value = "";
  document.getElementById(`entry.${s_messageId}`).value = "";

  // Get the data
  const url = `https://docs.google.com/spreadsheets/d/${s_sheetId}/gviz/tq?`;
  const retrievedSheet = getSheet(url);

  // Do stuff with the data here
  retrievedSheet.then((result) => {
    // The data comes with extra stuff at the beginning, get rid of it
    const json = JSON.parse(
      result
        .split("\n")[1]
        .replace(/google.visualization.Query.setResponse\(|\);/g, ""),
    );
    const isPage = (col) => col.label == "Page";
    let pageIdx = json.table.cols.findIndex(isPage);

    let comments = [];
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
        if (val1.toLowerCase() == v_pagePath.toLowerCase()) {
          let comment = {};
          for (c = 0; c < json.table.cols.length; c++) {
            // Check for null values
            let val2;
            if (!json.table.rows[r].c[c]) {
              val2 = "";
            } else {
              val2 = json.table.rows[r].c[c].v;
            }

            // Finally set the value properly
            comment[json.table.cols[c].label] = val2;
          }
          comment.Timestamp2 = json.table.rows[r].c[0].f;
          comments.push(comment);
        }
      }
    }
    // Check for empty comments before displaying to page
    if (comments.length == 0 || Object.keys(comments[0]).length < 2) {
      // Once again, Google Sheets can be weird
      if (v_pagePath == "/the-lord-is-listening/") {
        submissions.innerHTML = defaultPrayerInnerHtml;
      } else {
        submissions.innerHTML = defaultTestmonialInnerHTML;
      }
      submissions += "<p></i>No more submissions!</i></p>";
    } else {
      displayComments(comments);
    }
    submit_button.disabled = false;
  });
}

function displayComments(comments) {
  if (v_pagePath == "/the-lord-is-listening/") {
    submissions.innerHTML = "";
  } else {
    submissions.innerHTML = defaultTestmonialInnerHTML;
  }
  comments.forEach((comment) => {
    let commentName = "";
    let commentText = "";

    if (comment.Name && comment.Name.trim() !== "") {
      commentName = comment.Name;
    } else {
      commentName = "Anonymous";
    }

    if (comment.Message && comment.Message.trim() !== "") {
      commentText = comment.Message;
    } else {
      commentText = "I love Pusheen!";
    }

    const commentHtml = `
      <p class="mt-3">
        "<i>${commentText}</i>"
        <br/>
        - ${commentName}
      </p>
    `;
    submissions.innerHTML += commentHtml;
  });
}

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

// hidden page input
let s_includeUrlParameters = false;
const s_fixRarebitIndexPage = false;
if (s_includeUrlParameters) {
  v_pagePath += window.location.search;
}
if (s_fixRarebitIndexPage && v_pagePath == "/") {
  v_pagePath = "/?pg=1";
}
const c_pageInput = document.createElement("input");
c_pageInput.value = v_pagePath;
c_pageInput.type = "text";
c_pageInput.style.display = "none";
c_pageInput.id = "entry." + s_pageId;
c_pageInput.name = c_pageInput.id;
submit_form.appendChild(c_pageInput);

// hidden iframe handling

let v_submitted = false;
let c_hiddenIframe = document.createElement("iframe");
c_hiddenIframe.id = "c_hiddenIframe";
c_hiddenIframe.name = "c_hiddenIframe";
c_hiddenIframe.style.display = "none";
c_hiddenIframe.setAttribute("onload", "if(v_submitted){fixFrame()}");
submit_form.appendChild(c_hiddenIframe);
c_hiddenIframe = document.getElementById("c_hiddenIframe");

function fixFrame() {
  v_submitted = false;
  c_hiddenIframe.srcdoc = "";
  getData();
}

getData();
