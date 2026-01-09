const userColorProperty = {};
const contactColorProperty = {};

const AllData = {};

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