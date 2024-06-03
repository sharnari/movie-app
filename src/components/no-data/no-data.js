import React from 'react';
import { Empty } from 'antd';
import './no-data.css'

const DataEmpty = () => (
  <div className='atCenter'>
    <Empty
      image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
      imageStyle={{
        height: 120,
      }}
      description={
        <span>
          Nothing was found for your query.
        </span>
      }
    >
    </Empty>
  </div>
);
export default DataEmpty;