import React from 'react'
import { Tabs } from 'antd'
import PropTypes from 'prop-types'

import './menu.css'

const Selector = ({ item, onChange }) => (
  <Tabs className="menu-size" onChange={onChange} defaultActiveKey="1" size="large" items={item} />
)
export default Selector

Selector.propTypes = {
  item: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func,
}
