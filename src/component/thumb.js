import {bindable, computedFrom} from 'aurelia-framework';

export class WrThumb {
  @bindable frame;
  @bindable select;
  @bindable setReference;
  @bindable index = -1;
  @bindable indexCurrent = -1;
  @bindable indexReference = -1;

  @computedFrom('frame')
  get source() {
    return this.frame && this.frame.src;
  }

  @computedFrom('indexCurrent', 'indexReference', 'index')
  get stateClass() {
    let classes = [];
    if (this.indexCurrent == this.index) {
      classes.push('is-current');
    }
    if (this.indexReference == this.index) {
      classes.push('is-reference');
    }
    return classes.join(' ');
  }

  @computedFrom('indexCurrent', 'index')
  get isReferenceCandidate() {
    return +this.index < +this.indexCurrent;
  }

  @computedFrom('indexReference', 'index')
  get isReference() {
    return this.index == this.indexReference;
  }

  set isReference(val) {
    // do nothing
  }

  selectInternal(frame) {
    this.select(frame);
  }

  setReferenceInternal(frame) {
    this.setReference(frame);
  }
}
