import { React } from 'react'
import { Pagination } from 'antd'
import PropTypes from 'prop-types'

import './pagination-view.css'

const Leaf = ({ onChange, total_pages, currentPage }) => {
  return (
    <div className="atCenterX positionB">
      <Pagination onChange={onChange} current={currentPage} total={total_pages} showSizeChanger={false} />
    </div>
  )
}

export default Leaf

Leaf.propTypes = {
  onChange: PropTypes.func.isRequired,
  total_pages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
}
