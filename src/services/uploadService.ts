import { supabase } from './supabase';

class UploadService {
  private readonly BUCKET_NAME = 'vehicle-images';
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  /**
   * Valida un file immagine
   */
  private validateFile(file: File): { valid: boolean; error?: string } {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `Formato file non supportato. Formati permessi: ${this.ALLOWED_TYPES.join(', ')}`
      };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File troppo grande. Dimensione massima: ${this.MAX_FILE_SIZE / 1024 / 1024}MB`
      };
    }

    return { valid: true };
  }

  /**
   * Genera un nome file unico
   */
  private generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
    return `${timestamp}_${randomString}.${extension}`;
  }

  /**
   * Ottimizza un'immagine (resize e compressione)
   */
  private async optimizeImage(file: File, maxWidth: number = 1200): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const aspectRatio = img.width / img.height;
        let { width, height } = img;

        if (width > maxWidth) {
          width = maxWidth;
          height = width / aspectRatio;
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const optimizedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(optimizedFile);
            } else {
              reject(new Error('Errore durante l\'ottimizzazione dell\'immagine'));
            }
          },
          'image/jpeg',
          0.85
        );
      };

      img.onerror = () => reject(new Error('Errore nel caricamento dell\'immagine'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Carica un singolo file su Supabase Storage
   */
  async uploadSingleImage(file: File, optimize: boolean = true): Promise<string> {
    try {
      const validation = this.validateFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      let fileToUpload = file;
      if (optimize && file.type !== 'image/webp') {
        try {
          fileToUpload = await this.optimizeImage(file);
        } catch (error) {
          console.warn('Fallback: utilizzo file originale dopo errore ottimizzazione:', error);
          fileToUpload = file;
        }
      }

      const fileName = this.generateFileName(file.name);
      const filePath = `vehicles/${fileName}`;

      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw new Error(`Errore upload: ${error.message}`);
      }

      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error('Errore nel generare URL pubblico');
      }

      return urlData.publicUrl;

    } catch (error) {
      console.error('Errore upload immagine:', error);
      throw error;
    }
  }

  /**
   * Carica multiple immagini in parallelo
   */
  async uploadMultipleImages(
    files: File[], 
    optimize: boolean = true,
    onProgress?: (completed: number, total: number) => void
  ): Promise<string[]> {
    const urls: string[] = [];
    const errors: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      try {
        const url = await this.uploadSingleImage(files[i], optimize);
        urls.push(url);
        onProgress?.(i + 1, files.length);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
        errors.push(`${files[i].name}: ${errorMessage}`);
        console.error(`Errore upload ${files[i].name}:`, error);
      }
    }

    if (errors.length > 0) {
      console.warn('Alcuni file non sono stati caricati:', errors);
    }

    if (urls.length === 0) {
      throw new Error('Nessun file è stato caricato con successo');
    }

    return urls;
  }

  /**
   * Elimina un'immagine da Supabase Storage
   */
  async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      const filePath = pathParts.slice(pathParts.indexOf('vehicles')).join('/');

      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        console.error('Errore eliminazione immagine:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Errore nell\'eliminazione immagine:', error);
      return false;
    }
  }

  /**
   * Elimina multiple immagini
   */
  async deleteMultipleImages(imageUrls: string[]): Promise<{ deleted: number; failed: number }> {
    let deleted = 0;
    let failed = 0;

    for (const url of imageUrls) {
      try {
        const success = await this.deleteImage(url);
        if (success) {
          deleted++;
        } else {
          failed++;
        }
      } catch (error) {
        failed++;
        console.error('Errore eliminazione immagine:', url, error);
      }
    }

    return { deleted, failed };
  }

  /**
   * Verifica se il bucket esiste e ha le giuste permission
   */
  async checkBucketAccess(): Promise<boolean> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list('', { limit: 1 });

      return !error;
    } catch (error) {
      console.error('Errore accesso bucket:', error);
      return false;
    }
  }

  /**
   * Ottieni informazioni sul bucket
   */
  async getBucketInfo(): Promise<{ totalFiles: number; totalSize: number } | null> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list('vehicles', { limit: 1000 });

      if (error || !data) {
        return null;
      }

      const totalFiles = data.length;
      const totalSize = data.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);

      return { totalFiles, totalSize };
    } catch (error) {
      console.error('Errore info bucket:', error);
      return null;
    }
  }
}

const uploadService = new UploadService();

export const uploadVehicleImages = (files: File[], onProgress?: (completed: number, total: number) => void) =>
  uploadService.uploadMultipleImages(files, true, onProgress);

export const uploadSingleVehicleImage = (file: File) =>
  uploadService.uploadSingleImage(file, true);

export const deleteVehicleImage = (imageUrl: string) =>
  uploadService.deleteImage(imageUrl);

export const deleteVehicleImages = (imageUrls: string[]) =>
  uploadService.deleteMultipleImages(imageUrls);

export default uploadService;