import {bindable, computedFrom} from 'aurelia-framework';
import {Point} from '../model/point';

const ZOOM_FACTOR = 2;

function clamp(x, a, b) {
  return x < a ? a : x > b ? b : x
}

export class WrFrame {
  @bindable frame;
  reference;
  activeFrame;
  activePoints;
  focus;
  transform;

  @computedFrom('activeFrame')
  get source() {
    return this.activeFrame && this.activeFrame.src;
  }

  @computedFrom('focus', 'activeFrame')
  get viewBox() {
    if (this.focus) {
      let rect = this.svg.getBoundingClientRect();
      return `${this.focus.x - (ZOOM_FACTOR - 1) * rect.width / ZOOM_FACTOR / 2} ` +
             `${this.focus.y - (ZOOM_FACTOR - 1) * rect.height / ZOOM_FACTOR / 2} ` +
             `${rect.width / ZOOM_FACTOR} ` +
             `${rect.height / ZOOM_FACTOR}`;
    }
    return `0 0 ${this.activeFrame.width} ${this.activeFrame.height}`;
  }

  click(event) {
    if (!(this.activePoints.size < 3)) {
      return;
    }
    let offsetX = event.offsetX;
    let offsetY = event.offsetY;
    let rect = this.svg.getBoundingClientRect();

    if (!this.focus) {
      let x = (offsetX / rect.width) * this.activeFrame.width;
      let y = (offsetY / rect.height) * this.activeFrame.height;
      this.focus = {
        x: clamp(x, rect.width / 2, this.activeFrame.width - rect.width / 2),
        y: clamp(y, rect.height / 2, this.activeFrame.height - rect.height / 2),
      };
    } else {
      let sx = this.focus.x + (offsetX - rect.width / 2) / ZOOM_FACTOR;
      let sy = this.focus.y + (offsetY - rect.height / 2) / ZOOM_FACTOR;
      this.activePoints.add(new Point(sx, sy));
      this.focus = null;
    }
  }

  remove(point) {
    this.activePoints.delete(point);
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
    this.zoomed = false;
    this.toggle();
  }
}
