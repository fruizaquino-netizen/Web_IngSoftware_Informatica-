import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ChatbotService, ChatMessage } from '../../../services/chatbot.service';

interface ChatBubble {
  text: string;
  html: SafeHtml;
  sender: 'user' | 'bot';
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  @ViewChild('chatBody') private chatBody?: ElementRef<HTMLDivElement>;

  isOpen = false;
  isLoading = false;
  userMessage = '';
  selectedModel = 'gemini-2.5-flash-lite';

  availableModels = ['gemini-2.5-flash-lite'];

  messages: ChatBubble[] = [];

  apiHistory: ChatMessage[] = [];

  constructor(
    private chatService: ChatbotService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {
    this.messages = [
      this.createMessage('Hola, soy tu asistente virtual. ¿En qué puedo ayudarte?', 'bot')
    ];
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    this.refreshView();
  }

  sendMessage() {
    if (this.isLoading || !this.userMessage.trim()) return;

    const currentMsg = this.userMessage.trim();
    this.userMessage = '';
    this.isLoading = true;

    this.addMessage(currentMsg, 'user');

    this.chatService
      .sendMessage(currentMsg, this.apiHistory, this.selectedModel)
      .subscribe({
        next: (res) => {
          this.addMessage(res.text, 'bot');
          this.apiHistory.push(
            { role: 'user', parts: [{ text: currentMsg }] },
            { role: 'model', parts: [{ text: res.text }] }
          );
          this.isLoading = false;
          this.refreshView();
        },
        error: (err) => {
          const errorMessage =
            err?.error?.error ||
            'No pude conectar con el asistente en este momento. Intenta de nuevo.';
          this.addMessage(errorMessage, 'bot');
          this.isLoading = false;
          this.refreshView();
        }
      });
  }

  private addMessage(text: string, sender: 'user' | 'bot') {
    this.messages = [...this.messages, this.createMessage(text, sender)];
    this.refreshView();
  }

  private createMessage(text: string, sender: 'user' | 'bot'): ChatBubble {
    const html = sender === 'bot' ? this.formatBotMessage(text) : this.escapeHtml(text);

    return {
      text,
      sender,
      html: this.sanitizer.bypassSecurityTrustHtml(html)
    };
  }

  private formatBotMessage(text: string) {
    const lines = this.escapeHtml(text).split(/\r?\n/);
    const blocks: string[] = [];
    let listItems: string[] = [];

    const flushList = () => {
      if (!listItems.length) return;
      blocks.push(`<ul>${listItems.map((item) => `<li>${this.formatInlineMarkdown(item)}</li>`).join('')}</ul>`);
      listItems = [];
    };

    for (const rawLine of lines) {
      const line = rawLine.trim();

      if (!line) {
        flushList();
        continue;
      }

      const bullet = line.match(/^[-*]\s+(.+)$/);
      if (bullet) {
        listItems.push(bullet[1]);
        continue;
      }

      flushList();

      if (/^[^:]{2,45}:$/.test(line)) {
        blocks.push(`<p class="bot-section-title">${this.formatInlineMarkdown(line.slice(0, -1))}</p>`);
      } else {
        blocks.push(`<p>${this.formatInlineMarkdown(line)}</p>`);
      }
    }

    flushList();
    return blocks.join('');
  }

  private formatInlineMarkdown(text: string) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.+?)`/g, '<code>$1</code>');
  }

  private escapeHtml(text: string) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private refreshView() {
    this.cdr.detectChanges();
    setTimeout(() => this.scrollToLatestMessage());
  }

  private scrollToLatestMessage() {
    if (!this.chatBody) return;

    const body = this.chatBody.nativeElement;
    body.scrollTop = body.scrollHeight;
  }
}
