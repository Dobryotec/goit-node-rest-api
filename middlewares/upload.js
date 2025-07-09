import multer from 'multer';
import { resolve } from 'node:path';
import HttpError from '../helpers/HttpError.js';

const tempDir = resolve('temp');

const storage = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const fileName = `${uniquePrefix}_${file.originalname}`;
    cb(null, fileName);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 10,
};

const fileFilter = (req, file, cb) => {
  const extension = file.originalname.split('.').pop();

  if (extension === 'exe') {
    return cb(HttpError(400, '.exe extension not allow'));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  limits,
  fileFilter,
});
