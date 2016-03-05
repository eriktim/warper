import {bindable, computedFrom} from 'aurelia-framework';
import {Frame} from '../model/frame';
import {Point} from '../model/point';

const FILES = ['IMG_4843.JPG', 'IMG_4940.JPG', 'IMG_5005.JPG', 'IMG_5091.JPG', 'IMG_5138.JPG', 'IMG_5223.JPG', 'IMG_5254.JPG', 'IMG_5296.JPG', 'IMG_5372.JPG', 'IMG_4888.JPG', 'IMG_4971.JPG', 'IMG_5075.JPG', 'IMG_5107.JPG', 'IMG_5144.JPG', 'IMG_5239.JPG', 'IMG_5258.JPG', 'IMG_5314.JPG', 'IMG_5381.JPG', 'IMG_4931.JPG', 'IMG_4998.JPG', 'IMG_5085.JPG', 'IMG_5121.JPG', 'IMG_5213.JPG', 'IMG_5247.JPG', 'IMG_5265.JPG', 'IMG_5318.JPG'];
const HOST = 'http://localhost/warper/L';

export class Editor {
  sequence = [];
  frame;
  reference;
  @bindable dirty;
  selectInternal;
  setReferenceInternal;

  constructor() {
    this.dirtyInternal = this.dirty.bind(this);
    this.selectInternal = this.select.bind(this);
    this.setReferenceInternal = this.setReference.bind(this);

    let persistentData = localStorage.getItem('sequence');
    if (persistentData) {
      let sequenceObjects = JSON.parse(persistentData);
      for (let sequenceObject of sequenceObjects) {
        let frame = new Frame();
        for (let propertyName in sequenceObject) {
          if (!['reference', 'points', 'refPoints'].includes(propertyName)) {
            frame[propertyName] = sequenceObject[propertyName];
          }
        }
        let refSrc = sequenceObject.reference ? sequenceObject.reference.src : undefined; // TODO id after run
        if (refSrc) {
          let ref = this.sequence.find(f => f.src === refSrc);
          if (ref) frame.reference = ref;
        }
        frame.points = new Set();
        frame.refPoints = new Set();
        for (let point of sequenceObject.points) {
          frame.points.add(new Point(point.x, point.y));
        }
        for (let point of sequenceObject.refPoints) {
          frame.refPoints.add(new Point(point.x, point.y));
        }
        this.sequence.push(frame);
      }
    } else {
      this.sequence = FILES.sort().map(file => new Frame(`${HOST}/${file}`));
      let reference = this.sequence[0];
      this.sequence.slice(1).forEach(frame => frame.reference = reference);
    }
    this.select(this.sequence[1]);
  }

  @computedFrom('frame')
  get indexCurrent() {
    return this.sequence.indexOf(this.frame);
  }

  @computedFrom('reference')
  get indexReference() {
    return this.sequence.indexOf(this.reference);
  }

  dirty() {
    let persistentData = JSON.stringify(this.sequence);
    localStorage.setItem('sequence', persistentData);
    console.log('saved on ' + new Date());
  }

  select(frame) {
    this.frame = frame;
    this.reference = frame.reference;
  }

  setReference(reference) {
    if (this.frame) {
      this.frame.reference = reference;
      this.reference = reference;
      this.dirty();
    }
  }
}
