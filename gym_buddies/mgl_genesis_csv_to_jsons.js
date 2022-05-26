
const fs = require("fs");
const csv = fs.readFileSync("gym_buddies/mgl_genesis.csv");

const lines = csv.toString().split("\r");

const properties = lines[0].split(",")
const values = lines.slice(1);

const collection_cid = "bafybeietlso25ekzdwzfsbdu3lknwswfrh77woxaokpduj5jaebbeomhay";

const runTest = false;

/**
    Rarity or Level are driven by Metadata file ids in ipfs
    gb{id}.json
    0 - 4 Mystic => example gb3.json
    5 - 14 Legendary
    15 - 29 Rare
    30 - onwards Common
*/

const levels = new Map([
    ['0-4', "mystic"],
    ['5-14', "legendary"],
    ['15-29', "rare"],
])

const levelsArray = [[0, 4], [5, 14], [15, 29]];

const resoveLevel = (idx) => {
    for (const [min, max] of levelsArray) {
        if (idx >= min && idx <= max) {
            return levels.get(`${min}-${max}`);
        }
    }
    return "common"
};

const getGameFiRandomAttirbutes = () => {
    return [
        {
            "trait_type": "endurance",
            "value": 1 + (Math.random() * 10 ** 18) % 70,
        },
        {
            "trait_type": "consistency",
            "value": 1 + (Math.random() * 10 ** 18) % 40,
        },
        {
            "trait_type": "sweatiness",
            "value": 5 + (Math.random() * 10 ** 18) % 100,
        },
        {
            "trait_type": "motivation",
            "value": 1 + (Math.random() * 10 ** 18) % 80,
        },
        {
            "trait_type": "strength",
            "value": 1 + (Math.random() * 10 ** 18) % 50,
        },
        {
            "trait_type": "luck",
            "value": 1 + (Math.random() * 10 ** 18) % 100,
        }
    ]
}

for (const [lineIndex, lineValues] of values.entries()) {
    if (runTest && lineIndex > 10) break;
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
    // level
    attributes.push({
        "trait_type": "level",
        "value": resoveLevel(lineIndex),
    });
    // gameFi
    attributes.push(...getGameFiRandomAttirbutes());
    const idx = lineIndex + 1;
    const nameObj = attributes.find(a => a["trait_type"] == "name");
    const obj = {
        "name": nameObj ? nameObj["value"] : "noname",
        "description": "MetaGymLand GymBuddy that loves AI and NFTs",
        "image": `ipfs://${collection_cid}/gb${idx}.png`,
        "sprite": `ipfs://${collection_cid}/gbpx${idx}.png`,
        "collection_name": "MetaGymLand Genesis GymBuddies",
        "attributes": attributes,
    };
    if (runTest) console.log(obj);
    // save as json file
    const json = JSON.stringify(obj);
    fs.writeFileSync(`mgl_genesis_jsons/gb${idx - 1}.json`, json);
}
