import { Component } from '@angular/core';
import { OpenAiApiService } from '@dis/services/openai/open-ai-api.service'
import {
  Message,
  User,
  SendMessageEvent,
} from "@progress/kendo-angular-conversational-ui";
import { Subject, from, merge, Observable } from "rxjs";
import { map, scan } from "rxjs/operators";


@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {

  // userMessage!: string;
  // assistantReply!: string;
  // chatMessages: { role: string, content: string }[] = [];

  public feed: Observable<Message[]>;

  public readonly user: User = {
    id: 1,
  };

  public readonly bot: User = {
    id: 0,
  };

  private local: Subject<Message> = new Subject<Message>();

  public show = false;

    


  

  constructor(private openAiApiService: OpenAiApiService){

    const chatMessages: Message = 
      {
          author: this.bot,
          timestamp: new Date(),
          text: 'Hi! How can I help you?'
      };
  

          // Merge local and remote messages into a single stream
    this.feed = merge(
      from([chatMessages]),
      this.local,
      this.openAiApiService.responses.pipe(
        map(
          (response): Message => ({
            author: this.bot,
            text: response,
          })
        )
      )
    ).pipe(
      // ... and emit an array of all messages
      scan((acc: Message[], x: Message) => [...acc, x], [])
    );

  }

  // sendMessage() {
  //   const userMessage = this.userMessage;
  //   this.chatMessages.push({ role: 'user', content: userMessage });
  //   this.openAiApiService.sendMessage(this.userMessage)
  //     .subscribe(response => {
  //       this.assistantReply = response;
  //       this.chatMessages.push({ role: 'assistant', content: this.assistantReply });
  //       this.userMessage = '';
  //     });
  // }

  public sendMessage(e: SendMessageEvent): void {
    this.local.next(e.message);

    this.local.next({
      author: this.bot,
      typing: true,
    });

    this.openAiApiService.submit(e.message.text);
  }

  
  public toggleChat(): void {
    this.show = !this.show;
    
  }

  onClick() {
    return;
  }
}
