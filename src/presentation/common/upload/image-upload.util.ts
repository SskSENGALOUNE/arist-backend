import type { Request } from 'express';

export function buildFileUrl(
  req: Request,
  subdir: string,
  filename: string,
): string {
  return `${req.protocol}://${req.get('host')}/uploads/${subdir}/${filename}`;
}
