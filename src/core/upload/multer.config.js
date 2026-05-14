import multer from "multer";
import path from "path";
import crypto from "crypto";
import { AppError } from "../errors/app-error.js";
import { getFileCategory } from "./file-types.js";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/temp");
  },

  filename: (req, file, callback) => {
    const hash = crypto.randomBytes(16).toString("hex");
    const extension = path.extname(file.originalname);

    callback(null, `${hash}${extension}`);
  },
});

function fileFilter(req, file, callback) {
  const category = getFileCategory(file.mimetype);

  if (!category) {
    return callback(
      new AppError("Tipo de arquivo não permitido", 400),
      false
    );
  }

  file.category = category;

  return callback(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});
