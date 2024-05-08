import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { FormatSettings } from "@progress/kendo-angular-dateinputs";
import { Subject, from, merge, Observable } from "rxjs";
import { map, scan } from "rxjs/operators";
import { HttpClient } from '@angular/common/http';
import { DialogService, DialogRef } from '@progress/kendo-angular-dialog';

import {
  Message,
  User,
  SendMessageEvent,
} from "@progress/kendo-angular-conversational-ui";
import { ChatService } from "../chat.service";
import { FileInfo, RemoveEvent, UploadEvent } from '@progress/kendo-angular-upload';

@Component({
  selector: 'app-llm-chatbox',
  templateUrl: './llm-chatbox.component.html',
  styleUrls: ['./llm-chatbox.component.scss'],
  providers: [ChatService]
})
export class LlmChatboxComponent implements OnInit {
  @ViewChild('upload') upload: any;
  public autoCorrect = true;
  selectedFile: File | null = null;
  public title: any = '';
  public author: any = '';
  public file: any;
  public top_p:number=0.1;
  public temperature:number=0.2;
  public max_tokens:number=150;
  public feed: Observable<Message[]>;
  selectedFiles: File[] = [];
  public uploadSaveUrl = "https://dev.mf.platform/chatbox/upload-file";
  public readonly user: User = {
    id: 1,
  };
  isInitialized: boolean = false;
  public readonly bot: User = {
    id: 0,
  };

  private local: Subject<Message> = new Subject<Message>();
  constructor(private dialogService: DialogService, private svc: ChatService, private http: HttpClient) {
    const hello: Message = {
      author: this.bot,
      // suggestedActions: [
      //   {
      //     type: "reply",
      //     value: "Neat!",
      //   },
      //   {
      //     type: "reply",
      //     value: "Thanks, but this is boring.",
      //   },
      // ],
      timestamp: new Date(),
      text: "Hello, this is a Generative SAM!",
    };

    // Merge local and remote messages into a single stream
    this.feed = merge(
      from([hello]),
      this.local,
      this.svc.responses.pipe(
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
  public sendMessage(e: SendMessageEvent): void {
    this.local.next(e.message);

    this.local.next({
      author: this.bot,
      typing: true,
    });

    this.svc.submit(e.message.text,this.temperature,this.top_p);
  }
  ngOnInit(): void {

  }

  saveFile() {   
    if (this.file) {
      const uploadedFiles = this.file;
      // Handle the uploaded files here
      console.log('Uploaded files1:', uploadedFiles);
  
      const formData: FormData = new FormData();
      formData.append('title', this.title);
      formData.append('uploader', this.author);
      formData.append('file', uploadedFiles, uploadedFiles.name);
  
  
      this.http.post('https://dev.mf.platform/chatbox/upload-file', formData)
        .subscribe(
          response => {
            console.log('File uploaded successfully:', response['message']);
            this.showSuccessDialog(response['message']);
            // Optionally, you can trigger any additional logic upon successful upload
          },
          error => {
            console.error('Error uploading file:', error);
            // Handle upload error
          }
        );
    }
    else {
      console.log('No file selected.');
    }
  }
  // Function to display success dialog
  showSuccessDialog(msg) {
    const dialogRef: DialogRef = this.dialogService.open({
      title: 'Success!',
      content: msg,
      actions: [{ text: 'OK', primary: true }]
    });

    dialogRef.result.subscribe((result) => {
      // Handle the result if needed
    });
  }
  onUpload(event: any) {
    const uploadedFiles = event.files[0].rawFile as File;
    // Handle the uploaded files here
    console.log('Uploaded files:', uploadedFiles);

    const formData: FormData = new FormData();
    formData.append('title', this.title);
    formData.append('uploader', this.author);
    formData.append('file', uploadedFiles, uploadedFiles.name);

    // Manually send the HTTP request using HttpClient
    this.http.post(this.uploadSaveUrl, formData)
      .subscribe(
        response => {
          console.log('File uploaded successfully:', response);
          // Optionally, you can trigger any additional logic upon successful upload
        },
        error => {
          console.error('Error uploading file:', error);
          // Handle upload error
        }
      );
  }

  handleFileSelected(event: any) {
    console.log(event.files[0].rawFile as File);
    this.file = event.files[0].rawFile as File;
  }
  handleFileRemoved(event: RemoveEvent) {
    this.file = null;
  }

  apply_parameters(){
    this.showSuccessDialog("Parameters applied. They will be used for the next message.");
  }
}
