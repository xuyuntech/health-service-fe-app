import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { SearchBar, List, Toast } from 'antd-mobile';
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
  render() {
    const items = store.hospitals.map(item => (
      <Item key={item.Key} arrow="horizontal" multipleLine onClick={() => this.context.router.history.push(`/hospital/${item.Key}/chooseDoctor`)}>
        {item.Record.name}
        <Brief>预约量{Number.prototype.toFixed.call(Math.random() * 10, 1)}万</Brief>
      </Item>));

    return (
      <div>
        <div className="header-img" />
        <div>
          <SearchBar placeholder="搜索医院" maxLength={8} />
          <List className="my-list">
            {items}
          </List>
        </div>
      </div>
    );
  }
}
