require('dotenv').config();
const assert = require('assert');
const fs = require("fs");
const axios = require("axios");

const apiKey = process.env.MORALIS_API_KEY;
const ipfsArray = [];
const imgCount = 4;

const hash = "123"

for (let i = 1; i < imgCount; i++) {
    const paddedHex = ("000000000000000000000000000000000000000000000000000000000000000") + i.toString();
    const outPath = `metadata/${paddedHex}.json`;
    ipfsArray.push({
        path: outPath,
        content: {
            image: `ipfs://${hash}/images/${i}.png`,
            name: "",
            description: ""
        }
    })
}

console.log('--------GENERATE NFT METADATA-------------------');
console.log('apiKey', apiKey);
console.log('---------------------------');
console.log('ipfsArray', ipfsArray.length);
console.log('---------------------------');

assert(ipfsArray.length === 3);

console.log("ipfsArray", ipfsArray);

assert(JSON.stringify(ipfsArray.map(i => i.path)) == JSON.stringify([
    'metadata/0000000000000000000000000000000000000000000000000000000000000001.json',
    'metadata/0000000000000000000000000000000000000000000000000000000000000002.json',
    'metadata/0000000000000000000000000000000000000000000000000000000000000003.json',
]));
console.log('compare outPathForTest[0] to expected', ipfsArray[0]);
assert(JSON.stringify(ipfsArray[0]) == JSON.stringify({
    path: 'metadata/0000000000000000000000000000000000000000000000000000000000000001.json',
    content: { image: `ipfs://${hash}/images/1.png`, name: '', description: '' }
}));


// axios.post(apiPath, ipfsArray,
//     {
//         headers: {
//             "X-API-KEY": apiKey,
//             "Content-Type": "application/json",
//             "accept": "application/json",
//         }
//     }
// ).then(res => {
//     console.log('bulk upload response', res.data);

//     const path = saveBulkUploadRes(res.data);
//     console.log('bulk upload result saved at path: ', path);
// }).catch(err => {
//     console.error(err);
// });

const saveBulkUploadRes = (bulkUploadRes) => {
    const d = new Date();
    const fName = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDay()}-${d.getTime()}.json`;
    const outPath = `${__dirname}/bulk_uploads/${fName}`;
    fs.writeFileSync(
        outPath, JSON.stringify(bulkUploadRes)
    );
    return outPath;
}
