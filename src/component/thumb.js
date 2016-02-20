import {bindable, computedFrom} from 'aurelia-framework';

export class WrThumb {
  @bindable frame;
  @bindable select;

  @computedFrom('frame')
  get source() {
    return this.frame && this.frame.src;
  }

  select(frame) {
    this.select(frame);
  }
}
