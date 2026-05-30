import { createImageUploadOptions } from '../common/upload/image-upload.config';

export const BANNER_UPLOAD_SUBDIR = 'banners';

export const bannerMulterOptions = createImageUploadOptions(BANNER_UPLOAD_SUBDIR);
