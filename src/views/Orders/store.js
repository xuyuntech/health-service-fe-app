import { observable } from 'mobx';


class Store {
  @observable registers = [];
  @observable arrangements = [];
  getArrangement(key) {
    for (let i = 0; i < this.arrangements.length; i += 1) {
      if (this.arrangements[i].Key === key) {
        return this.arrangements[i].Record;
      }
    }
    return '';
  }
}

export default new Store();
