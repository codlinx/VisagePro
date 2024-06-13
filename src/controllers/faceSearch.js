const tf = require("@tensorflow/tfjs-node");
const faceapi = require("@vladmandic/face-api");
const canvas = require("canvas");

const db = require("../db");

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

class faceSearch {
  static async handler(req, res) {
    const { file } = req.body;

    if (!file)
      return res.status(400).json({
        error: true,
        message: "É preciso enviar uma imagem da face a ser localizada.",
      });

    await Promise.all([
      faceapi.nets.faceRecognitionNet.loadFromDisk("./src/weights"),
      faceapi.nets.faceLandmark68Net.loadFromDisk("./src/weights"),
      faceapi.nets.ssdMobilenetv1.loadFromDisk("./src/weights"),
    ]);

    const image = await canvas.loadImage(file);

    const faceLand = await faceapi
      .detectSingleFace(image)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!faceLand)
      return res
        .status(400)
        .json({ error: true, message: "Não foi possivel encontrar rostos." });

    try {
      const items = await db
        .query("faces")
        .select("*")
        .whereRaw(`euclidean_distance(?, embedding) < 0.55`, [
          faceLand.descriptor.toString(),
        ]);

      return res.json({
        error: false,
        message: "Face cadastrada com sucesso.",
        items,
      });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = faceSearch;
