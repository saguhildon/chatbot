
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OpenAiApiService {

 // private apiUrl = environment.API_ROOT; // Update with your Node.js server URL

  constructor(private http: HttpClient) { }

  // public sendMessage(message: string) {
  //   //return this.http.post<any>(`${this.apiUrl}/chat`, { message });
  //   let m = "I have received your message";

  //   const numbers$ = of(m + "---"+ message);
    
  //   return numbers$;
  // }

  public readonly responses: Subject<string> = new Subject<string>();

  public submit(question: string): void {
    const length = question.length;
    const answer = `"${question}" contains exactly ${length} symbols.`;

    setTimeout(() => this.responses.next(answer), 1000);
  }
}