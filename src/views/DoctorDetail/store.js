import { observable } from 'mobx';


class Store {
  @observable doctor = null;
  @observable hospital = null;
  @observable arrangements = [];
  @observable selectedDate = new Date();
  @observable loading = false;
}

export default new Store();
