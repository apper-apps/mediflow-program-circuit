import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '',
  hover = false,
  padding = 'md',
  shadow = 'sm',
  ...props 
}) => {
  const baseClasses = "bg-white rounded-lg border border-gray-200"
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  }
  
  const hoverClasses = hover ? 'hover-lift cursor-pointer' : ''
  
  const classes = `${baseClasses} ${paddings[padding]} ${shadows[shadow]} ${hoverClasses} ${className}`
  
  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className={classes}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

export default Card