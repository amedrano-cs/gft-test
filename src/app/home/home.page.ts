import { AuthService } from '../services/auth.service';
import { Component } from '@angular/core';
import { LabelService } from '../services/label.service';
import { Router } from '@angular/router';
import { TOAST } from '../config/toast';
import { ToastController } from '@ionic/angular';

const DANGER = 'danger';
const DEFAULT_SELECTION = 'login';
const SUCCESS = 'success';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  auth: string;
  email: string;
  errors: any;
  firstName: string;
  labels: any;
  lastName: string;
  messages: any;
  password: string;

  constructor(
    public toastController: ToastController,
    private authService: AuthService,
    private labelService: LabelService,
    private router: Router
  ) {
    this.isUserLoggedIn();
    this.auth = DEFAULT_SELECTION;
    this.errors = this.labelService.getErrors();
    this.labels = this.labelService.getLabels();
    this.messages = this.labelService.getMessages();
  }

  /**
   * @description: Sends registration data to api through auth service and handles response
   */
  register(): void {
    const registrationData = {
      email: this.email,
      firstname: this.firstName,
      lastname: this.lastName,
      password: this.password
    };

    this.authService.register(registrationData).subscribe(
      (registrationResponse) => {
        this.toastMessage(this.messages.registration.success, SUCCESS);
        this.auth = DEFAULT_SELECTION;
      },
      (error) => {
        if (error.status === 0) {
          this.toastMessage(this.errors.general.offline, DANGER);
        } else {
          this.toastMessage(this.errors.registration.genericError, DANGER);
        }
      }
    );
  }

  /**
   * @description: Sends login data to api through auth service and handles response
   */
  login(): void {
    const loginData = {
      email: this.email,
      password: this.password
    };

    this.authService.login(loginData).subscribe(
      (loginResponse) => {
        this.authService.setToken(loginResponse.token);
        this.router.navigate(['account', {}]);
      },
      (error) => {
        if (error.status === 0) {
          this.toastMessage(this.errors.general.offline, DANGER);
        } else if (error.status === 404) {
          this.toastMessage(this.errors.login.userNotFound, DANGER);
        } else {
          this.toastMessage(this.errors.login.genericError, DANGER);
        }
      }
    );
  }

  /**
   * @description Ionic default toast implementation to send feedback messages to user
   * @param toastMessage Message text to display
   * @param toastDuration Toast duration in miliseconds
   * @param toastColor Toast background color
   */
  async toastMessage(toastMessage: string, toastColor: string = TOAST.defaultColor, toastDuration: number = TOAST.duration) {
    const toast = await this.toastController.create({
      message: toastMessage,
      duration: toastDuration,
      translucent: false,
      color: toastColor,
      position: 'top'
    });
    toast.present();
  }

  /**
   * @description Validate if user has a valid token and navigate to accounts list page,
   * otherwise continues to display login/registration view
   */
  private isUserLoggedIn(): void {
    this.authService.isUserLoggedIn().then(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['account', {}]);
      }
    });
  }

}
