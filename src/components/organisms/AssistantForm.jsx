import { useState } from 'react'
import { motion } from 'framer-motion'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const AssistantForm = ({ assistant, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: assistant?.name || '',
    email: assistant?.email || '',
    role: assistant?.role || 'Medical Assistant',
    permissions: assistant?.permissions || {
      viewPatients: false,
      editPatients: false,
      scheduleAppointments: false,
      viewAppointments: true,
      managePrescriptions: false,
      viewPrescriptions: false,
      accessDrugDatabase: false,
      viewReports: false
    },
    active: assistant?.active ?? true
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.role) {
      newErrors.role = 'Role is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    
    try {
      const assistantData = {
        ...formData,
        createdBy: 'dr-1', // In a real app, this would come from auth
        createdAt: assistant?.createdAt || new Date().toISOString()
      }
      
      await onSave(assistantData)
    } catch (err) {
      console.error('Failed to save assistant:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name.startsWith('permissions.')) {
      const permission = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [permission]: checked
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }
  
  const roleOptions = [
    'Medical Assistant',
    'Nurse',
    'Receptionist',
    'Administrative Assistant',
    'Medical Secretary',
    'Practice Manager'
  ]
  
  const permissionOptions = [
    { key: 'viewPatients', label: 'View Patients', description: 'Can view patient information' },
    { key: 'editPatients', label: 'Edit Patients', description: 'Can modify patient records' },
    { key: 'scheduleAppointments', label: 'Schedule Appointments', description: 'Can create and modify appointments' },
    { key: 'viewAppointments', label: 'View Appointments', description: 'Can view appointment calendar' },
    { key: 'managePrescriptions', label: 'Manage Prescriptions', description: 'Can create and modify prescriptions' },
    { key: 'viewPrescriptions', label: 'View Prescriptions', description: 'Can view prescription history' },
    { key: 'accessDrugDatabase', label: 'Access Drug Database', description: 'Can search and view drug information' },
    { key: 'viewReports', label: 'View Reports', description: 'Can access practice reports and analytics' }
  ]
  
  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          placeholder="Enter assistant's full name"
        />
        
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          placeholder="Enter email address"
        />
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select role</option>
            {roleOptions.map(role => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <ApperIcon name="AlertCircle" className="w-4 h-4" />
              {errors.role}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Active</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Permissions</h3>
          <p className="text-sm text-gray-600 mb-4">
            Select what this assistant can access in your practice
          </p>
        </div>
        
        <div className="space-y-4">
          {permissionOptions.map(option => (
            <div key={option.key} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                name={`permissions.${option.key}`}
                checked={formData.permissions[option.key]}
                onChange={handleChange}
                className="mt-1 w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
              />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900 cursor-pointer">
                  {option.label}
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
        >
          {assistant ? 'Update Assistant' : 'Add Assistant'}
        </Button>
      </div>
    </motion.form>
  )
}

export default AssistantForm