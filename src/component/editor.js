import {Frame} from '../model/frame';
import {Detail} from '../model/detail';

const FILES = ['IMG_4843.JPG', 'IMG_4940.JPG', 'IMG_5005.JPG', 'IMG_5091.JPG', 'IMG_5138.JPG', 'IMG_5223.JPG', 'IMG_5254.JPG', 'IMG_5296.JPG', 'IMG_5372.JPG', 'IMG_4888.JPG', 'IMG_4971.JPG', 'IMG_5075.JPG', 'IMG_5107.JPG', 'IMG_5144.JPG', 'IMG_5239.JPG', 'IMG_5258.JPG', 'IMG_5314.JPG', 'IMG_5381.JPG', 'IMG_4931.JPG', 'IMG_4998.JPG', 'IMG_5085.JPG', 'IMG_5121.JPG', 'IMG_5213.JPG', 'IMG_5247.JPG', 'IMG_5265.JPG', 'IMG_5318.JPG'];
const HOST = 'http://localhost/warper/L';

export class Editor {
  sequence;
  frame;

  constructor() {
    this.sequence = FILES.sort().map(file => new Frame(`${HOST}/${file}`));
    let reference = this.sequence[0];
    this.sequence.slice(1).forEach(frame => frame.reference = reference);
    this.select(this.sequence[1]);
  }

  select(frame) {
    this.frame = frame;
    this.reference = this.sequence[this.sequence.indexOf(frame) - 1];
  }
}
