import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  
const navigationItems = [
    { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/patients', label: 'Patients', icon: 'Users' },
    { path: '/appointments', label: 'Appointments', icon: 'Calendar' },
    { path: '/prescriptions', label: 'Prescriptions', icon: 'FileText' },
    { path: '/templates', label: 'Templates', icon: 'Library' },
    { path: '/drugs', label: 'Drugs', icon: 'Pill' },
    { path: '/assistants', label: 'Assistants', icon: 'UserPlus' },
    { path: '/settings', label: 'Settings', icon: 'Settings' }
  ]
  
  const NavItem = ({ item, onClick }) => (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
          isActive
            ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`
      }
    >
      <ApperIcon name={item.icon} className="w-5 h-5 flex-shrink-0" />
      <span>{item.label}</span>
    </NavLink>
  )
  
  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="Stethoscope" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">MediFlow Pro</h1>
            <p className="text-xs text-gray-500">Healthcare Management</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>
        
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Dr. Sarah Johnson</p>
              <p className="text-xs text-gray-500">General Practitioner</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  
  // Mobile Sidebar
  const MobileSidebar = () => (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-xl"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Stethoscope" className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">MediFlow Pro</h1>
                  <p className="text-xs text-gray-500">Healthcare Management</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              />
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigationItems.map((item) => (
                <NavItem key={item.path} item={item} onClick={onClose} />
              ))}
            </nav>
            
            <div className="px-4 py-4 border-t border-gray-200">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <ApperIcon name="User" className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Dr. Sarah Johnson</p>
                  <p className="text-xs text-gray-500">General Practitioner</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
  
  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  )
}

export default Sidebar