import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import omit from 'lodash.omit';
import bFetch from '../../bfetch';

const { Option } = Select;
const NOOP = () => {};

const propTypes = {
  url: PropTypes.string,
  method: PropTypes.string,
  data: PropTypes.object,
  params: PropTypes.object,
  onChange: PropTypes.func,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  items: PropTypes.arrayOf(PropTypes.object),
};

export default class extends React.Component {
  static Option = Option;
  static propTypes = propTypes;
  static defaultProps = {
    method: 'get',
    data: {},
    params: {},
    onChange: NOOP,
    onSuccess: NOOP,
    onError: NOOP,
    items: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      items: props.items,
    };
  }
  async componentDidMount() {
    const {
      url, method, data, params, onSuccess, onError,
    } = this.props;
    if (!url) {
      return;
    }
    const options = {
      method,
      data: JSON.stringify(data),
      params,
    };
    try {
      const res = await bFetch(url, options);
      this.setState({
        items: onSuccess(res),
      });
    } catch (err) {
      onError(err);
    }
  }
  render() {
    const { children, ...props } = this.props;
    const { items } = this.state;
    if (!items) {
      return (
        <Select {...omit(props, Object.keys(propTypes))} onChange={this.props.onChange}>
          {children}
        </Select>
      );
    }
    return (
      <Select
        {...omit(props, Object.keys(propTypes))}
        onChange={this.props.onChange}
      >
        {items.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)}
      </Select>
    );
  }
}
