import React from 'react'
import { Tabs } from 'antd'

import './menu.css'

const Selector = () => (
  <Tabs
    className="menu-size"
    defaultActiveKey="1"
    size="large"
    items={[
      {
        label: 'Search',
        key: '1',
      },
      {
        label: 'Rated',
        key: '2',
      },
    ]}
  />
)
export default Selector
