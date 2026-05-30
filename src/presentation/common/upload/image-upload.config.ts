import { randomUUID } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

const ALLOWED_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

export function createImageUploadOptions(
  subdir: string,
  maxSizeMB = 5,
): MulterOptions {
  const uploadDir = join(process.cwd(), 'uploads', subdir);

  return {
    storage: diskStorage({
      destination: (_req, _file, cb) => {
        if (!existsSync(uploadDir)) {
          mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      },
      filename: (_req, file, cb) => {
        cb(null, `${randomUUID()}${extname(file.originalname).toLowerCase()}`);
      },
    }),
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
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
}
