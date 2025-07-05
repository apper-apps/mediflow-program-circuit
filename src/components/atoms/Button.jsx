import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500 shadow-sm hover:shadow-md",
    secondary: "bg-secondary-500 hover:bg-secondary-600 text-white focus:ring-secondary-500 shadow-sm hover:shadow-md",
    outline: "border border-gray-300 hover:border-primary-500 text-gray-700 hover:text-primary-500 focus:ring-primary-500 bg-white hover:bg-primary-50",
    ghost: "text-gray-600 hover:text-primary-500 hover:bg-primary-50 focus:ring-primary-500",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 shadow-sm hover:shadow-md",
    success: "bg-green-500 hover:bg-green-600 text-white focus:ring-green-500 shadow-sm hover:shadow-md",
    gradient: "gradient-bg text-white hover:shadow-lg focus:ring-primary-500"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  }
  
  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-6 h-6"
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`${iconSizes[size]} mr-2`}
        >
          <ApperIcon name="Loader2" className="w-full h-full" />
        </motion.div>
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon name={icon} className={`${iconSizes[size]} ${children ? 'mr-2' : ''}`} />
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon name={icon} className={`${iconSizes[size]} ${children ? 'ml-2' : ''}`} />
      )}
    </motion.button>
  )
}

export default Button