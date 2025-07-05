import { useState } from 'react'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'

const SearchBar = ({ 
  placeholder = "Search...",
  onSearch,
  value,
  onChange,
  showButton = true,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState(value || '')
  
  const handleInputChange = (e) => {
    const newValue = e.target.value
    setSearchTerm(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchTerm)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <div className="flex-1">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          icon="Search"
          iconPosition="left"
        />
      </div>
      {showButton && (
        <Button
          type="submit"
          variant="primary"
          icon="Search"
        >
          Search
        </Button>
      )}
    </form>
  )
}

export default SearchBar