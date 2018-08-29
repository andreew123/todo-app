import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class ModalService {

  openLogin: EventEmitter<any> = new EventEmitter();
  openSignup: EventEmitter<any> = new EventEmitter();

  constructor() { }

}
