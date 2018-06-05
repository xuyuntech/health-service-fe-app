import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Toast } from 'antd-mobile';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import LoadingComp from './components/Loadable';
import TabBar from './components/TabBar';
import bFetch from './bfetch';
import { API } from './const';
import store from './store';
import './App.css';


const load = asyncImport => Loadable({
  loader: asyncImport,
  loading: LoadingComp,
});

export const HospitalListView = load(() => import('./views/HospitalList'));
export const RegisterView = load(() => import('./views/Register'));
export const ChooseDoctorView = load(() => import('./views/ChooseDoctor'));
export const MineView = load(() => import('./views/Mine'));
export const OrdersView = load(() => import('./views/Orders'));
export const DoctorDetailView = load(() => import('./views/DoctorDetail'));

@observer
class App extends Component {
  async componentDidMount() {
    try {
      const res = await bFetch(API.Query('User'));
      const data = JSON.parse(res.data)[0];
      store.user = {
        key: data.Key,
        ...data.Record,
      }; //eslint-disable-line
    } catch (err) {
      Toast.fail(`获取用户失败:${err}`);
    }
  }
  render() {
    return (
      <Router>
        <div>
          <div style={{ paddingBottom: 50 }}>
            <Route exact path="/" component={HospitalListView} />
            <Route exact path="/mine" component={MineView} />
            <Route exact path="/mine/orders" component={OrdersView} />
            <Route exact path="/hospital/:hospitalKey/chooseDoctor" component={ChooseDoctorView} />
            <Route exact path="/hospital/:hospitalKey/chooseDoctor/:doctorKey" component={DoctorDetailView} />
            <Route exact path="/hospital/:hospitalKey/chooseDoctor/:doctorKey/register/:arrangementKey" component={RegisterView} />
          </div>
          <div style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1,
            }}
          >
            <TabBar />
          </div>
        </div>
      </Router>

    );
  }
}

export default App;
