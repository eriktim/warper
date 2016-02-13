import 'jquery';
import 'okfocus/okzoom/src/okzoom.min';
import {bindable, computedFrom} from 'aurelia-framework';

export class WrFrame {
  @bindable frame;
  reference;
  activeFrame;

  @computedFrom('activeFrame')
  get source() {
    return this.activeFrame && this.activeFrame.src;
  }

  attached() {
    $('.wr-frame img').okzoom({
      width: 100,
      height: 100,
      scaleWidth: 2 * this.frame.width
    });
  }

  toggle() {
    if (!this.activeFrame || this.activeFrame != this.frame) {
      this.activeFrame = this.frame;
    } else {
      this.activeFrame = this.reference;
    }
  }

  frameChanged() {
    this.reference = this.frame.reference;
    this.activeFrame = null;
    this.toggle();
  }
}
