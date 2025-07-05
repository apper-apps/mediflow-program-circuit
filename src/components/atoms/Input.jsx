import { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = forwardRef(({ 
  label,
  error,
  type = 'text',
  placeholder,
  icon,
  iconPosition = 'left',
  className = '',
  labelClassName = '',
  required = false,
  ...props 
}, ref) => {
  const baseClasses = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
  const errorClasses = error ? "border-red-500 focus:ring-red-500" : ""
  const iconClasses = icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''
  
  const inputClasses = `${baseClasses} ${errorClasses} ${iconClasses} ${className}`
  
  return (
    <div className="w-full">
      {label && (
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className={`absolute inset-y-0 ${iconPosition === 'left' ? 'left-0' : 'right-0'} flex items-center ${iconPosition === 'left' ? 'pl-3' : 'pr-3'} pointer-events-none`}>
            <ApperIcon name={icon} className="w-5 h-5 text-gray-400" />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={inputClasses}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <ApperIcon name="AlertCircle" className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input