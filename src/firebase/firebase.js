import Native from 'firebase';

const FIREBASE_URL = 'https://warper.firebaseio.com';

export class Firebase {
  native;

  constructor() {
    this.native = new Native(FIREBASE_URL);
  }
}
