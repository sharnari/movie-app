import React from 'react'
import { Input } from 'antd'

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
