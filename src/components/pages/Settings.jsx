import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'

const Settings = () => {
  const [settings, setSettings] = useState({
    // Practice Settings
    practiceName: 'MediFlow Pro Practice',
    practiceAddress: '123 Medical Center Dr, Healthcare City, HC 12345',
    practicePhone: '(555) 123-4567',
    practiceEmail: 'info@mediflowpro.com',
    
    // Doctor Settings
    doctorName: 'Dr. Sarah Johnson',
    doctorSpecialty: 'General Practitioner',
    doctorLicense: 'MD123456',
    doctorPhone: '(555) 987-6543',
    doctorEmail: 'dr.johnson@mediflowpro.com',
    
    // System Settings
    appointmentDuration: 30,
    workingHoursStart: '09:00',
    workingHoursEnd: '17:00',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    prescriptionAlerts: true,
    
    // Security Settings
    sessionTimeout: 30,
    requirePasswordReset: false,
    twoFactorAuth: false
  })
  
  const [activeTab, setActiveTab] = useState('practice')
  const [loading, setLoading] = useState(false)
  
  const tabs = [
    { id: 'practice', label: 'Practice', icon: 'Building' },
    { id: 'doctor', label: 'Doctor Profile', icon: 'User' },
    { id: 'system', label: 'System', icon: 'Settings' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'security', label: 'Security', icon: 'Shield' }
  ]
  
  const handleSave = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Settings saved successfully')
    } catch (err) {
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }
  
  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  const handleWorkingDaysChange = (day) => {
    setSettings(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day]
    }))
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your practice settings and preferences</p>
        </div>
        
        <Button
          variant="primary"
          onClick={handleSave}
          loading={loading}
          icon="Save"
        >
          Save Changes
        </Button>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'practice' && (
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Practice Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Practice Name"
                value={settings.practiceName}
                onChange={(e) => handleChange('practiceName', e.target.value)}
                placeholder="Enter practice name"
              />
              
              <Input
                label="Phone Number"
                value={settings.practicePhone}
                onChange={(e) => handleChange('practicePhone', e.target.value)}
                placeholder="Enter phone number"
              />
              
              <Input
                label="Email Address"
                type="email"
                value={settings.practiceEmail}
                onChange={(e) => handleChange('practiceEmail', e.target.value)}
                placeholder="Enter email address"
              />
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Practice Address
                </label>
                <textarea
                  value={settings.practiceAddress}
                  onChange={(e) => handleChange('practiceAddress', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter practice address"
                />
              </div>
            </div>
          </Card>
        )}
        
        {activeTab === 'doctor' && (
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Doctor Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                value={settings.doctorName}
                onChange={(e) => handleChange('doctorName', e.target.value)}
                placeholder="Enter full name"
              />
              
              <Input
                label="Specialty"
                value={settings.doctorSpecialty}
                onChange={(e) => handleChange('doctorSpecialty', e.target.value)}
                placeholder="Enter specialty"
              />
              
              <Input
                label="License Number"
                value={settings.doctorLicense}
                onChange={(e) => handleChange('doctorLicense', e.target.value)}
                placeholder="Enter license number"
              />
              
              <Input
                label="Phone Number"
                value={settings.doctorPhone}
                onChange={(e) => handleChange('doctorPhone', e.target.value)}
                placeholder="Enter phone number"
              />
              
              <Input
                label="Email Address"
                type="email"
                value={settings.doctorEmail}
                onChange={(e) => handleChange('doctorEmail', e.target.value)}
                placeholder="Enter email address"
              />
            </div>
          </Card>
        )}
        
        {activeTab === 'system' && (
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">System Settings</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Default Appointment Duration
                  </label>
                  <select
                    value={settings.appointmentDuration}
                    onChange={(e) => handleChange('appointmentDuration', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                  </select>
                </div>
                
                <Input
                  label="Working Hours Start"
                  type="time"
                  value={settings.workingHoursStart}
                  onChange={(e) => handleChange('workingHoursStart', e.target.value)}
                />
                
                <Input
                  label="Working Hours End"
                  type="time"
                  value={settings.workingHoursEnd}
                  onChange={(e) => handleChange('workingHoursEnd', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Working Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <label key={day} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.workingDays.includes(day)}
                        onChange={() => handleWorkingDaysChange(day)}
                        className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}
        
        {activeTab === 'notifications' && (
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                  className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">SMS Notifications</h3>
                  <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={(e) => handleChange('smsNotifications', e.target.checked)}
                  className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Appointment Reminders</h3>
                  <p className="text-sm text-gray-500">Send reminders to patients</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.appointmentReminders}
                  onChange={(e) => handleChange('appointmentReminders', e.target.checked)}
                  className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Prescription Alerts</h3>
                  <p className="text-sm text-gray-500">Get alerted about prescription issues</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.prescriptionAlerts}
                  onChange={(e) => handleChange('prescriptionAlerts', e.target.checked)}
                  className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                />
              </div>
            </div>
          </Card>
        )}
        
        {activeTab === 'security' && (
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Session Timeout (minutes)
                </label>
                <select
                  value={settings.sessionTimeout}
                  onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                  <option value={240}>4 hours</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Require Password Reset</h3>
                  <p className="text-sm text-gray-500">Force password reset every 90 days</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.requirePasswordReset}
                  onChange={(e) => handleChange('requirePasswordReset', e.target.checked)}
                  className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500">Add extra security to your account</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
                  className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                />
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Settings