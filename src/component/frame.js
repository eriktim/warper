import {bindable, computedFrom} from 'aurelia-framework';
import math from 'mathjs';

import {Point} from '../model/point';

const ZOOM_FACTOR = 2;
const THREE = 3;

function clamp(x, a, b) {
  if (x < a) {
    x = a;
  } else if (x > b) {
    x = b;
  }
  return x;
}

export class WrFrame {
  @bindable frame;
  @bindable dirty;
  reference;
  fixedReference = false;
  preview = false;
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
    let viewBox = '0 0 0 0';
    if (this.focus) {
      let rect = this.svg.getBoundingClientRect();
      if (rect && rect.width && rect.height) {
        viewBox = `${this.focus.x - (ZOOM_FACTOR - 1) * rect.width / ZOOM_FACTOR / 2} ` +
                  `${this.focus.y - (ZOOM_FACTOR - 1) * rect.height / ZOOM_FACTOR / 2} ` +
                  `${rect.width / ZOOM_FACTOR} ` +
                  `${rect.height / ZOOM_FACTOR}`;
      }
    } else if (this.activeFrame) {
      viewBox = `0 0 ${this.activeFrame.width} ${this.activeFrame.height}`;
    }
    return viewBox;
  }

  bind(bindingContext) {
    this.bindingContext = bindingContext;
  }

  attached() {
    this.frameChanged();
  }

  click(event) {
    if (this.activePoints.size >= 3) {
      return;
    }
    let offsetX = event.offsetX;
    let offsetY = event.offsetY;
    let rect = this.svg.getBoundingClientRect();

    if (!this.focus) {
      let x = (offsetX / rect.width) * this.activeFrame.width;
      let y = (offsetY / rect.height) * this.activeFrame.height;
      let dx = rect.width / 2 / ZOOM_FACTOR;
      let dy = rect.height / 2 / ZOOM_FACTOR;
      this.focus = {
        x: clamp(x, dx, this.activeFrame.width - dx),
        y: clamp(y, dy, this.activeFrame.height - dy),
      };
    } else {
      let sx = this.focus.x + (offsetX - rect.width / 2) / ZOOM_FACTOR;
      let sy = this.focus.y + (offsetY - rect.height / 2) / ZOOM_FACTOR;
      let point = this.activePoints.newItem();
      point.x = sx;
      point.y = sy;
      this.updatePointsOrder();
      this.focus = null;
      this.triggerDirty();
    }
  }

  remove(point) {
    this.activePoints.delete(point);
    this.triggerDirty();
  }

  showTab(type) {
    switch (type) {
    case 'frame':
      this.activeFrame = this.frame;
      this.activePoints = this.frame.points;
      this.preview = false;
      break;
    case 'reference':
      this.activeFrame = this.reference;
      this.activePoints = this.frame.refPoints;
      this.preview = false;
      break;
    case 'preview':
      this.activeFrame = this.frame;
      this.activePoints = null;
      this.preview = true;
      break;
    }
    this.updatePreview();
  }

  frameChanged() {
    this.reference = null;
    if (this.frame) {
      this.frame.reference.then(ref => this.reference = ref);
    }
    this.activeFrame = null;
    this.fixedReference = this.bindingContext.sequence.indexOf(this.frame) <= 1;
    this.showTab('frame');
  }

  updatePreview() {
    let noPreview = !this.preview ||
        this.frame.points.size < THREE || this.frame.refPoints.size < THREE;
    if (noPreview) {
      this.transform = '';
      return;
    }
    let points = Array.from(this.frame.points);
    let refPoints = Array.from(this.frame.refPoints);
    let X = [
      points.map(p => p.x),
      points.map(p => p.y),
      [1, 1, 1]
    ];
    if (math.chain(X).det().abs().done() < 0.1) {
      // matrix is (near) singular
      return;
    }
    let Xi = math.inv(X);
    let M = math.chain([
      refPoints.map(p => p.x),
      refPoints.map(p => p.y),
    ]).multiply(Xi).transpose().done();
    this.transform = `matrix(${M.reduce((arr, row) => arr.concat(row), []).join(' ')})`;
  }

  updatePointsOrder() {
    if (this.frame.points.size < THREE || this.frame.refPoints.size < THREE) {
      return;
    }
    let u = Array.from(this.frame.points);
    let v = Array.from(this.frame.refPoints);
    let w;
    let min = Infinity;
    for (let a of v) {
      for (let b of v.filter(e => e !== a)) {
        let c = v.find(e => e !== a && e !== b);
        let vc = [a, b, c];
        let d = this.distance(u, vc);
        if (d < min) {
          min = d;
          w = vc;
        }
      }
    }
    this.frame.refPoints.clear();
    for (let wi of w) {
      let p = this.frame.refPoints.newItem();
      p.x = wi.x;
      p.y = wi.y;
    }
  }

  distance(u, v) {
    return u.reduce((d, ui, i) => d + math.distance([ui.x, ui.y], [v[i].x, v[i].y]), 0);
  }

  triggerDirty() {
    this.dirty();
  }

  copyReference() {
    let index = this.bindingContext.sequence.indexOf(this.frame);
    if (index > 1) {
      let ref = this.bindingContext.sequence[index - 1];
      this.frame.refPoints.clear();
      for (let point of ref.refPoints.values()) {
        this.frame.refPoints.add(point);
      }
      this.frame.reference = ref;
    }
  }
}
