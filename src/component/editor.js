import {inject, LogManager} from 'aurelia-framework';
import {EntityManager} from 'persistence';

import {Frame} from '../model/frame';

@inject(EntityManager)
export class Editor {
  entityManager;
  sequence = [];
  frame;
  reference;
  logger;
  selectInternal;
  setReferenceInternal;
  indexCurrent;
  indexReference;

  constructor(entityManager) {
    this.entityManager = entityManager;
    this.logger = LogManager.getLogger('Editor');
    this.dirtyInternal = this.dirty.bind(this);
    this.selectInternal = this.select.bind(this);
    this.setReferenceInternal = this.setReference.bind(this);

    const firebase = this.entityManager.get('firebase');

    if (!firebase.isSignedIn()) {
      firebase.signIn('e.timmers@gmail.com', 'test');
    }

    let interval;
    interval = setInterval(() => {
      if (!firebase.isSignedIn()) {
        return;
      }
      clearInterval(interval);
      this.entityManager.query(Frame)
        .then(frames => {
          return Promise.all(
            frames.slice(1).map(frame => frame.reference
              .then(ref => {
                if (!ref) {
                  frame.reference = frames[0];
                }
              })
            )
          )
          .then(() => {
            this.sequence = frames.sort((a, b) => a.created.diff(b.created));
            if (this.sequence.length > 1) {
              this.select(this.sequence[1]);
            }
          });
        });
    }, 500);
  }

  dirty() {
    return Promise.all(
      this.sequence.map(frame => this.entityManager.persist(frame))
    ).then(() => this.logger.debug('saved on ' + new Date()));
  }

  select(frame) {
    this.frame = frame;
    this.indexCurrent = this.sequence.indexOf(this.frame);
    this.reference = null;
    frame.reference.then(ref => {
      this.reference = ref;
      this.indexReference = this.sequence.indexOf(ref);
    });
  }

  setReference(reference) {
    if (this.frame) {
      this.frame.reference = reference;
      this.reference = reference;
      this.dirty();
    }
  }
}
