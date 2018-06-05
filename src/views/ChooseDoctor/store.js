import { observable } from 'mobx';


class Store {
  @observable doctors = [];
}

export default new Store();
