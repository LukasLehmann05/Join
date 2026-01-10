const userColorProperty = {};
const contactColorProperty = {};

const AllData = {};

// TODO: Refactor to single function for users and contacts
/**
 * Fetches all global data and assigns a color to each contact for board rendering.
 * Calls `fetchAllDataGlobal()` to retrieve contacts, then invokes
 * `assignColorToContact(contactID)` for each contact id found.
 * @returns {Promise<void>}
 */
async function getContactColorObj() {
    let contactData = (await fetchAllDataGlobal()).contacts;
    for (let contactID in contactData) {
        assignColorToContact(contactID);
    }
};


getContactColorObj();
