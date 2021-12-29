require('dotenv').config();
const assert = require('assert');
const fs = require("fs");
const axios = require("axios");

const apiKey = process.env.MORALIS_API_KEY;
const ipfsArray = [];
const imgCount = 4;

const hash = ""

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
const outPathForTest = ipfsArray.map(i => {
    return {
        "path": i.path,
        "content_non_empty": i.content != "",
        "idx": i.idx
    }
}).sort((a, b) => a.idx - b.idx);

console.log("outPathForTest", outPathForTest);
assert(outPathForTest.filter(i => i.content_non_empty).length == outPathForTest.length);
assert(JSON.stringify(outPathForTest.map(i => i.path)) == JSON.stringify([
    'metadata/0000000000000000000000000000000000000000000000000000000000000001.json',
    'metadata/0000000000000000000000000000000000000000000000000000000000000002.json',
    'metadata/0000000000000000000000000000000000000000000000000000000000000003.json',
]));

const ipfsArrayToUpload = ipfsArray.map(i => {
    return {
        'path': i.path,
        'content': i.content
    }
});

// axios.post(apiPath, ipfsArrayToUpload,
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
