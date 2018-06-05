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
    } catch (err) {
      Toast.fail(`加载医院数据错误: ${err}`);
    }
  }
  openOrder = () => {
    this.context.router.history.push('/mine/orders');
  };
  render() {
    return (
      <div>
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
