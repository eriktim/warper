import {bindable, computedFrom} from 'aurelia-framework';

export class WrThumb {
  @bindable frame;
  @bindable detail;

  @computedFrom('frame')
  get source() {
    return this.frame && this.frame.src;
  }
}
