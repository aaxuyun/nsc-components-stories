import React from 'react';
import { Spin } from 'antd'

export default ({ loading = true, size }) =>
  loading ? <div style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }}><Spin size={size}/></div> : null;
