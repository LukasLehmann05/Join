const colours = [
     '#aaa827ff',
     '#dd711fff',
     '#3567d3ff',
     '#539e27ff',
    '#b6322eff',
     '#992b97ff',
    '#8a6710ff',
    '#9077d4ff',
    '#c93360ff'
];

async function fetchContactList() {
    let response = await fetch(base_url + ".json");
    let responseJson = await response.json();
    let contactData = responseJson.contacts;
    renderContactList(contactData);
};

function renderContactList(contactData) {
    let acronym = getAcronym(contactData.contact_id_b.name);
    let letter = contactData.contact_id_b.name.charAt(0).toLowerCase();
    document.getElementById(letter).innerHTML += contactListSingle(contactData.contact_id_b, acronym);
    colorAcronym(contactData.contact_id_a)
};

function getAcronym(name) {
    let matches = name.match(/\b(\w)/g);
    let acronym = matches.join('');
    return acronym;
};

function colorAcronym(data) {
     let element = document.getElementById("listShort" + data);
     let color = colours[Math.floor(Math.random() * colours.length)];
     element.style.backgroundColor = color;
};

function renderContactInMain() {

};

//for key object loop to render in list