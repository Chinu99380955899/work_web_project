import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

export const saveFileLocally = (
  file: Express.Multer.File,
  folder: string
): string => {
  const folderPath = path.join(UPLOADS_DIR, folder);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const timestamp = Date.now();
  const sanitizedName = file.originalname
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9.-]/g, '_');

  const fileName = `${timestamp}-${sanitizedName}`;
  const filePath = path.join(folderPath, fileName);

  fs.writeFileSync(filePath, file.buffer);

  const port = process.env.PORT || 4000;
  return `http://localhost:${port}/uploads/${folder}/${fileName}`;
};

export const isS3Configured = (): boolean => {
  const key = process.env.AWS_ACCESS_KEY_ID;
  return !!key && key !== 'your_aws_access_key_id';
};
