let fs = require("fs");
let axios = require("axios");

let ipfsArray = [];
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

console.log('ipfsArray', ipfsArray.length);
console.log('---------------------------');

// upload to ipfs with moralis
const apiPath = "https://deep-index.moralis.io/api/v2/ipfs/uploadFolder"
axios.post(apiPath, ipfsArray,
    {
        headers: {
            "X-API-KEY": "",
            "Content-Type": "application/json",
            "accept": "application/json",
        }
    }
).then(res => {
    console.log('bulk upload response', res.data);
}).catch(err => {
    console.error(err);
});
