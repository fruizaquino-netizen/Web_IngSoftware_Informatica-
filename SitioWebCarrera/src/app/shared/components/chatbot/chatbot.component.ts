import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService, ChatMessage } from '../../../services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  isOpen = false;
  isLoading = false;
  userMessage = '';
  selectedModel = 'gemini-2.5-flash';

  availableModels = [
    'gemini-2.0-flash',
    'gemini-2.5-flash',
    'gemini-2.0-flash-lite'
  ];

  messages: { text: string; sender: 'user' | 'bot' }[] = [
    {
      text: 'Hola, soy tu asistente virtual. ¿En qué puedo ayudarte?',
      sender: 'bot'
    }
  ];

  apiHistory: ChatMessage[] = [];

  constructor(private chatService: ChatbotService) {}

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;

    const currentMsg = this.userMessage;
    this.userMessage = '';
    this.isLoading = true;

    this.messages.push({ text: currentMsg, sender: 'user' });

    this.chatService
      .sendMessage(currentMsg, this.apiHistory, this.selectedModel)
      .subscribe({
        next: (res) => {
          this.messages.push({ text: res.text, sender: 'bot' });
          this.apiHistory.push(
            { role: 'user', parts: [{ text: currentMsg }] },
            { role: 'model', parts: [{ text: res.text }] }
          );
          this.isLoading = false;
        },
        error: () => {
          this.messages.push({ text: 'Error al conectar.', sender: 'bot' });
          this.isLoading = false;
        }
      });
  }
}
