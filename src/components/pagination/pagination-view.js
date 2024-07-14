import { React } from 'react'
import { Pagination } from 'antd'
import PropTypes from 'prop-types'

import './pagination-view.css'
import { Consumer } from '../../provider/provider'

const Leaf = ({ onChange, total_pages /*, currentPage*/ }) => (
  <div className="atCenterX positionB">
    <Consumer>
      {(currentPage) => {
        return <Pagination onChange={onChange} current={currentPage} total={total_pages} showSizeChanger={false} />
      }}
    </Consumer>
  </div>
)

export default Leaf

Leaf.propTypes = {
  onChange: PropTypes.func.isRequired,
  total_pages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
}
