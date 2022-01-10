require('dotenv').config();
const assert = require('assert');
const fs = require("fs");
const axios = require("axios");

const apiKey = process.env.MORALIS_API_KEY;
const ipfsArray = [];
const imgCount = 3;

const hash = "QmVF53rCjFiFSXyJd64NgeGioQG93gegdsymyMWtJLG9Ev"

const metadataMapping = new Map([
    [0, { // blue
        name: "Erach Salte",
        description: "Go to the gym to boost energy and stay healthy",
        background_color: "5E75C6",
        attributes: {},
    }],
    [1, { // girl
        name: "Orlai Grande",
        description: "Go to the gym to boost energy and look beautiful",
        background_color: "F2D8D6",
        attributes: {},
    }],
    [2, { // red
        name: "Odialt Drutum",
        description: "Go to the gym to improve his muscles and look good",
        background_color: "F2EBD1",
        attributes: {},
    }],
    [4, { // demo avatar
        name: "Demo Testus",
        description: "Go to the gym to demonstrate",
        background_color: "FFFFFF",
        attributes: {},
    }]
]);

for (let i = 0; i < imgCount; i++) {
    const paddedHex = ("000000000000000000000000000000000000000000000000000000000000000") + i.toString();
    const outPath = `metadata/${paddedHex}.json`;
    ipfsArray.push({
        path: outPath,
        content: {
            image: `https://ipfs.moralis.io:2053/ipfs/${hash}/images/${i}.png`,
            cover_image: `https://ipfs.moralis.io:2053/ipfs/${hash}/images/${i}.png`,
            collection_name: "Moralis Avalanche Hackaton 2021 Test Drop",
            collection_cover_image: `https://ipfs.moralis.io:2053/ipfs/${hash}/cover.gif`,
            sprite: {
                image: `https://ipfs.moralis.io:2053/ipfs/${hash}/images/${i}.png`,
                json: {}
            },
            category: "avatars",
            ...metadataMapping.get(i)
        }
    })
}

console.log('--------GENERATE NFT METADATA-------------------');
console.log('apiKey', apiKey);
console.log('---------------------------');
console.log('ipfsArray', ipfsArray.length);
console.log('---------------------------');

assert(ipfsArray.length === 4);

console.log("ipfsArray", ipfsArray);

assert(JSON.stringify(ipfsArray.map(i => i.path)) == JSON.stringify([
    'metadata/0000000000000000000000000000000000000000000000000000000000000000.json',
    'metadata/0000000000000000000000000000000000000000000000000000000000000001.json',
    'metadata/0000000000000000000000000000000000000000000000000000000000000002.json',
]));
console.log('compare outPathForTest[0] to expected', ipfsArray[0]);
assert(JSON.stringify(ipfsArray[0]) == JSON.stringify({
    path: 'metadata/0000000000000000000000000000000000000000000000000000000000000000.json',
    content: {
        image: `https://ipfs.moralis.io:2053/ipfs/${hash}/images/0.png`,
        cover_image: `https://ipfs.moralis.io:2053/ipfs/${hash}/images/0.png`,
        collection_name: "Moralis Avalanche Hackaton 2021 Test Drop",
        collection_cover_image: `https://ipfs.moralis.io:2053/ipfs/${hash}/cover.gif`,
        sprite: {
            image: `https://ipfs.moralis.io:2053/ipfs/${hash}/images/0.png`,
            json: {}
        },
        category: 'avatars',

        name: 'Erach Salte',
        description: "Go to the gym to boost energy and stay healthy",
        background_color: '5E75C6',
        attributes: {}
    }
}));

const apiPath = "https://deep-index.moralis.io/api/v2/ipfs/uploadFolder";
axios.post(apiPath, ipfsArray,
    {
        headers: {
            "X-API-KEY": apiKey,
            "Content-Type": "application/json",
            "accept": "application/json",
        }
    }
).then(res => {
    console.log('bulk upload response', res.data);

    const path = saveBulkUploadRes(res.data);
    console.log('bulk upload result saved at path: ', path);
}).catch(err => {
    console.error(err);
});

const saveBulkUploadRes = (bulkUploadRes) => {
    const d = new Date();
    const fName = `metadata-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDay()}-${d.getTime()}.json`;
    const outPath = `${__dirname}/bulk_uploads/${fName}`;
    fs.writeFileSync(
        outPath, JSON.stringify(bulkUploadRes)
    );
    return outPath;
}
