import {computedFrom, inject, LogManager} from 'aurelia-framework';
import {AuthenticationService} from 'aurelia-firebase';
import {EntityManager} from 'persistence';

import {Frame} from '../model/frame';

@inject(EntityManager, AuthenticationService)
export class Editor {
  sequence = [];
  frame;
  reference;
  logger;
  selectInternal;
  setReferenceInternal;
  indexCurrent;
  indexReference;

  constructor(entityManager, authenticationService) {
    this.logger = LogManager.getLogger('Editor');
    this.dirtyInternal = this.dirty.bind(this);
    this.selectInternal = this.select.bind(this);
    this.setReferenceInternal = this.setReference.bind(this);

    entityManager.setInterceptor(authenticationService.interceptor);

    let interval;
    interval = setInterval(() => {
      if (!authenticationService.isLoggedIn()) {
        return;
      }
      clearInterval(interval);
      entityManager.query(Frame)
        .then(frames => {
          console.log('fire frames', frames);
          // TODO sort by created, also async
          this.sequence = frames;
          if (this.sequence.length > 1) {
            this.select(this.sequence[1]);
          }
        });
    }, 500);
  }

  dirty() {
    // TODO save to firebase
    let persistentData = JSON.stringify(this.sequence);
    localStorage.setItem('sequence', persistentData);
    this.logger.debug('saved on ' + new Date());
  }

  select(frame) {
    this.frame = frame;
    this.indexCurrent = this.sequence.indexOf(this.frame);
    this.reference = null;
    frame.reference.then(ref => {
      this.reference = ref;
      this.sequence.indexOf(ref);
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
