import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private readonly MODEL_NAME = 'gemini-1.5-flash';

  async answerQuestion(photo: string | undefined, question: string): Promise<string> {
    try {
      const genAI = new GoogleGenerativeAI(environment.apiKey);
      const model = genAI.getGenerativeModel({ model: this.MODEL_NAME });

      const parts = [];
      if (photo) {
        const base64Image = photo.split(',')[1]; // Extract base64 part
        parts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image
          }
        });
      }
      if (question) {
        parts.push({ text: question });
      }

      const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: parts
        }]
      });
      return result.response.text();
    } catch (error) {
      throw new Error('Failed to answer question with photo');
    }
  }
}
