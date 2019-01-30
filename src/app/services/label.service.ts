import { Injectable } from '@angular/core';
import { ERRORS, LABELS, MESSAGES } from '../shared/labels';

@Injectable({
  providedIn: 'root'
})
export class LabelService {

  constructor() { }

  /**
   * @description Returns error messages
   * @returns ERRORS
   */
  getErrors() {
    return ERRORS;
  }

  /**
   * @description Returns labels to use inside the app easily
   * @returns LABELS
   */
  getLabels() {
    return LABELS;
  }

  /**
   * @description Returns info messages to use inside the app easily
   * @returns MESSAGES
   */
  getMessages() {
    return MESSAGES;
  }
}
