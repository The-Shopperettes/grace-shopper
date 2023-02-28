const axios = require('axios');
const fs = require('fs');

let plantData = [];

async function pullPlantData() {
    for(let i = 1; i < 200; i++) {
        const {data} = await axios.get(`https://perenual.com/api/species-list?page=${i}&key=sk-RhbN63fe2d6635f17135`);

        for(let plant of data.data) {
            console.log("plant", plant)
            const qty = Math.floor(Math.random() * 200) + 50;
            const price = Math.floor(Math.random() * 69) + 1;
            const sunlight = plant.sunlight.join(", ") || "";
            const scientificName = plant.scientific_name[0] || null;
            const images = plant.default_image;

            //validate
            if(!images || !images.regular_url || !images.medium_url || !scientificName || !plant.common_name) break;

            plantData.push({
                id: plant.id,
                name: plant.common_name,
                scientificName,
                cycle: plant.cycle,
                watering: plant.watering,
                sunlight,
                largeImg: images.regular_url,
                mediumImg: images.medium_url,
                thumbnail: images.thumbnail,
                qty,
                price
            })
        }

    }

    fs.writeFile("/Users/leahtreidler/Desktop/VS_Code_Folders/grace-shopper/script/data.js", `const plantData = JSON.parse(${JSON.stringify(plantData)});`, err => {
        if (err) {
          console.error(err);
        }
        // file written successfully
    });
}

pullPlantData();


// id (primary key)
// name (string)
// scientific_name (string)
// cycle (string)
// watering (string)
// sunlight (string)
// large_img (string)
// medium_img (string)
// thumbnail (string)
// qty (int)
// price (float)