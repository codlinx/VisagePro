const tf = require("@tensorflow/tfjs-node");
const faceapi = require("@vladmandic/face-api");
const canvas = require("canvas");
const uuid = require("uuid");

const Face = require("../models/Face");

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

class faceUpload {
  static async handler(req, res) {
    const { file, ref } = req.body;

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

    try {
      let face = await Face.findOne({
        where: {
          customerId: req.customer.id,
          ref,
        },
      });

      if (face) {
        //realiza comparacoes para verificar se a face bate com a ref
        const distance = faceapi.euclideanDistance(
          face.embedding,
          faceLand.descriptor
        );

        // Se não bater, retorna erro
        if (distance > 0.55)
          return res.json({
            error: false,
            message: "Ocorreu um erro. Referência incompatível.",
            distance,
          });

        face.embedding = [...faceLand.descriptor];
        await face.save();

        return res.json({
          error: false,
          message: "Face atualizada com sucesso.",
          face,
        });
      } else {
        //Verifica se face ja existe
        const items = await db.query(
          `
          SELECT * FROM (
            SELECT id
                 , uuid
                 , ref
                 , embedding <-> :embedding AS distance
            FROM faces
            ORDER BY distance ASC
            WHERE customerId = :customerId
          ) AS result
           WHERE distance < 0.55
           LIMIT 1
          `,
          {
            type: db.QueryTypes.SELECT,
            replacements: {
              embedding: `[${[...faceLand.descriptor]}]`,
              customerId: req.customer.id,
            },
          }
        );

        if (items.length > 0)
          return res.status(400).json({
            error: true,
            message:
              "Ocorreu um erro. Face já cadastrada - Referência: " +
              items[0].ref,
          });

        face = await Face.create({
          uuid: uuid.v4(),
          ref,
          embedding: [...faceLand.descriptor],
          customerId: req.customer.id,
        });

        return res.json({
          error: false,
          message: "Face cadastrada com sucesso.",
          face,
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = faceUpload;
