import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

export async function optimizeImage({
  inputPath,
  outputFolder,
  width = 1200,
  quality = 80,
}) {
  await fs.mkdir(outputFolder, { recursive: true });

  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
  const outputPath = path.join(outputFolder, filename);

  await sharp(inputPath)
    .resize({
      width,
      withoutEnlargement: true,
    })
    .webp({ quality })
    .toFile(outputPath);

  await fs.unlink(inputPath);

  return {
    filename,
    path: outputPath,
    mimetype: "image/webp",
  };
}
