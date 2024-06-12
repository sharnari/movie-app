import { React } from 'react'
import { Pagination } from 'antd'

import './pagination-view.css'

const Leaf = ({ changePage }) => (
  <div className="atCenterX margin-bM">
    <Pagination onChangePage={changePage} defaultCurrent={1} total={50} />
  </div>
)

export default Leaf
