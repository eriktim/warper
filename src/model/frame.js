export const State = {
  UNDECIDED: 'undecided',
  REJECTED: 'rejected',
  ADDED: 'added'
};

export class Frame {
  src;
  width;
  height;
  reference;
  state = State.UNDECIDED;

  constructor(src, ref) {
    this.src = src;
    this.reference = ref;
  }
}
