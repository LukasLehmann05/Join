const userColorProperty = {};
const contactColorProperty = {};

const AllData = {};

/**
 * array for colours to choose from for generating background colour in contact list
 */
const colours = [
    '#b4a429ff',
    '#FF4646',
    '#aa7f24ff',
    '#FFC701',
    '#0038FF',
    '#76a00eff',
    '#FF745E',
    '#FFA35E',
    '#FC71FF',
    '#9327FF',
    '#00BEE8',
    '#228f82ff',
    '#FF7A00',
    '#FF5EB3',
    '#6E52FF'
];


// TODO: Refactor to single function for users and contacts
// Helper function to get contact colors on board load
async function getContactColorObj() {
    let contactData = (await fetchAllDataGlobal()).contacts;
    for (let contactID in contactData) {
        assignColorToContact(contactID);
    }
};

getContactColorObj();


/**
 * chooses color for contact randomly from colours array. Gets called in function: "renderContactList()"
 * assigns colors to contact permanently in contactColorProperty
 * @const contactColorProperty
 */
function assignColorToContact() {
    let userColor = colours[Math.floor(Math.random() * colours.length)];
    return userColor;
};