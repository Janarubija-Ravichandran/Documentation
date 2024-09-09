import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MessageService]
})
export class RegisterComponent {
  username = '';
  password = '';
  email = '';

  public apiUrl = environment.LOGIN_BASEURL;

  constructor(private http: HttpClient, private router: Router, private messageService: MessageService) { }

  registerSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Registration Successful',
      detail: 'You have been registered successfully.',
      key: 'tl'
    });
  }

  registerError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Registration Failed',
      detail: 'An error occurred during registration. Please try again.',
      key: 't2'
    });
  }

  register() {
    if (this.username.trim() && this.email.trim() && this.password.trim()) {
      const url = `${this.apiUrl}/register`;
      this.http.post<{ message: string }>(url, {
        username: this.username,
        password: this.password,
        email: this.email
      })
        .subscribe({
          next: (response) => {
            console.log('Registration successful', response.message);
            this.registerSuccess();
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 1000);
          },
          error: (error) => {
            console.error('Registration failed', error);
            this.registerError();
          }
        });
    } else {
      this.registerError();
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
