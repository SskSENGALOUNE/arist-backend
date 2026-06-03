import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { WebSocket as WsWebSocket } from 'ws';
import { randomUUID } from 'crypto';
import { extname } from 'path';

// supabase-js eagerly constructs a Realtime client that requires a global
// `WebSocket`, which Node < 22 doesn't provide. We only use Storage, so a
// lightweight polyfill is enough to keep `createClient` from throwing.
if (typeof (globalThis as { WebSocket?: unknown }).WebSocket === 'undefined') {
  (globalThis as { WebSocket?: unknown }).WebSocket = WsWebSocket;
}

@Injectable()
export class SupabaseStorageService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseStorageService.name);
  private readonly client: SupabaseClient;
  private readonly bucket: string;

  constructor(private readonly config: ConfigService) {
    const url = this.config.getOrThrow<string>('SUPABASE_URL');
    const serviceKey = this.config.getOrThrow<string>('SUPABASE_SERVICE_KEY');
    this.bucket = this.config.get<string>('SUPABASE_BUCKET', 'arist');
    this.client = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  async onModuleInit() {
    const { data } = await this.client.storage.getBucket(this.bucket);
    if (!data) {
      const { error } = await this.client.storage.createBucket(this.bucket, {
        public: true,
      });
      if (error) {
        this.logger.warn(
          `Could not create bucket "${this.bucket}": ${error.message}`,
        );
      } else {
        this.logger.log(`Bucket "${this.bucket}" created (public)`);
      }
      return;
    }
    // Bucket exists — make sure it's public, otherwise getPublicUrl() links 404.
    if (!data.public) {
      const { error } = await this.client.storage.updateBucket(this.bucket, {
        public: true,
      });
      if (error) {
        this.logger.warn(
          `Could not make bucket "${this.bucket}" public: ${error.message}`,
        );
      } else {
        this.logger.log(`Bucket "${this.bucket}" set to public`);
      }
    }
  }

  /**
   * Uploads a file to `<bucket>/<folder>/<uuid><ext>` and returns its public URL.
   */
  async upload(folder: string, file: Express.Multer.File): Promise<string> {
    const ext = extname(file.originalname).toLowerCase();
    const objectName = `${folder}/${randomUUID()}${ext}`;
    const { error } = await this.client.storage
      .from(this.bucket)
      .upload(objectName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });
    if (error) {
      throw new Error(`Supabase upload failed: ${error.message}`);
    }
    const { data } = this.client.storage
      .from(this.bucket)
      .getPublicUrl(objectName);
    return data.publicUrl;
  }

  /**
   * Removes an object. Accepts either the object path (`folder/file.png`) or a
   * full public URL — the bucket prefix is stripped automatically.
   */
  async delete(objectNameOrUrl: string): Promise<void> {
    const marker = `/${this.bucket}/`;
    const idx = objectNameOrUrl.indexOf(marker);
    const objectName =
      idx >= 0 ? objectNameOrUrl.slice(idx + marker.length) : objectNameOrUrl;
    await this.client.storage.from(this.bucket).remove([objectName]);
  }
}
