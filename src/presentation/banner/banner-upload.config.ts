import { randomUUID } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const BANNER_UPLOAD_SUBDIR = 'banners';
export const BANNER_UPLOAD_DIR = join(
  process.cwd(),
  'uploads',
  BANNER_UPLOAD_SUBDIR,
);

const ALLOWED_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

export const bannerMulterOptions: MulterOptions = {
  storage: diskStorage({
    destination: (_req, _file, cb) => {
      if (!existsSync(BANNER_UPLOAD_DIR)) {
        mkdirSync(BANNER_UPLOAD_DIR, { recursive: true });
      }
      cb(null, BANNER_UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
      cb(null, `${randomUUID()}${extname(file.originalname).toLowerCase()}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new BadRequestException(
          'Unsupported file type. Allowed: png, jpg, webp, gif, svg.',
        ),
        false,
      );
    }
  },
};
