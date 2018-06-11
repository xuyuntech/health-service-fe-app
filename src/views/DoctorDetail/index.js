import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Accordion, List, WhiteSpace, Button, Toast, DatePicker, ActivityIndicator } from 'antd-mobile';
import moment from 'moment';
import './index.less';
import store from './store';
import { API } from '../../const';
import bFetch from '../../bfetch';

const { Item } = List;
const { Brief } = Item;

@observer
export default class extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }
  async componentDidMount() {
    const { hospitalKey, doctorKey } = this.context.router.route.match.params;
    try {
      const res1 = await bFetch(API.Find(doctorKey));
      const res2 = await bFetch(API.Find(hospitalKey));
      // const res3 = await bFetch(API.Query('ArrangementHistory'));
      // const res3 = await bFetch(API.Query({
      //   selector: {
      //     docType: { $eq: 'ArrangementHistory' },
      //     doctorKey: { $eq: doctorKey },
      //     visitDate: { $eq: moment(store.selectedDate).format('YYYY-MM-DD') },
      //   },
      // }));
      store.doctor = JSON.parse(res1.data);
      store.hospital = JSON.parse(res2.data);
      // store.arrangements = JSON.parse(res3.data);
      await this.load();
    } catch (err) {
      Toast.fail(`获取医师失败:${err}`);
    }
  }
  async load() {
    store.loading = true;
    const { hospitalKey, doctorKey } = this.context.router.route.match.params;
    try {
      store.arrangements = [];
      const res3 = await bFetch(API.Query({
        selector: {
          docType: { $eq: 'ArrangementHistory' },
          doctorKey: { $eq: doctorKey },
          hospitalKey: { $eq: hospitalKey },
          visitDate: { $eq: moment(store.selectedDate).format('YYYY-MM-DD') },
        },
      }));
      store.arrangements = JSON.parse(res3.data);
    } catch (err) {
      Toast.fail(`获取医师失败:${err}`);
    }
    store.loading = false;
  }
  getDatePicker() {
    return (
      <List>
        <DatePicker
          mode="date"
          title="Select Date"
          extra="Optional"
          value={store.selectedDate}
          onChange={(date) => {
            store.selectedDate = date;
            setTimeout(() => { this.load(); }, 300);
          }}
        >
          <List.Item arrow="horizontal">选择日期</List.Item>
        </DatePicker>
      </List>
    );
  }
  getDoctorPanel() {
    const { doctor = {} } = store;
    if (!doctor) {
      return null;
    }
    return (
      <List className="my-list">
        <Item
          thumb={<img alt="doctorKey" src={doctor.avatar} style={{ width: 50, height: 50 }} />}
          multipleLine
          onClick={() => {}}
        >
          {doctor.name} <Brief>{doctor.title}</Brief>
        </Item>
      </List>
    );
  }
  getArrangements() {
    const { arrangements } = store;
    const hos = {};
    for (let i = 0; i < arrangements.length; i += 1) {
      const item = arrangements[i];
      const { Key, Record } = item;
      if (!hos[Record.hospitalKey]) {
        hos[Record.hospitalKey] = [];
      }
      hos[Record.hospitalKey].push({ key: Key, ...Record });
    }
    if (Object.keys(hos).length === 0) {
      return <p style={{ textAlign: 'center' }}>暂无排班记录</p>;
    }
    return (
      <Accordion activeKey={Object.keys(hos)} className="my-accordion" onChange={this.onChange}>
        {
        Object.keys(hos).map((hospitalKey) => {
          const arr = hos[hospitalKey];
          return (
            <Accordion.Panel header={(hospitalKey || '').split('-')[1]} key={hospitalKey}>
              <List className="my-list">
                {arr.map((item) => {
                  const { visitUnix } = item;
                  return (
                    <List.Item key={item.key} extra={<Button type="ghost" size="small" onClick={() => this.register(item.key)}>预约</Button>}>
                      <Brief>{moment(new Date(visitUnix * 1000)).format('YYYY-MM-DD')} 上午</Brief>
                      <Brief>¥80.00 元</Brief>
                    </List.Item>
                  );
                })}
              </List>
            </Accordion.Panel>
          );
        })
      }
      </Accordion>
    );
  }
  register = (arrangementKey) => {
    const { hospitalKey, doctorKey } = this.context.router.route.match.params;
    this.context.router.history.push(`/hospital/${hospitalKey}/chooseDoctor/${doctorKey}/register/${arrangementKey}`);
  };
  render() {
    return (
      <div>
        <div>
          <WhiteSpace size="lg" />
          {this.getDoctorPanel()}
          <WhiteSpace size="lg" />
          <List className="my-list">
            <Item
              multipleLine
              onClick={() => {}}
            >
            排班信息
            </Item>
            <Item
              multipleLine
              onClick={() => {}}
            >
              <Brief>排班信息排班信息排班信息排班信息</Brief>
            </Item>
          </List>
          <WhiteSpace size="lg" />
          {this.getDatePicker()}
          {this.getArrangements()}

          <WhiteSpace size="lg" />
          <ActivityIndicator animating={store.loading} toast text="正在加载" />
        </div>
      </div>
    );
  }
}
