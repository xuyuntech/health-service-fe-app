import { observable } from 'mobx';


class Store {
  @observable selectedTab = 'RegisterTab';
  @observable hidden = false;
}

export default new Store();
