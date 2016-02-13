import {bindable, computedFrom} from 'aurelia-framework';

export class WrFrame {
  @bindable frame;
  @bindable reference;
  activeFrame;

  @computedFrom('activeFrame')
  get source() {
    return this.activeFrame && this.activeFrame.src;
  }

  toggle() {
    if (!this.activeFrame || this.activeFrame != this.frame) {
      this.activeFrame = this.frame;
    } else {
      this.activeFrame = this.reference;
    }
  }

  frameChanged() {
    this.activeFrame = this.frame;
  }
}
