import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { WhiteSpace, List, Toast } from 'antd-mobile';
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
      const res = await bFetch(API.Query('Hospital'));
      store.hospitals = JSON.parse(res.data);
      const res1 = await bFetch(API.Query('User'));
      const data = JSON.parse(res1.data)[0].Record;
      store.user = data;
    } catch (err) {
      Toast.fail(`加载医院数据错误: ${err}`);
    }
  }
  openOrder = () => {
    this.context.router.history.push('/mine/orders');
  };
  render() {
    const { user } = store;
    if (!user) {
      return <div>加载中...</div>;
    }
    return (
      <div>
        <WhiteSpace />
        <List className="my-list">
          <Item
            thumb={<img alt="doctorKey" src="/img/avatar/user-avatar.jpg" style={{ width: 50, height: 50 }} />}
            multipleLine
            onClick={() => {}}
          >
            {user.name} <Brief>共消费: ¥{user.totalSpend}</Brief>
          </Item>
        </List>
        <WhiteSpace />
        <List className="my-list">
          <Item arrow="horizontal" onClick={this.openOrder} >
            我的挂号
          </Item>
        </List>
      </div>
    );
  }
}
