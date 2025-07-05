import ApperIcon from '@/components/ApperIcon'

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  icon,
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full"
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary-100 text-primary-800",
    secondary: "bg-secondary-100 text-secondary-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    scheduled: "status-scheduled",
    confirmed: "status-confirmed",
    completed: "status-completed",
    cancelled: "status-cancelled",
    'no-show': "status-no-show",
    active: "status-active",
    inactive: "status-inactive"
  }
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  }
  
  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  return (
    <span className={classes} {...props}>
      {icon && (
        <ApperIcon name={icon} className={`${iconSizes[size]} ${children ? 'mr-1' : ''}`} />
      )}
      {children}
    </span>
  )
}

export default Badge