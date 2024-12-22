import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  async takePicture(): Promise<string | undefined> {
    try {
      console.log('Attempting to take a picture...');
      const image = await Camera.getPhoto({
        resultType: CameraResultType.Base64,
        quality: 100
      });
      console.log('Image captured:', image);

      return image.base64String 
        ? `data:image/jpeg;base64,${image.base64String}` 
        : undefined;
    } catch (error) {
      console.error('Error taking picture:', error);
      return undefined;
    }
  }

  
}
