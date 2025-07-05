import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No data found",
  description = "There's nothing here yet.",
  icon = "FileText",
  actionLabel,
  onAction,
  type = 'default'
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case 'patients':
        return {
          title: "No patients found",
          description: "Start building your patient database by adding your first patient.",
          icon: "Users",
          actionLabel: "Add Patient"
        }
      case 'appointments':
        return {
          title: "No appointments scheduled",
          description: "Your calendar is clear. Schedule your first appointment to get started.",
          icon: "Calendar",
          actionLabel: "Schedule Appointment"
        }
      case 'prescriptions':
        return {
          title: "No prescriptions created",
          description: "Create your first prescription or template to streamline your workflow.",
          icon: "FileText",
          actionLabel: "Create Prescription"
        }
      case 'drugs':
        return {
          title: "No drugs found",
          description: "Search for medications or expand your query to find what you need.",
          icon: "Pill",
          actionLabel: "Search Drugs"
        }
      case 'assistants':
        return {
          title: "No assistants added",
          description: "Add team members to help manage your practice more efficiently.",
          icon: "UserPlus",
          actionLabel: "Add Assistant"
        }
      default:
        return { title, description, icon, actionLabel }
    }
  }

  const content = getEmptyContent()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-primary-50 to-accent-50 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={content.icon} className="w-10 h-10 text-primary-500" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2 gradient-text">
        {content.title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {content.description}
      </p>
      
      {(content.actionLabel || actionLabel) && (onAction || onAction) && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="px-8 py-3 gradient-bg text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          {content.actionLabel || actionLabel}
        </motion.button>
      )}
    </motion.div>
  )
}

export default Empty