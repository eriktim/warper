// TODO own magnifier -> sub-pixel accuracy

import 'jquery';
import 'okfocus/okzoom/src/okzoom.min';
import {bindable, computedFrom} from 'aurelia-framework';
import {Point} from '../model/point';

export class WrFrame {
  @bindable frame;
  reference;
  activeFrame;
  activePoints;

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
    $('.ok-listener').click(event => {
      this.click(event.originalEvent);
    });
  }

  click(event) {
    if (!(this.activePoints.size < 3)) {
      return;
    }
    let offsetX = event.offsetX;
    let offsetY = event.offsetY;
    let img = $('.wr-frame img').get(0);
    let x = (offsetX / img.width) * this.activeFrame.width;
    let y = (offsetY / img.height) * this.activeFrame.height;
    this.activePoints.add(new Point(x, y));
  }

  toggle() {
    if (!this.activeFrame || this.activeFrame != this.frame) {
      this.activeFrame = this.frame;
      this.activePoints = this.frame.points;
    } else {
      this.activeFrame = this.reference;
      this.activePoints = this.frame.refPoints;
    }
  }

  frameChanged() {
    this.reference = this.frame.reference;
    this.activeFrame = null;
    this.toggle();
  }

  left(point) {
    let img = $('.wr-frame img').get(0);
    return (point.x * (img.width / this.activeFrame.width)).toFixed(0);
  }

  top(point) {
    let img = $('.wr-frame img').get(0);
    return (point.y * (img.height / this.activeFrame.height)).toFixed(0);
  }
}
