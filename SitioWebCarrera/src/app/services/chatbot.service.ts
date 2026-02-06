import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'http://localhost:3000/api/chat';

  constructor(private http: HttpClient) {}

  sendMessage(
    message: string,
    history: ChatMessage[],
    modelId: string
  ): Observable<{ text: string }> {
    return this.http.post<{ text: string }>(this.apiUrl, {
      message,
      history,
      modelId
    });
  }
}
