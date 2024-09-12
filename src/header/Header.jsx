import React, { Component } from 'react';
import { Tabs } from 'antd';
import './Header.css';

class HeaderTabs extends Component {
  render() {
    const { searchContent, ratedContent } = this.props;
    const items = [
      {
        key: '1',
        label: 'Search',
        children: searchContent,
      },
      {
        key: '2',
        label: 'Rated',
        children: ratedContent,
      },
    ];

    return <Tabs className="tabs" defaultActiveKey="1" items={items} />;
  }
}

export default HeaderTabs;
