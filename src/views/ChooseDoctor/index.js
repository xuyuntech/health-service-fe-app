import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { SearchBar, List, Toast, Button } from 'antd-mobile';
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
    try {
      const res = await bFetch(API.Query('Doctor'));
      store.doctors = JSON.parse(res.data);
    } catch (err) {
      Toast.fail(`加载医院数据错误: ${err}`);
    }
  }
  register = (doctor) => {
    console.log('>>>>', this.context.router, doctor);
  };
  render() {
    const { hospitalKey } = this.context.router.route.match.params;
    const items = store.doctors.map(item => (
      <Item
        key={item.Key}
        multipleLine
        thumb={<img alt="doctorKey" src={item.Record.avatar} style={{ width: 50, height: 50 }} />}
        onClick={() => this.context.router.history.push(`/hospital/${hospitalKey}/chooseDoctor/${item.Key}`)}
        extra={<Button type="ghost" size="small" onClick={() => { this.register(item); }}>预约</Button>}
      >
        {item.Record.name}
        <Brief>预约量{Number.prototype.toFixed.call(Math.random() * 10, 1)}万</Brief>
        <Brief>{item.Record.description}</Brief>
      </Item>));

    return (
      <div>
        <div>
          <List renderHeader={() => '出诊医师列表'} className="my-list">
            {items}
          </List>
        </div>
      </div>
    );
  }
}
