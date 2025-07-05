import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { format, isToday, isTomorrow, addDays } from 'date-fns'
import StatCard from '@/components/molecules/StatCard'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { patientService } from '@/services/api/patientService'
import { appointmentService } from '@/services/api/appointmentService'
import { prescriptionService } from '@/services/api/prescriptionService'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingTasks: 0,
    recentPrescriptions: 0
  })
  const [todayAppointments, setTodayAppointments] = useState([])
  const [recentPatients, setRecentPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  
  const loadDashboardData = async () => {
    setLoading(true)
    setError('')
    
    try {
      const [patients, appointments, prescriptions] = await Promise.all([
        patientService.getAll(),
        appointmentService.getAll(),
        prescriptionService.getAll()
      ])
      
      const today = new Date()
      const todayStr = format(today, 'yyyy-MM-dd')
      
      const todayAppts = appointments.filter(apt => {
        const aptDate = format(new Date(apt.dateTime), 'yyyy-MM-dd')
        return aptDate === todayStr
      })
      
      const recentPrescriptions = prescriptions.filter(prescription => {
        const prescriptionDate = new Date(prescription.date)
        const daysDiff = Math.floor((today - prescriptionDate) / (1000 * 60 * 60 * 24))
        return daysDiff <= 7
      })
      
      setStats({
        totalPatients: patients.length,
        todayAppointments: todayAppts.length,
        pendingTasks: todayAppts.filter(apt => apt.status === 'scheduled').length,
        recentPrescriptions: recentPrescriptions.length
      })
      
      setTodayAppointments(todayAppts.slice(0, 5))
      setRecentPatients(patients.slice(-5).reverse())
      
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadDashboardData()
  }, [])
  
  const getAppointmentTime = (dateTime) => {
    return format(new Date(dateTime), 'h:mm a')
  }
  
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }
  
  const getUpcomingAppointments = () => {
    const today = new Date()
    const tomorrow = addDays(today, 1)
    const tomorrowStr = format(tomorrow, 'yyyy-MM-dd')
    
    return todayAppointments.filter(apt => {
      const aptDate = format(new Date(apt.dateTime), 'yyyy-MM-dd')
      return aptDate === tomorrowStr
    })
  }
  
  if (loading) {
    return <Loading type="cards" />
  }
  
  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />
  }
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            {getGreeting()}, Dr. Johnson
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening in your practice today
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            icon="Calendar"
            onClick={() => navigate('/appointments')}
          >
            View Calendar
          </Button>
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => navigate('/patients')}
          >
            Add Patient
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon="Users"
          color="primary"
          trend="up"
          trendValue="+12 this month"
        />
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon="Calendar"
          color="secondary"
          trend="up"
          trendValue="+3 from yesterday"
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pendingTasks}
          icon="Clock"
          color="warning"
          trend="down"
          trendValue="-2 from morning"
        />
        <StatCard
          title="Recent Prescriptions"
          value={stats.recentPrescriptions}
          icon="FileText"
          color="success"
          trend="up"
          trendValue="+5 this week"
        />
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Appointments */}
        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/appointments')}
            >
              View All
            </Button>
          </div>
          
          {todayAppointments.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Calendar" className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No appointments scheduled for today</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => navigate('/appointments')}
              >
                Schedule Appointment
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((appointment, index) => (
                <motion.div
                  key={appointment.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Clock" className="w-6 h-6 text-primary-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{appointment.patientName}</h3>
                      <Badge variant={appointment.status} size="sm">
                        {appointment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {getAppointmentTime(appointment.dateTime)} • {appointment.type}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="ArrowRight"
                    onClick={() => navigate(`/appointments`)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </Card>
        
        {/* Recent Patients */}
        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Patients</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/patients')}
            >
              View All
            </Button>
          </div>
          
          {recentPatients.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Users" className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No patients registered yet</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => navigate('/patients')}
              >
                Add Patient
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPatients.map((patient, index) => (
                <motion.div
                  key={patient.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                    <span className="text-secondary-600 font-medium">
                      {patient.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{patient.name}</h3>
                    <p className="text-sm text-gray-600">{patient.email}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {patient.allergies?.length > 0 ? (
                        <Badge variant="warning" size="sm">
                          Has Allergies
                        </Badge>
                      ) : (
                        <Badge variant="success" size="sm">
                          No Allergies
                        </Badge>
                      )}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="ArrowRight"
                    onClick={() => navigate(`/patients/${patient.Id}`)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>
      
      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="flex-col h-20 gap-2"
            onClick={() => navigate('/appointments')}
          >
            <ApperIcon name="Calendar" className="w-6 h-6" />
            <span className="text-sm">Schedule</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex-col h-20 gap-2"
            onClick={() => navigate('/patients')}
          >
            <ApperIcon name="UserPlus" className="w-6 h-6" />
            <span className="text-sm">Add Patient</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex-col h-20 gap-2"
            onClick={() => navigate('/prescriptions/builder')}
          >
            <ApperIcon name="FileText" className="w-6 h-6" />
            <span className="text-sm">Prescribe</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex-col h-20 gap-2"
            onClick={() => navigate('/drugs')}
          >
            <ApperIcon name="Pill" className="w-6 h-6" />
            <span className="text-sm">Drug Search</span>
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default Dashboard