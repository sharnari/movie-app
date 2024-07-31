import { Spin } from 'antd'

import './loading-view.css'

const LoadingPageView = () => {
  return (
    <div className="loading-page atCenter--loading">
      <Spin size="large" />
    </div>
  )
}

export default LoadingPageView
