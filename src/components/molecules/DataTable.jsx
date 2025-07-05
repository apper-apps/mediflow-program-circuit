import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const DataTable = ({ 
  columns, 
  data, 
  onRowClick,
  actions,
  loading = false,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
        <div className="p-4">
          <div className="skeleton h-6 w-32 rounded bg-gray-200 mb-4"></div>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="border-b border-gray-100 p-4">
              <div className="flex items-center gap-4">
                <div className="skeleton h-10 w-10 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-32 rounded bg-gray-200"></div>
                  <div className="skeleton h-3 w-48 rounded bg-gray-200"></div>
                </div>
                <div className="skeleton h-8 w-24 rounded bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rowIndex * 0.05 }}
                className={`hover:bg-gray-50 transition-colors duration-200 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {actions.map((action, actionIndex) => (
                        <Button
                          key={actionIndex}
                          variant="ghost"
                          size="sm"
                          icon={action.icon}
                          onClick={(e) => {
                            e.stopPropagation()
                            action.onClick(row)
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable