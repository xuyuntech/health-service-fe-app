import { observable } from 'mobx';


class Store {
  @observable doctor = null;
  @observable hospital = null;
  @observable arrangements = [];
}

export default new Store();
