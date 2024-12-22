import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../services/ai.service';
import { CameraService } from '../services/camera.service';
import {
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
  IonButton,
  IonImg
} from '@ionic/angular/standalone';
@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonImg
  ]
})
export class QuestionComponent {

  question = '';
  photo: string | undefined;
  conversation: { question: string, answer: string }[] = [];

  constructor(private aiService: AiService, private cameraService: CameraService) { }

  async askQuestion() {
    if (this.question.trim()) {
      const answer = await this.aiService.answerQuestion(this.photo || '', this.question);
      this.conversation.push({ question: this.question, answer });
      this.question = '';
      this.photo = undefined;
    }
  }

  // async askQuestionWithPhoto() {
  //   if (this.photo) {
  //     const answer = await this.aiService.answerQuestionWithPhoto(this.photo);
  //     this.conversation.push({ question: 'Photo Question', answer });
  //     this.photo = undefined;
  //   }
  // }

  async takePhoto() {
    try {
      this.photo = await this.cameraService.takePicture();
      console.log('Picture taken:', this.photo);
    } catch (error) {
      console.error('Error taking picture:', error);
      alert('Error taking picture. Please try again.');
    }
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    await this.askQuestion();
  }

}
