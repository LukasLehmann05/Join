const userColorProperty = {};
const contactColorProperty = {};

const AllData = {};


// temporary function to get contact colors on board load
async function getContactColorObj() {
    let contactData = (await fetchAllDataGlobal()).contacts;
    for (let contactID in contactData) {
        assignColorToContact(contactID);
    }
};

getContactColorObj();
