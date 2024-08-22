function checkFaceFraming(boundingBox, image) {
  const { x, y, width, height } = boundingBox;
  const imageWidth = image.width;
  const imageHeight = image.height;

  // Verificar se a face está centrada e não cortada
  if (x < 0 || y < 0 || x + width > imageWidth || y + height > imageHeight) {
    return false;
  }

  // Verificar se a face ocupa uma boa parte da imagem
  const faceArea = width * height;
  const imageArea = imageWidth * imageHeight;

  console.log(faceArea / imageArea);

  return faceArea / imageArea >= 0.1;
}

module.exports = checkFaceFraming;
