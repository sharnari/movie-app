import React from 'react'
import { Input } from 'antd'
import PropTypes from 'prop-types'

import './search.css'

const Search = ({ handleSearchChange, defaultValue }) => {
  return (
    <Input
      onChange={handleSearchChange}
      className="search-idents"
      defaultValue={defaultValue}
      type="search"
      placeholder="Type to search..."
    />
  )
}

export default Search

Search.propTypes = {
  handleSearchChange: PropTypes.func,
  defaultValue: PropTypes.string,
}
