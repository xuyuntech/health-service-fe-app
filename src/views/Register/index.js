import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { ActivityIndicator, WingBlank, List, WhiteSpace, Button, Modal, Toast } from 'antd-mobile';
import moment from 'moment';
import './index.less';
import store from './store';
import appStore from '../../store';
import { API } from '../../const';
import bFetch from '../../bfetch';

const { Item } = List;
const { Brief } = Item;
const { alert } = Modal;

@observer
export default class extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }
  async componentDidMount() {
    const { doctorKey, arrangementKey, hospitalKey } = this.context.router.route.match.params;
    try {
      const res1 = await bFetch(API.Query('Doctor'));
      const res2 = await bFetch(API.Query('ArrangementHistory'));
      const res3 = await bFetch(API.Query('Hospital'));
      store.doctors = JSON.parse(res1.data);
      store.arrangements = JSON.parse(res2.data);
      store.hospitals = JSON.parse(res3.data);

      store.doctor = store.getDoctor(doctorKey);
      store.arrangementHistory = store.getArrangement(arrangementKey);
      store.hospital = store.getHospital(hospitalKey);
    } catch (err) {
      console.error(err);
      Toast.fail(`获取信息失败: ${err}`);
    }
  }
  next = () => {
    const { doctor, hospital, arrangementHistory } = store;
    alert(
      '核对挂号信息',
      <div>
        <div>就诊人: {appStore.user.name}</div>
        <div>就诊时间: {moment(arrangementHistory.visitUnix * 1000).format('YYYY-MM-DD')}</div>
        <div>医院: {hospital.name}</div>
        <div>医师: {doctor.name}</div>
      </div>,
      [
        { text: '取消', onPress: () => console.log('cancel') },
        { text: '确定', onPress: () => setTimeout(this.createRegister, 300) },
      ],
    );
  };
  createRegister = async () => {
    const { arrangementKey } = this.context.router.route.match.params;
    store.loading = true;
    try {
      await bFetch(API.RegisterHistory.Create(arrangementKey, appStore.user.key));
      Toast.success('挂号成功');
      setTimeout(() => {
        this.context.router.history.push('/');
      }, 300);
    } catch (err) {
      Toast.fail(`生成挂号单失败: ${err}`);
    }
    store.loading = false;
  };
  render() {
    console.log('store', store);
    const { name, title } = store.doctor;
    const { visitUnix } = store.arrangementHistory;
    return (
      <div>
        <div>
          <WhiteSpace size="lg" />
          <List className="my-list">
            <Item
              thumb={<img alt="doctorKey" src="http://via.placeholder.com/100x100" style={{ width: 50, height: 50 }} />}
              multipleLine
              onClick={() => {}}
            >
              {name} <Brief>{title}</Brief>
            </Item>
            <Item>
              <Brief>就诊门店: {store.hospital.name}</Brief>
              <Brief>就诊时间: {moment(new Date(visitUnix * 1000)).format('YYYY-MM-DD')}</Brief>
              <Brief>挂号费用: ¥80.00</Brief>
            </Item>
          </List>
          <WhiteSpace size="lg" />
          <List className="my-list">
            <Item
              arrow="horizontal"
              multipleLine
              onClick={() => {}}
              extra="就诊人"
            >
            就诊人
            </Item>
            <Item
              arrow="horizontal"
              multipleLine
              onClick={() => {}}
              extra="请选择"
            >
            初/复诊
            </Item>
            <Item
              arrow="horizontal"
              multipleLine
              onClick={() => {}}
              extra="请填写"
            >
            疾病信息
            </Item>
          </List>
          <WhiteSpace size="lg" />
          <WingBlank><Button style={{ display: 'block' }} type="primary" onClick={this.next} >下一步</Button></WingBlank>
          <ActivityIndicator toast text="正在加载" animating={store.loading} />
          <WhiteSpace size="lg" />
        </div>
      </div>
    );
  }
}
