let fs = require("fs");
let axios = require("axios");
const { rejects } = require("assert");

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
                    path: outPath,
                    content: data.toString("base64")
                })
                resolve();
            }
        )
    }));
}

Promise.all(promises).then(() => {
    console.log('ipfsArray', ipfsArray.length);
    console.log('---------------------------');
    for (const f of ipfsArray) {
        console.log(f);
    }
});
