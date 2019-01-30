import { AccountRequest } from '../models/account-request';
import { AccountService } from '../services/account.service';
import { AuthService } from '../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { LabelService } from '../services/label.service';
import { TOAST } from '../config/toast';
import { ToastController, AlertController } from '@ionic/angular';
import { TypeCardInterface } from '../models/card';

const DANGER = 'danger';
const SECONDARY = 'secondary';
const SUCCESS = 'success';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  accounts: [];
  alertInputOptions: any[];
  cards: TypeCardInterface[];
  errors: any;
  labels: any;
  messages: any;
  title: string;
  userId: string;
  token: string;

  constructor(
    public alertController: AlertController,
    public toastController: ToastController,
    private accountService: AccountService,
    private authService: AuthService,
    private labelService: LabelService
  ) {
    this.alertInputOptions = [];
    this.accounts = [];
    this.errors = this.labelService.getErrors();
    this.labels = this.labelService.getLabels();
    this.messages = this.labelService.getMessages();
  }

  ngOnInit() {
    this.authService.getToken().then(token => {
      this.token = token;
    });
    this.authService.retrieveToken().then(decodedToken => {
      this.title = decodedToken.firstname + ' ' + decodedToken.lastname;
      this.userId = decodedToken.id;
    });
    this.getUserAccounts();
  }

  /**
   *  @description Obtains cards catalog, initializes selector prompt with it and displays alert selector
   */
  newAccount() {
    this.accountService.getCardsCatalog(this.token).subscribe(
      (cards) => {
        this.cards = cards.response ? cards.response.type_cards : null;
        this.alertInputOptionsInit();
        this.displaySelector();
      },
      (error) => {
        if (error.status === 0) {
          this.toastMessage(this.errors.general.offline, DANGER);
        } else {
          this.toastMessage(this.errors.cards.genericError, DANGER);
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
   * @description Initializes alert input prompt dynamically with cards catalog
   */
  private alertInputOptionsInit(): void {
    this.alertInputOptions = [];
    this.cards.forEach((c, i) => {
      this.alertInputOptions.push(
        {
          name: 'radio',
          type: 'radio',
          label: c.name,
          value: c,
          checked: (i === 0) ? true : false
        }
      );
    });
  }

  /**
   * @description Displays selector prompt with initialized alert options
   */
  private async displaySelector() {
    const alert = await this.alertController.create({
      header: this.labels.account.requestAccountLabel,
      inputs: this.alertInputOptions,
      buttons: [
        {
          text: this.labels.account.requestAccountCancelButtonLabel,
          role: 'cancel'
        }, {
          text: this.labels.account.requestAccountButtonLabel,
          handler: (card) => {
            this.requestAccount(card);
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * @description Obtains user's accounts from api
   */
  private getUserAccounts(): void {
    this.accountService.getUserAccounts(this.token).subscribe(
      (accounts) => {
        this.accounts = accounts;
      },
      (error) => {
        if (error.status === 0) {
          this.toastMessage(this.errors.general.offline, DANGER);
        } else if (error.status === 403) {
          this.toastMessage(this.errors.account.forbidden, SECONDARY);
        } else {
          this.toastMessage(this.errors.account.genericError, DANGER);
        }
      }
    );
  }

  /**
   * @description Sends account association request to api
   * @param card Card type interface
   */
  private requestAccount(card: TypeCardInterface) {
    const requestNewAccountData: AccountRequest = {
      userId: this.userId,
      type: card.type,
      name: card.name
    };

    this.accountService.requestNewAccount(requestNewAccountData, this.token).subscribe(
      (res) => {
        this.toastMessage(this.messages.account.accountRequestSuccess, SUCCESS, 5000);
        this.getUserAccounts();
      },
      (error) => {
        if (error.status === 0) {
          this.toastMessage(this.errors.general.offline, DANGER);
        } else {
          this.toastMessage(this.errors.account.requestAccountError, DANGER);
        }
      }
    );
  }
}
