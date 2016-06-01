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

  constructor(entityManager, authenticationService) {
    this.logger = LogManager.getLogger('Editor');
    this.dirtyInternal = this.dirty.bind(this);
    this.selectInternal = this.select.bind(this);
    this.setReferenceInternal = this.setReference.bind(this);

    entityManager.setInterceptor(authenticationService.interceptor);

setTimeout(() => {
    entityManager.find(Frame)
      .then(frames => {
        console.log('fire frames', frames);
        // TODO sort by created, also async
        this.sequence = frames;
        if (this.sequence.length > 1) {
          this.select(this.sequence[1]);
        }
      });
}, 3000);
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
    this.logger.debug('saved on ' + new Date());
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
