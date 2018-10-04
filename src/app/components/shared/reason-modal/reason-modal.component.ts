import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-reason-modal',
  templateUrl: './reason-modal.component.html',
  styleUrls: ['./reason-modal.component.css']
})
export class ReasonModalComponent implements OnInit {
  @Input() modalDisplay: string;
  @Input() modalObj: any;
  @Output() clickEvent = new EventEmitter();
  reasonText: string = '';

  constructor() { }

  ngOnInit() {
  }

  modalClose(save: boolean) {
      if (save) {
          this.clickEvent.emit(this.reasonText);
      }
      
      this.modalDisplay = 'none';
  }
}
