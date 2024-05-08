import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { response } from 'express';

// Mock remote service

@Injectable()
export class ChatService {
  public readonly responses: Subject<string> = new Subject<string>();
  constructor(private http: HttpClient) {}
  public submit(question: string,temperature,top_p): void {
    let params = new HttpParams();
    params = params.set('msg', question);
    params = params.set('temperature', temperature);
   // params = params.set('max_tokens', max_tokens);
    params = params.set('top_p', top_p);
    this.http.get('https://dev.mf.platform/chatbox/get', { params, responseType: 'text' }).subscribe(
      (response: string) => {
        // Log the response for debugging
        console.log('Response:', response.replace(/<\/?p[^>]*>/g, ''));        
        this.responses.next(response.replace(/<\/?p[^>]*>/g, ''));
      },
      (error) => {
        console.error('Error submitting question:', error);
        // Handle error
      }
    );
    // const length = question.length;
    // const answer = `"${question}" contains exactly ${length} symbols.`;

    // setTimeout(
    //   () => this.responses.next(answer),
    //   1000
    // );
  }
}