import 'jquery';
import 'jquery-zoom';
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
    this.enableZoom();
  }

  enableZoom() {
    $('.wr-frame img')
      .wrap('<span style="display:inline-block"></span>')
      .css('display', 'block')
      .parent()
      .zoom({
        magnify: 2,
        on: 'click'
      });
    }

  toggle() {
    if (!this.activeFrame || this.activeFrame != this.frame) {
      this.activeFrame = this.frame;
    } else {
      this.activeFrame = this.reference;
    }
    this.enableZoom();
  }

  frameChanged() {
    this.reference = this.frame.reference;
    this.activeFrame = null;
    this.toggle();
  }
}
