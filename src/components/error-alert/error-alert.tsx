import React from 'react'
import { Alert } from 'antd'

import './error-alert.css'

const ErrorAlert: React.FC = () => <Alert className="alert-message" message="No rated movies" type="error" />

export default ErrorAlert
