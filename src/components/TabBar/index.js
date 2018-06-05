import React from 'react';
import PropTypes from 'prop-types';
import { TabBar } from 'antd-mobile';
import store from './store';

export default class extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }
  onItemPress = (path, selectedTab) => {
    store.selectedTab = selectedTab;
    this.context.router.history.push(path);
  };
  render() {
    const { pathname } = this.context.router.route.location;
    return (
      <TabBar
        noRenderContent
        unselectedTintColor="#949494"
        tintColor="#33A3F4"
        barTintColor="white"
        hidden={store.hidden}
      >
        <TabBar.Item
          title="挂号"
          key="Register"
          icon={
            <div style={{
                  width: '22px',
                  height: '22px',
                  background: 'url(https://gw.alipayobjects.com/zos/rmsportal/BTSsmHkPsQSPTktcXyTV.svg) center center /  21px 21px no-repeat',
                }}
            />
              }
          selectedIcon={
            <div style={{
                  width: '22px',
                  height: '22px',
                  background: 'url(https://gw.alipayobjects.com/zos/rmsportal/ekLecvKBnRazVLXbWOnE.svg) center center /  21px 21px no-repeat',
                }}
            />
              }
          selected={!pathname.startsWith('/mine')}
          // badge={1}
          onPress={() => { this.onItemPress('/', 'RegisterTab'); }}
          data-seed="logId"
        />
        <TabBar.Item
          icon={
            <div style={{
                  width: '22px',
                  height: '22px',
                  background: 'url(https://gw.alipayobjects.com/zos/rmsportal/BTSsmHkPsQSPTktcXyTV.svg) center center /  21px 21px no-repeat',
                }}
            />
              }
          selectedIcon={
            <div style={{
                  width: '22px',
                  height: '22px',
                  background: 'url(https://gw.alipayobjects.com/zos/rmsportal/ekLecvKBnRazVLXbWOnE.svg) center center /  21px 21px no-repeat',
                }}
            />
              }
          title="我的"
          key="mine"
          // badge="new"
          selected={pathname.startsWith('/mine')}
          onPress={() => { this.onItemPress('/mine', 'MineTab'); }}
          data-seed="logId1"
        />
      </TabBar>
    );
  }
}
