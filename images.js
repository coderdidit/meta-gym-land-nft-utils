require('dotenv').config();
const fs = require("fs");
const axios = require("axios");
const assert = require('assert');
const apiKey = process.env.MORALIS_API_KEY;

let ipfsArray = [];
const promises = [];
const imgCount = 5;

for (let i = 1; i < imgCount; i++) {
    promises.push(new Promise((resolve, rejects) => {
        const fileName = i <= 3 ? `avtr_${i}.png` : `mgl_cover.gif`;
        const inPath = `${__dirname}/METADATA-STATIC-APP/graphics/${fileName}`
        console.log('reading file', inPath);
        const outPath = i <= 3 ? `images/${i}.png` : `cover.gif`;
        fs.readFile(inPath,
            (err, data) => {
                if (err) rejects();
                ipfsArray.push({
                    idx: i,
                    path: outPath,
                    content: data.toString("base64")
                })
                resolve();
            }
        )
    }));
}

const apiPath = "https://deep-index.moralis.io/api/v2/ipfs/uploadFolder";
console.log('--------GENERATE NFT IMAGES-------------------');
console.log('apiKey', apiKey);
console.log('apiPath', apiPath);
console.log('---------------------------');

const saveBulkUploadRes = (bulkUploadRes) => {
    const d = new Date();
    const fName = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDay()}-${d.getTime()}.json`;
    const outPath = `${__dirname}/bulk_uploads/${fName}`;
    fs.writeFileSync(
        outPath, JSON.stringify(bulkUploadRes)
    );
    return outPath;
}

Promise.all(promises).then(() => {
    console.log('ipfsArray', ipfsArray.length);
    console.log('---------------------------');
    assert(ipfsArray.length === 4);
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
        'images/1.png',
        'images/2.png',
        'images/3.png',
        'cover.gif'
    ]));

    const ipfsArrayToUpload = ipfsArray.map(i => {
        return {
            'path': i.path,
            'content': i.content
        }
    });
    axios.post(apiPath, ipfsArrayToUpload,
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
});
