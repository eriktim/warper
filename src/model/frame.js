import {LogManager} from 'aurelia-framework';
import {EXIF} from 'exif-js';
import {Collection, Entity, Id, OneToOne, PostLoad} from 'persistence';

import {Point} from './point';

const logger = LogManager.getLogger('Frame');

function storeExifData(frame, data) {
  frame.width = EXIF.getTag(data, 'PixelXDimension');
  frame.height = EXIF.getTag(data, 'PixelYDimension');
  frame.created = EXIF.getTag(data, 'DateTime')
      .replace(/([0-9]{4}):([0-9]{2}):([0-9]{2})/, '$1-$2-$3');
}

@Entity
export class Frame {
  @Id id;
  src = undefined;
  created = undefined;
  width = undefined;
  height = undefined;
  @OneToOne(this) reference;
  @Collection(Point) points;
  @Collection(Point) refPoints;
  enabled = undefined;

  @PostLoad
  extractExifData() {
    if (!this.src) {
      return;
    }
    if (!this.width || !this.height || !this.created) {
      logger.info('extracting exif data');
      let frame = this;
      let image = new Image();
      image.onload = function() {
        EXIF.getData(image, function() {
          storeExifData(frame, this);
          logger.info(`found exif data: ${frame.width}x${frame.height}, ${frame.created}`);
          image = null;
        });
      };
      image.src = this.src;
    }
  }
}
