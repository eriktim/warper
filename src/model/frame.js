export class Frame {
  id;
  src;
  width = 2592;
  height = 1944;
  reference;
  points;
  refPoints;
  enabled = true;

  constructor(src, ref) {
    this.id = src ? src.split('/').pop().split('.').shift() : undefined;
    this.src = src;
    this.reference = ref;
    this.points = new Set();
    this.refPoints = new Set();
  }
}
