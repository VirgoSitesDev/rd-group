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
   * Converte un'immagine in formato WebP
   */
  private async convertToWebP(file: File, quality: number = 0.85): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Mantieni le dimensioni originali o riduci se troppo grande
        const maxWidth = 1200;
        const aspectRatio = img.width / img.height;
        let { width, height } = img;

        if (width > maxWidth) {
          width = maxWidth;
          height = width / aspectRatio;
        }

        canvas.width = width;
        canvas.height = height;

        // Disegna l'immagine ottimizzata
        ctx?.drawImage(img, 0, 0, width, height);

        // Converti in WebP
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
                type: 'image/webp',
                lastModified: Date.now()
              });
              resolve(webpFile);
            } else {
              reject(new Error('Errore durante la conversione in WebP'));
            }
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => reject(new Error('Errore nel caricamento dell\'immagine'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Carica immagini per un veicolo specifico con ID
   */
  async uploadVehicleImagesWithId(
    vehicleId: number,
    files: File[],
    onProgress?: (completed: number, total: number) => void
  ): Promise<string[]> {
    try {
      console.log(`🚗 Inizio upload immagini per veicolo ID: ${vehicleId}`);
      
      if (files.length === 0) {
        throw new Error('Nessun file da caricare');
      }

      const uploadedUrls: string[] = [];
      const folderPath = `${vehicleId}`;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`📤 Caricamento immagine ${i + 1}/${files.length}: ${file.name}`);

        // Valida il file
        const validation = this.validateFile(file);
        if (!validation.valid) {
          console.error(`❌ File non valido: ${file.name} - ${validation.error}`);
          throw new Error(`${file.name}: ${validation.error}`);
        }

        // Converti in WebP se necessario
        let fileToUpload = file;
        if (file.type !== 'image/webp') {
          console.log(`🔄 Conversione in WebP: ${file.name}`);
          fileToUpload = await this.convertToWebP(file);
        }

        // Nome file progressivo
        const fileName = `image_${i.toString().padStart(2, '0')}.webp`;
        const filePath = `${folderPath}/${fileName}`;

        console.log(`📁 Upload in: ${filePath}`);

        // Upload su Supabase
        const { data, error } = await supabase.storage
          .from(this.BUCKET_NAME)
          .upload(filePath, fileToUpload, {
            cacheControl: '3600',
            upsert: true // Sovrascrivi se esiste già
          });

        if (error) {
          console.error(`❌ Errore upload ${fileName}:`, error);
          throw new Error(`Errore upload ${fileName}: ${error.message}`);
        }

        // Ottieni URL pubblico
        const { data: urlData } = supabase.storage
          .from(this.BUCKET_NAME)
          .getPublicUrl(filePath);

        if (!urlData?.publicUrl) {
          throw new Error(`Errore nel generare URL pubblico per ${fileName}`);
        }

        uploadedUrls.push(urlData.publicUrl);
        console.log(`✅ Upload completato: ${fileName} -> ${urlData.publicUrl}`);

        // Callback di progresso
        onProgress?.(i + 1, files.length);
      }

      console.log(`🎉 Upload completato per veicolo ${vehicleId}: ${uploadedUrls.length} immagini`);
      return uploadedUrls;

    } catch (error) {
      console.error('❌ Errore durante l\'upload delle immagini:', error);
      throw error;
    }
  }

  /**
   * Elimina tutte le immagini di un veicolo
   */
  async deleteVehicleImages(vehicleId: number): Promise<{ deleted: number; failed: number }> {
    try {
      const folderPath = `${vehicleId}`;
      
      // Lista tutti i file nella cartella del veicolo
      const { data: fileList, error: listError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(folderPath);

      if (listError) {
        console.error('Errore nella lista file:', listError);
        return { deleted: 0, failed: 1 };
      }

      if (!fileList || fileList.length === 0) {
        console.log(`Nessuna immagine trovata per veicolo ${vehicleId}`);
        return { deleted: 0, failed: 0 };
      }

      // Prepara i path per l'eliminazione
      const filePaths = fileList.map(file => `${folderPath}/${file.name}`);

      // Elimina tutti i file
      const { error: deleteError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove(filePaths);

      if (deleteError) {
        console.error('Errore eliminazione immagini:', deleteError);
        return { deleted: 0, failed: filePaths.length };
      }

      console.log(`✅ Eliminate ${filePaths.length} immagini per veicolo ${vehicleId}`);
      return { deleted: filePaths.length, failed: 0 };

    } catch (error) {
      console.error('Errore nell\'eliminazione immagini veicolo:', error);
      return { deleted: 0, failed: 1 };
    }
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
   * METODI LEGACY - manteniamo per compatibilità con altre parti del codice
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
          fileToUpload = await this.convertToWebP(file);
        } catch (error) {
          console.warn('Fallback: utilizzo file originale dopo errore ottimizzazione:', error);
          fileToUpload = file;
        }
      }

      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.webp`;
      const filePath = `temp/${fileName}`;

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

  async uploadMultipleImages(
    files: File[], 
    optimize: boolean = true,
    onProgress?: (completed: number, total: number) => void
  ): Promise<string[]> {
    const urls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      try {
        const url = await this.uploadSingleImage(files[i], optimize);
        urls.push(url);
        onProgress?.(i + 1, files.length);
      } catch (error) {
        console.error(`Errore upload ${files[i].name}:`, error);
        throw error;
      }
    }

    return urls;
  }
}

const uploadService = new UploadService();

// Export delle nuove funzioni specifiche per veicoli
export const uploadVehicleImagesWithId = (
  vehicleId: number, 
  files: File[], 
  onProgress?: (completed: number, total: number) => void
) => uploadService.uploadVehicleImagesWithId(vehicleId, files, onProgress);

export const deleteVehicleImagesById = (vehicleId: number) =>
  uploadService.deleteVehicleImages(vehicleId);

// Export legacy per compatibilità
export const uploadVehicleImages = (files: File[], onProgress?: (completed: number, total: number) => void) =>
  uploadService.uploadMultipleImages(files, true, onProgress);

export const uploadSingleVehicleImage = (file: File) =>
  uploadService.uploadSingleImage(file, true);

export const deleteVehicleImage = (imageUrl: string) => {
  console.warn('deleteVehicleImage deprecata, usa deleteVehicleImagesById');
  return Promise.resolve(true);
};

export const deleteVehicleImages = (imageUrls: string[]) => {
  console.warn('deleteVehicleImages deprecata, usa deleteVehicleImagesById');
  return Promise.resolve({ deleted: 0, failed: 0 });
};

export default uploadService;