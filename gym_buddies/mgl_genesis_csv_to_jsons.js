
const fs = require("fs");
const csv = fs.readFileSync("gym_buddies/mgl_genesis.csv");

const lines = csv.toString().split("\r");

const properties = lines[0].split(",")
const values = lines.slice(1);

const collection_cid = "cid";

for (const [lineIndex, lineValues] of values.entries()) {
    if (lineIndex < 10) {
        console.log(lineValues);
        const attributes = [];
        for (const [valIndex, lineValue] of lineValues.split(",").entries()) {
            if (lineValue && properties[valIndex] != "number") {
                const attr = {
                    "trait_type": properties[valIndex],
                    "value": lineValue.replace("\n", ""),
                }
                attributes.push(attr);
            }
        }
        const idx = lineIndex + 1;
        const obj = {
            "description": "MetaGymLand GymBuddy that loves AI and NFTs",
            "image": `https://gateway.pinata.cloud/ipfs/${collection_cid}/gb${idx}.png`,
            "sprite": `https://gateway.pinata.cloud/ipfs/${collection_cid}/gbpx${idx}.png`,
            "collection_name": "MetaGymLand Genesis GymBuddies",
            "attributes": attributes,
        };
        console.log(obj);
        // save as json file
        const json = JSON.stringify(obj);
        fs.writeFileSync(`mgl_genesis_jsons/gb${idx}.json`, json);
    }
}
