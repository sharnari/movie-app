import { React } from 'react'
import { Pagination } from 'antd'

import './pagination-view.css'

const Leaf = ({ onChange, total_pages, currentPage }) => (
  <div className="atCenterX margin-bM">
    <Pagination onChange={onChange} current={currentPage} total={total_pages} showSizeChanger={false} />
  </div>
)

export default Leaf
