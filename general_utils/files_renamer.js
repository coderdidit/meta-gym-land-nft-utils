const { readdirSync, rename } = require('fs');
const { resolve } = require('path');

// Get path to image directory
const imageDirPath = resolve(__dirname, 'gym_buddies_images_v0.0.1_px');

// Get an array of the files inside the folder
const files = readdirSync(imageDirPath);

// Loop through each file that was retrieved
const filePrefix = "gbpx";
const fileSuffix = ".png";
files.sort((a, b) => {
    return parseInt(a.replace(filePrefix, "").replace(fileSuffix, "")) -
        parseInt(b.replace(filePrefix, "").replace(fileSuffix, ""))
}).forEach(file => {
    if (file.toString() != ".DS_Store") {
        const num = parseInt(file.toString()
            .replace(filePrefix, "").replace(fileSuffix, ""));
        const newName = `${filePrefix}${num - 1}${fileSuffix}`;
        console.log(`${file.toString()} ===> ${newName}`);
        rename(
            imageDirPath + `/${file}`,
            imageDirPath + `/${newName}`,
            err => console.log(err)
        )
    }
});
