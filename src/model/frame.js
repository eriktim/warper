import {LogManager} from 'aurelia-framework';
import {EXIF} from 'exif-js';
import {Collection, Entity, Id, OneToOne, PostLoad, Property, Temporal}
    from 'persistence';

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
  @Id
  @Property('_id')
  id;

  src = undefined;
  @Temporal created;
  width = undefined;
  height = undefined;
  @OneToOne('self') reference;
  @Collection(Point) points;
  @Collection(Point) refPoints;
  enabled = undefined;

  @PostLoad
  extractExifData() {
    let promise;
    if (this.src && (!this.width || !this.height || !this.created)) {
      promise = new Promise(resolve => {
        logger.info('extracting exif data');
        let frame = this;
        let image = new Image();
        image.onload = function() {
          EXIF.getData(image, function() {
            storeExifData(frame, this);
            logger.info(`found exif data: ` +
                `${frame.width}x${frame.height}, ${frame.created}`);
            image = null;
            resolve();
          });
        };
        image.src = this.src;
      });
    }
    return promise;
  }
}
