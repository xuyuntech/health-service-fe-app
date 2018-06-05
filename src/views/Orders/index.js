import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { WhiteSpace, List, Toast, Modal } from 'antd-mobile';
import moment from 'moment';
import './index.less';
import store from './store';
import { API, RegisterState } from '../../const';
import bFetch from '../../bfetch';
import appStore from '../../store';

const { Item } = List;
const { Brief } = Item;
const { user } = appStore;
const { alert } = Modal;

@observer
export default class extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }
  async componentDidMount() {
    try {
      const res = await bFetch(API.Query('RegisterHistory'));
      const registers = JSON.parse(res.data);
      const data = await Promise.all(registers.map(async (item) => {
        const { arrangementKey, userKey, state } = item.Record;
        if (userKey !== user.key) {
          return null;
        }
        const arrangementRes = await bFetch(API.Find(arrangementKey));
        const arrangement = JSON.parse(arrangementRes.data);
        const { doctorKey, hospitalKey, visitUnix } = arrangement;
        const doctorRes = await bFetch(API.Find(doctorKey));
        const doctor = JSON.parse(doctorRes.data);
        const hospitalRes = await bFetch(API.Find(hospitalKey));
        const hospital = JSON.parse(hospitalRes.data);
        return {
          state,
          key: item.Key,
          userKey,
          doctorKey,
          doctorName: doctor.name,
          hospitalKey,
          hospitalName: hospital.name,
          visitUnix,
        };
      }));
      store.registers = data.filter(item => item !== null);
    } catch (err) {
      alert('Error', `加载医院数据错误: ${err}`);
    }
  }
  render() {
    const items = store.registers.map((item) => {
      const {
        key, visitUnix, doctorName, hospitalName, state,
      } = item;
      return (
        <Item key={key} extra={RegisterState[state]}>
          {hospitalName}
          <Brief>就诊时间: {moment(new Date(visitUnix * 1000)).format('YYYY-MM-DD hh:mm:ss')}</Brief>
          <Brief>医师: {doctorName}</Brief>
        </Item>
      );
    });
    return (
      <div>
        <div>
          <WhiteSpace />
          <List className="my-list">
            {items}
          </List>
        </div>
      </div>
    );
  }
}
