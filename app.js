// Code to use OpenAI's DALL-E 2 model to edit an image
require("dotenv").config(); // Load .env file
const { default: axios } = require("axios");
const fs = require("fs");
const OpenAi = require("openai");
const openai = new OpenAi(process.env.OPENAI_API_KEY);
const sharp = require("sharp");

// before running this code, check the following:
// 1. source image and mask image must have same resolution
// 2. check your openai api key is in .env file and the key is valid.
// 3. check file names and folder names(src, rgba, dest) are correct.
// 4. check package.json file has all the required packages.

const yourRequestConfig = {
  srcImageName: "src.png", //source image file name
  maskImageName: "mask.png", //mask image file name
  theNumberOfImages: 2, //the number of images you want to get
  yourPrompt: "", //type your prompt here
};

//-----------------you don't need to modify below this line-----------------//
const srcImagePath = `./src/${yourRequestConfig.srcImageName}`;
const maskImagePath = `./src/${yourRequestConfig.maskImageName}`;

const rgbaSrcImagePath = `./rgba/_${srcImageName}`;
const rgbaMaskImagePath = `./rgba/_${maskImageName}`;

const destFolderPath = "./dest";

//main function
async function imageProcessing() {
  //1. source image to rgba
  await sharp(srcImagePath)
    .ensureAlpha()
    .toFormat("png")
    .toFile(rgbaSrcImagePath)
    .then(() => {
      console.log("src image to rgba done");
    })
    .catch((err) => {
      console.log(err);
    });

  //2. mask image to rgba
  await sharp(maskImagePath)
    .ensureAlpha()
    .toFormat("png")
    .toFile(rgbaMaskImagePath)
    .then(() => {
      console.log("mask image to rgba done");
    })
    .catch((err) => {
      console.log(err);
    });

  //3. send images to openai
  console.log(
    "sending images to openai... waiting for urls from openai...(it will take a few seconds)"
  );
  try {
    const image = await openai.images.edit({
      model: "dall-e-2",
      n: yourRequestConfig.theNumberOfImages,
      image: fs.createReadStream(rgbaSrcImagePath),
      mask: fs.createReadStream(rgbaMaskImagePath),
      prompt: yourRequestConfig.yourPrompt, //type your prompt here
    });
  } catch (err) {
    console.log(err);
  }

  image.data.forEach((data, idx) =>
    console.log(`image ${idx + 1}: ${data.url}`)
  );

  //4. download images
  image.data.forEach(async (data, idx) => {
    const url = data.url;
    const filename = `${Date.now()}_dest_${idx + 1}.png`; //the filename of the image to be saved
    await axios({
      url,
      responseType: "stream",
    })
      .then((response) => {
        response.data.pipe(
          fs.createWriteStream(`${destFolderPath}/${filename}`)
        );
        response.data.on("end", () => {
          console.log(`image ${idx + 1} downloaded successfully!`);
        });
      })
      .catch((err) => {
        console.log(`image ${idx + 1} download failed\n${err}`);
      });
  });
}

class basicValidation {
  constructor() {}
  isEnv() {
    if (!process.env.OPENAI_API_KEY) {
      console.log("OpenAI API key not found in .env file");
      return false;
    }
    return true;
  }
  isImagesExist() {
    if (!fs.existsSync(srcImagePath)) {
      console.log("src image or mask image does not exist");
      return false;
    }
    if (!fs.existsSync(maskImagePath)) {
      console.log("mask image does not exist");
      return false;
    }
  }
  isImagesHaveSameResolution() {
    const srcImage = sharp(srcImagePath);
    const maskImage = sharp(maskImagePath);
    const srcImageMetadata = srcImage.metadata();
    const maskImageMetadata = maskImage.metadata();
    if (
      srcImageMetadata.width === maskImageMetadata.width &&
      srcImageMetadata.height === maskImageMetadata.height
    ) {
      return true;
    }
    console.log("source image and mask image do not have same resolution");
    return false;
  }

  isRgbaFolderExist() {
    if (!fs.existsSync("./rgba")) {
      console.log(
        "rgba folder does not exist in the current directory so creating one..."
      );
      try {
        fs.mkdirSync("./rgba");
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    }
  }
  isDestFolderExist() {
    if (!fs.existsSync(destFolderPath)) {
      console.log(
        "dest folder does not exist in the current directory so creating one..."
      );
      try {
        fs.mkdirSync(destFolderPath);
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    }
  }
}

async function main() {
  console.log("main function started");
  console.log("checking the environment...");
  const validation = new basicValidation();
  //main function
  if (
    validation.isEnv() &&
    validation.isImagesExist() &&
    validation.isImagesHaveSameResolution() &&
    validation.isRgbaFolderExist() &&
    validation.isDestFolderExist()
  ) {
    console.log("environment check complete");
    console.log("Do you want image processing? (y/n)");
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", function (text) {
      //delete carriage return (for windows users)
      text = text.replace("\r", "");
      if (text === "n\n") {
        console.log("program terminated");
        process.exit();
      } else if (text === "y\n") {
        console.log("image processing started");
        imageProcessing();
      } else {
        console.log("please type y or n");
      }
    });
  }
}

main().then(() => {
  //ask to user if they want to process the image again
  console.log("Do you want image processing again? (y/n)");
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", function (text) {
    //delete carriage return (for windows users)
    text = text.replace("\r", "");
    if (text === "n\n") {
      console.log("program terminated");
      process.exit();
    } else if (text === "y\n") {
      console.log("image processing started again");
      main();
    } else {
      console.log("please type y or n");
    }
  });
});
