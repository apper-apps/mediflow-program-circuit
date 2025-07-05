import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'

const Header = ({ onMenuClick }) => {
  const location = useLocation()
  const [notifications] = useState([
    { id: 1, message: 'New appointment scheduled', time: '5 min ago' },
    { id: 2, message: 'Lab results ready for John Doe', time: '10 min ago' },
    { id: 3, message: 'Prescription refill request', time: '15 min ago' }
  ])
  
  const getPageTitle = () => {
    const pathMap = {
      '/': 'Dashboard',
      '/patients': 'Patients',
      '/appointments': 'Appointments',
      '/prescriptions': 'Prescriptions',
      '/drugs': 'Drug Database',
      '/assistants': 'Assistants',
      '/settings': 'Settings'
    }
    return pathMap[location.pathname] || 'Dashboard'
  }
  
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            icon="Menu"
            onClick={onMenuClick}
            className="lg:hidden"
          />
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:block w-80">
            <SearchBar 
              placeholder="Search patients, appointments..."
              showButton={false}
              className="max-w-md"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon="Search"
              className="sm:hidden"
            />
            
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                icon="Bell"
                className="relative"
              />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              icon="Settings"
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header