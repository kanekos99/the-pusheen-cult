const submit_button = document.getElementById("member_submitButton");
const member_list = document.getElementById("member-list");
const member_count = document.getElementById("member-count");

const s_formId = "1FAIpQLSd8EJjb4946nTT_KWqFcwtLqnf7lCimFJoJTlt4IK_qQkdfig";
const s_nameId = "2050543907";
const s_emailId = "1020743832";
const s_sheetId = "189bt1so6tJMdj0JuMJ1VIno9UwRHFV-L9Uub3VEXadI";

function getMemberCount() {
  // Disable the submit button while comments are reloaded
  submit_button.disabled;

  // Clear input fields too
  document.getElementById(`entry.${s_nameId}`).value = "";
  document.getElementById(`entry.${s_emailId}`).value = "";

  const query = encodeURIComponent("SELECT count(A)");
  const url = `https://docs.google.com/spreadsheets/d/${s_sheetId}/gviz/tq?tq=${query}`;
  const data = getSheet(url);
  data.then((result) => {
    const json = JSON.parse(
      result
        .split("\n")[1]
        .replace(/google.visualization.Query.setResponse\(|\);/g, ""),
    );
    const totalMembers = json.table.rows[0].c[0].v;
    member_count.innerHTML =
      "Currently we have <b>" + totalMembers + "</b> members!";
  });

  submit_button.disabled = false;
}

function getData() {
  // Disable the submit button while comments are reloaded
  submit_button.disabled;

  // Clear input fields too
  document.getElementById(`entry.${s_nameId}`).value = "";
  document.getElementById(`entry.${s_emailId}`).value = "";

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
    let members = [];
    if (json.table.parsedNumHeaders > 0) {
      for (r = 0; r < json.table.rows.length; r++) {
        let member = {};
        member.name = json.table.rows[r].c[1].v;
        member.date = json.table.rows[r].c[0].f;
        members.push(member);
      }
    }
    displayMembers(members);
    submit_button.disabled = false;
  });
}

function displayMembers(members) {
  member_list.innerHTML = "";
  members.reverse();
  members.forEach((member) => {
    const memberHtml = `
      <div class="member-row">
        <p class="member-name">${member.name}</p>
        <p class="join-date">${member.date}</p>
      </div>  
    `;
    member_list.innerHTML += memberHtml;
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

// hidden iframe handling

const member_form = document.getElementById("member_form");
let v_submitted = false;
let c_hiddenIframe = document.createElement("iframe");
c_hiddenIframe.id = "c_hiddenIframe";
c_hiddenIframe.name = "c_hiddenIframe";
c_hiddenIframe.style.display = "none";
c_hiddenIframe.setAttribute("onload", "if(v_submitted){fixFrame()}");
member_form.appendChild(c_hiddenIframe);
c_hiddenIframe = document.getElementById("c_hiddenIframe");

function fixFrame() {
  v_submitted = false;
  c_hiddenIframe.srcdoc = "";
  getMemberCount();
}

getMemberCount();
//getData(); - Not showing this due to PDPA...
