import React from 'react'
import { Input } from 'antd'

import './search.css'

const Search = ({ handleSearchChange }) => {
  return <Input onChange={handleSearchChange} className="search-idents" type="search" placeholder="Type to search..." />
}

export default Search
