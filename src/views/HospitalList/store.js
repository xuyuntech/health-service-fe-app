import { observable } from 'mobx';


class Store {
  @observable hospitals = [];
}

export default new Store();
