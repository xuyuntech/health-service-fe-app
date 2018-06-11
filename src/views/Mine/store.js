import { observable } from 'mobx';


class Store {
  @observable hospitals = [];
  @observable user = null;
}

export default new Store();
