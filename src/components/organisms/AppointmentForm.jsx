import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { patientService } from '@/services/api/patientService'

const AppointmentForm = ({ appointment, selectedDate, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    patientId: appointment?.patientId || '',
    patientName: appointment?.patientName || '',
    date: appointment ? format(new Date(appointment.dateTime), 'yyyy-MM-dd') : 
          selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
    time: appointment ? format(new Date(appointment.dateTime), 'HH:mm') : '',
    duration: appointment?.duration || 30,
    type: appointment?.type || 'Consultation',
    status: appointment?.status || 'scheduled',
    notes: appointment?.notes || ''
  })
  
  const [patients, setPatients] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    loadPatients()
  }, [])
  
  const loadPatients = async () => {
    try {
      const data = await patientService.getAll()
      setPatients(data)
    } catch (err) {
      console.error('Failed to load patients:', err)
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.patientId) {
      newErrors.patientId = 'Patient is required'
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required'
    }
    
    if (!formData.time) {
      newErrors.time = 'Time is required'
    }
    
    if (!formData.type) {
      newErrors.type = 'Appointment type is required'
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
      const appointmentData = {
        ...formData,
        dateTime: new Date(`${formData.date}T${formData.time}`).toISOString(),
        doctorId: 'dr-1' // In a real app, this would come from auth
      }
      
      await onSave(appointmentData)
    } catch (err) {
      console.error('Failed to save appointment:', err)
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
    
    // Update patient name when patient is selected
    if (name === 'patientId') {
      const selectedPatient = patients.find(p => p.Id === parseInt(value))
      if (selectedPatient) {
        setFormData(prev => ({
          ...prev,
          patientName: selectedPatient.name
        }))
      }
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }
  
  const appointmentTypes = [
    'Consultation',
    'Follow-up',
    'Check-up',
    'Emergency',
    'Procedure',
    'Lab Results',
    'Vaccination',
    'Physical Therapy'
  ]
  
  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no-show', label: 'No Show' }
  ]
  
  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Patient <span className="text-red-500">*</span>
          </label>
          <select
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select a patient</option>
            {patients.map(patient => (
              <option key={patient.Id} value={patient.Id}>
                {patient.name} - {patient.email}
              </option>
            ))}
          </select>
          {errors.patientId && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <ApperIcon name="AlertCircle" className="w-4 h-4" />
              {errors.patientId}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Appointment Type <span className="text-red-500">*</span>
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select type</option>
            {appointmentTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <ApperIcon name="AlertCircle" className="w-4 h-4" />
              {errors.type}
            </p>
          )}
        </div>
        
        <Input
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          error={errors.date}
          required
        />
        
        <Input
          label="Time"
          name="time"
          type="time"
          value={formData.time}
          onChange={handleChange}
          error={errors.time}
          required
        />
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Duration (minutes)
          </label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>1 hour</option>
            <option value={90}>1.5 hours</option>
            <option value={120}>2 hours</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          placeholder="Enter any additional notes or instructions"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
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
          {appointment ? 'Update Appointment' : 'Schedule Appointment'}
        </Button>
      </div>
    </motion.form>
  )
}

export default AppointmentForm