
//prune the data to get rid of repeated names, sort, and format names correctly
function validateData() {
    plantData.sort((a,b) => {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    })

    let validated = [];
    let hash = {};
    for(let plant of plantData) {
        if(!hash[plant.name.toLowerCase()]) {
            hash[plant.name.toLowerCase()] = true;
            plant.name = capitalize(plant.name);
            const {id, ...obj} = plant
            validated.push(obj);
        }
    }

    plantData = validated;
}

function capitalize(name) {
    return name.split(' ').map(i => {
        i.trim();
        i = i[0].toUpperCase() + i.slice(1).toLowerCase();
        return i;
    }).join(' ');
}

validateData();

module.exports = plantData;