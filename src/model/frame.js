export const State = {
  UNDECIDED: 'undecided',
  REJECTED: 'rejected',
  ADDED: 'added'
};

export class Frame {
  src;
  width = 2592;
  height = 1944;
  reference;
  points;
  refPoints;
  state = State.UNDECIDED;

  constructor(src, ref) {
    this.src = src;
    this.reference = ref;
    this.points = new Set();
    this.refPoints = new Set();
  }
}
