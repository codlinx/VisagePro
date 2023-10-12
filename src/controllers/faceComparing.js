const faceapi = require("face-api.js");
const canvas = require("canvas");
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

class faceComparing {
  static async handler(req, res) {
    const { file1, file2 } = req.body;

    if (!file1 || !file2)
      return res
        .status(400)
        .json({ error: true, message: "É preciso enviar duas imagens." });

    await faceapi.nets.faceRecognitionNet.loadFromDisk("./src/weights");
    await faceapi.nets.faceLandmark68Net.loadFromDisk("./src/weights");
    await faceapi.nets.ssdMobilenetv1.loadFromDisk("./src/weights");

    const image1 = await canvas.loadImage(file1);
    const image2 = await canvas.loadImage(file2);

    const face1 = await faceapi
      .detectSingleFace(image1)
      .withFaceLandmarks()
      .withFaceDescriptor();
    const face2 = await faceapi
      .detectSingleFace(image2)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!face1 || !face2)
      return res
        .status(400)
        .json({ error: true, message: "Não foi possivel encontrar rostos." });

    const distance = faceapi.euclideanDistance(
      face1.descriptor,
      face2.descriptor
    );

    const threshold = 0.55;

    if (distance < threshold)
      return res.json({
        error: false,
        approved: true,
        message: "Os rostos são semelhantes.",
        distance,
      });
    else
      return res.json({
        error: false,
        approved: true,
        message: "Os rostos não são semelhantes.",
        distance,
      });
  }
}

module.exports = faceComparing;
