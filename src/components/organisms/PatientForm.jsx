import { useState } from 'react'
import { motion } from 'framer-motion'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const PatientForm = ({ patient, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: patient?.name || '',
    email: patient?.email || '',
    phone: patient?.phone || '',
    dateOfBirth: patient?.dateOfBirth || '',
    gender: patient?.gender || '',
    address: patient?.address || '',
    allergies: patient?.allergies?.join(', ') || '',
    currentMedications: patient?.currentMedications?.join(', ') || '',
    medicalHistory: patient?.medicalHistory?.join(', ') || ''
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
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required'
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required'
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Gender is required'
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
      const patientData = {
        ...formData,
        allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()) : [],
        currentMedications: formData.currentMedications ? formData.currentMedications.split(',').map(s => s.trim()) : [],
        medicalHistory: formData.medicalHistory ? formData.medicalHistory.split(',').map(s => s.trim()) : []
      }
      
      await onSave(patientData)
    } catch (err) {
      console.error('Failed to save patient:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }
  
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
          placeholder="Enter patient's full name"
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
        
        <Input
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          required
          placeholder="Enter phone number"
        />
        
        <Input
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
          error={errors.dateOfBirth}
          required
        />
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <ApperIcon name="AlertCircle" className="w-4 h-4" />
              {errors.gender}
            </p>
          )}
        </div>
        
        <Input
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter address"
        />
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Allergies
          </label>
          <textarea
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            rows={3}
            placeholder="Enter allergies separated by commas"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500">Separate multiple allergies with commas</p>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Current Medications
          </label>
          <textarea
            name="currentMedications"
            value={formData.currentMedications}
            onChange={handleChange}
            rows={3}
            placeholder="Enter current medications separated by commas"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500">Separate multiple medications with commas</p>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Medical History
          </label>
          <textarea
            name="medicalHistory"
            value={formData.medicalHistory}
            onChange={handleChange}
            rows={3}
            placeholder="Enter medical history separated by commas"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500">Separate multiple conditions with commas</p>
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
          {patient ? 'Update Patient' : 'Add Patient'}
        </Button>
      </div>
    </motion.form>
  )
}

export default PatientForm