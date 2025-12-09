const userColourProperty = [];

const AllData = {};


/**
 * fetches data onetime and stores it in const "AllData"
 * @async @global
 */
async function fetchAllDataGlobal() {
    let joinFetch = await fetch(base_url + ".json");
    let joinData = await joinFetch.json();
    return AllData.data = joinData;
};


