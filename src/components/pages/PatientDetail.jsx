import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { patientService } from '@/services/api/patientService'
import { appointmentService } from '@/services/api/appointmentService'
import { prescriptionService } from '@/services/api/prescriptionService'

const PatientDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [patient, setPatient] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  
  const loadPatientData = async () => {
    setLoading(true)
    setError('')
    
    try {
      const [patientData, appointmentsData, prescriptionsData] = await Promise.all([
        patientService.getById(parseInt(id)),
        appointmentService.getAll(),
        prescriptionService.getAll()
      ])
      
      setPatient(patientData)
      setAppointments(appointmentsData.filter(apt => apt.patientId === parseInt(id)))
      setPrescriptions(prescriptionsData.filter(rx => rx.patientId === parseInt(id)))
      
    } catch (err) {
      setError(err.message || 'Failed to load patient data')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadPatientData()
  }, [id])
  
  const getAge = (dateOfBirth) => {
    return new Date().getFullYear() - new Date(dateOfBirth).getFullYear()
  }
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'User' },
    { id: 'appointments', label: 'Appointments', icon: 'Calendar' },
    { id: 'prescriptions', label: 'Prescriptions', icon: 'FileText' },
    { id: 'history', label: 'Medical History', icon: 'History' }
  ]
  
  if (loading) {
    return <Loading />
  }
  
  if (error) {
    return <Error message={error} onRetry={loadPatientData} />
  }
  
  if (!patient) {
    return <Error message="Patient not found" />
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            icon="ArrowLeft"
            onClick={() => navigate('/patients')}
          >
            Back to Patients
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-bold text-xl">
                {patient.name.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
              <p className="text-gray-600">{patient.email}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            icon="Calendar"
            onClick={() => navigate('/appointments')}
          >
            Schedule Appointment
          </Button>
          <Button
            variant="primary"
            icon="FileText"
            onClick={() => navigate('/prescriptions/builder')}
          >
            New Prescription
          </Button>
        </div>
      </div>
      
      {/* Patient Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="User" className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Age</h3>
          <p className="text-2xl font-bold text-primary-600">{getAge(patient.dateOfBirth)}</p>
          <p className="text-sm text-gray-500">years old</p>
        </Card>
        
        <Card className="text-center">
          <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Calendar" className="w-6 h-6 text-secondary-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Appointments</h3>
          <p className="text-2xl font-bold text-secondary-600">{appointments.length}</p>
          <p className="text-sm text-gray-500">total visits</p>
        </Card>
        
        <Card className="text-center">
          <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="FileText" className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Prescriptions</h3>
          <p className="text-2xl font-bold text-success">{prescriptions.length}</p>
          <p className="text-sm text-gray-500">prescribed</p>
        </Card>
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
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <p className="text-gray-900">{patient.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Gender</label>
                    <p className="text-gray-900">{patient.gender}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                    <p className="text-gray-900">{format(new Date(patient.dateOfBirth), 'MMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">{patient.phone}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{patient.email}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <p className="text-gray-900">{patient.address || 'Not provided'}</p>
                </div>
              </div>
            </Card>
            
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Allergies</label>
                  {patient.allergies && patient.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {patient.allergies.map((allergy, index) => (
                        <Badge key={index} variant="warning" size="sm">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No known allergies</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Current Medications</label>
                  {patient.currentMedications && patient.currentMedications.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {patient.currentMedications.map((medication, index) => (
                        <Badge key={index} variant="primary" size="sm">
                          {medication}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No current medications</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Medical History</label>
                  {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {patient.medicalHistory.map((condition, index) => (
                        <Badge key={index} variant="info" size="sm">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No medical history recorded</p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
        
        {activeTab === 'appointments' && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment History</h3>
            {appointments.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Calendar" className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No appointments scheduled</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map(appointment => (
                  <motion.div
                    key={appointment.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Calendar" className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{appointment.type}</h4>
                        <p className="text-sm text-gray-600">
                          {format(new Date(appointment.dateTime), 'MMM dd, yyyy • h:mm a')}
                        </p>
                      </div>
                    </div>
                    <Badge variant={appointment.status} size="sm">
                      {appointment.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        )}
        
        {activeTab === 'prescriptions' && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prescription History</h3>
            {prescriptions.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="FileText" className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No prescriptions issued</p>
              </div>
            ) : (
              <div className="space-y-4">
                {prescriptions.map(prescription => (
                  <motion.div
                    key={prescription.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        Prescription #{prescription.Id}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {format(new Date(prescription.date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {prescription.medications.map((medication, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Badge variant="primary" size="sm">
                            {medication.name}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {medication.dosage} • {medication.frequency}
                          </span>
                        </div>
                      ))}
                    </div>
                    {prescription.instructions && (
                      <p className="text-sm text-gray-600 mt-2">
                        Instructions: {prescription.instructions}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        )}
        
        {activeTab === 'history' && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical History</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Conditions</h4>
                {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {patient.medicalHistory.map((condition, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-info rounded-full flex items-center justify-center">
                          <ApperIcon name="Activity" className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-900">{condition}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No medical history recorded</p>
                )}
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Allergies</h4>
                {patient.allergies && patient.allergies.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {patient.allergies.map((allergy, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                          <ApperIcon name="AlertTriangle" className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-900">{allergy}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No known allergies</p>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default PatientDetail