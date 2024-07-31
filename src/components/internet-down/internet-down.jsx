import { Result } from 'antd'

import './internet-down.css'

const InternetDown = () => (
  <div className="atCenter">
    <Result
      status="error"
      title="Internet is down"
      subTitle="You can always access this site as soon as you are connected to the Internet"
    ></Result>
  </div>
)
export default InternetDown
