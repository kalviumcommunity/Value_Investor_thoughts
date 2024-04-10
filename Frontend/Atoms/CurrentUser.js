import { atom } from 'recoil';

const userAtom = atom({
  key: 'userAtom',
  default: localStorage.getItem('CurrentUser'),
});

export default userAtom;
