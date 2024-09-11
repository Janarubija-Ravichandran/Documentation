import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../material-module';
import jsPDF from 'jspdf';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-dashboard',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  providers: [MessageService]
})
export class FileUploadComponent implements OnInit {

  progress: number = 0;
  userId: string = '123456';
  email: string | null = '';
  isSidenavOpen = false;
  isLoading = false;
  displayDialog: boolean = false;
  public apiUrl = environment.LOGIN_BASEURL;

  //doc
  userQuery: string = '';
  showChat: boolean = false;
  messages: Array<{ query: string; answer: string; documents: string[] }> = [];
  @ViewChild('chatScroll') private chatScroll!: ElementRef;
  @ViewChild('cardContainer', { static: false }) cardContainer!: ElementRef;


  constructor(
    public dialog: MatDialog,
    public router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private messageService: MessageService
  ) {

  }

  ngOnInit(): void {
    this.email = localStorage.getItem('email');
    if (!this.email) {
      this.router.navigate(['/login']);
    }
  }

  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  showTopLeft(): void {
    this.messageService.add({
      key: 'tl',  // 'tl' refers to the position key for top-left
      severity: 'info',
      summary: 'Logout Successful',
      detail: 'You have been successfully logged out.'
    });
  }

  // Logout function to clear local storage and show the toast message
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('email');

    // Show the toast message
    this.showTopLeft();

    // Navigate to the login page after showing the message
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 500);
  }

//doc

startChat() {
  this.showChat = true;
}

sendQuery() {
  if (this.userQuery.trim() === '') {
    return;
  }

  // Mock data to simulate database answer and related documents
  const answer = this.getAnswerForQuery(this.userQuery);
  const documents = this.getRelatedDocuments(this.userQuery);

  // Add the message with multiple documents to the messages array
  this.messages.push({
    query: this.userQuery,
    answer: answer,
    documents: documents.slice(0, 4) // Max 4 documents
  });

  // Clear the input field
  this.userQuery = '';

  // Scroll to the bottom of the chat
  setTimeout(() => this.scrollToBottom(), 100);
}

getAnswerForQuery(query: string): string {
  // Simulate answer from a database (replace with actual backend call)
  return 'This is a mock answer for your query: ' + query;
}

getRelatedDocuments(query: string): string[] {
  // Simulating related documents (replace this with actual backend logic)
  return [
    'assets/document1.pdf',
    'assets/document2.pdf',
    'assets/document3.pdf',
    'assets/document4.pdf',
    'assets/document4.pdf'
,    'assets/document4.pdf'
,    'assets/document4.pdf'

  ]; // Can have up to 4 documents
}
scrollToBottom() {
  this.chatScroll.nativeElement.scrollTop = this.chatScroll.nativeElement.scrollHeight;
}

scrollLeft() {
  this.cardContainer.nativeElement.scrollBy({
    left: -200, // Adjust the scroll amount as needed
    behavior: 'smooth'
  });
}

scrollRight() {
  this.cardContainer.nativeElement.scrollBy({
    left: 200, // Adjust the scroll amount as needed
    behavior: 'smooth'
  });
}
  }





