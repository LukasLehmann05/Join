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
