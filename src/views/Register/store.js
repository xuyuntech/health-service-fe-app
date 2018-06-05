import { observable } from 'mobx';


class Store {
  @observable doctors = [];
  @observable hospitals = [];
  @observable arrangements = [];
  @observable doctor = [];
  @observable hospital = [];
  @observable arrangementHistory = [];
  @observable loading = false;
  getDoctor(key) {
    for (let i = 0; i < this.doctors.length; i += 1) {
      if (this.doctors[i].Key === key) {
        return this.doctors[i].Record;
      }
    }
    return null;
  }
  getArrangement(key) {
    for (let i = 0; i < this.arrangements.length; i += 1) {
      if (this.arrangements[i].Key === key) {
        return this.arrangements[i].Record;
      }
    }
    return null;
  }
  getHospital(key) {
    for (let i = 0; i < this.hospitals.length; i += 1) {
      if (this.hospitals[i].Key === key) {
        return this.hospitals[i].Record;
      }
    }
    return null;
  }
}

export default new Store();
