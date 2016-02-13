export const State = {
  UNDECIDED: 'undecided',
  REJECTED: 'rejected',
  ADDED: 'added'
};

export class Frame {
  src;
  width;
  height;
  state = State.UNDECIDED;

  constructor(src) {
    this.src = src;
  }
}
