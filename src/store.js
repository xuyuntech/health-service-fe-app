import { observable } from 'mobx';


class Store {
  @observable user = [];
}

export default new Store();
