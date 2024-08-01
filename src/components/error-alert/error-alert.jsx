import { useEffect } from 'react'
import { Alert } from 'antd'
import PropTypes from 'prop-types'

import './error-alert.css'

const ErrorAlert = ({ errorMessage, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="alert-message">
      <Alert message={errorMessage} type="error" closable />
    </div>
  )
}

ErrorAlert.propTypes = {
  errorMessage: PropTypes.string,
  onClose: PropTypes.func,
}

export default ErrorAlert
