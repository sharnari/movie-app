import { Rate } from 'antd'

const RateMovie = ({ setRated, rate }) => (
  <Rate allowHalf count={10} size="large" onChange={setRated} defaultValue={rate} />
)

export default RateMovie
