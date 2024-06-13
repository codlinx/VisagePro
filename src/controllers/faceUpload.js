const tf = require("@tensorflow/tfjs-node");
const faceapi = require("@vladmandic/face-api");
const canvas = require("canvas");
const uuid = require("uuid");

const Face = require("../models/Face");

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

class faceUpload {
  static async handler(req, res) {
    const { file } = req.body;

    if (!file)
      return res.status(400).json({
        error: true,
        message: "É preciso enviar uma imagem da face a ser cadastrada.",
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

    // const face = "OK";

    console.log(faceLand.descriptor);

    try {
      const face = await Face.create({
        embedding: [...faceLand.descriptor],
        uuid: uuid.v4(),
        customerId: req.customer.id,
      });

      return res.json({
        error: false,
        message: "Face cadastrada com sucesso.",
        face,
      });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = faceUpload;
