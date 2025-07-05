import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths } from 'date-fns'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Modal from '@/components/molecules/Modal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import AppointmentForm from '@/components/organisms/AppointmentForm'
import { appointmentService } from '@/services/api/appointmentService'

const AppointmentCalendar = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('month') // 'day', 'week', 'month'
  const [showModal, setShowModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  
  const loadAppointments = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await appointmentService.getAll()
      setAppointments(data)
    } catch (err) {
      setError(err.message || 'Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadAppointments()
  }, [])
  
  const handlePrevious = () => {
    if (viewMode === 'day') {
      setCurrentDate(subDays(currentDate, 1))
    } else if (viewMode === 'week') {
      setCurrentDate(subWeeks(currentDate, 1))
    } else {
      setCurrentDate(subMonths(currentDate, 1))
    }
  }
  
  const handleNext = () => {
    if (viewMode === 'day') {
      setCurrentDate(addDays(currentDate, 1))
    } else if (viewMode === 'week') {
      setCurrentDate(addWeeks(currentDate, 1))
    } else {
      setCurrentDate(addMonths(currentDate, 1))
    }
  }
  
  const handleToday = () => {
    setCurrentDate(new Date())
  }
  
  const handleAddAppointment = (date = null) => {
    setSelectedAppointment(null)
    setSelectedDate(date)
    setShowModal(true)
  }
  
  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment)
    setSelectedDate(null)
    setShowModal(true)
  }
  
  const handleDeleteAppointment = async (appointment) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentService.delete(appointment.Id)
        setAppointments(appointments.filter(a => a.Id !== appointment.Id))
        toast.success('Appointment deleted successfully')
      } catch (err) {
        toast.error('Failed to delete appointment')
      }
    }
  }
  
  const handleSaveAppointment = async (appointmentData) => {
    try {
      if (selectedAppointment) {
        const updated = await appointmentService.update(selectedAppointment.Id, appointmentData)
        setAppointments(appointments.map(a => a.Id === selectedAppointment.Id ? updated : a))
        toast.success('Appointment updated successfully')
      } else {
        const newAppointment = await appointmentService.create(appointmentData)
        setAppointments([...appointments, newAppointment])
        toast.success('Appointment scheduled successfully')
      }
      setShowModal(false)
    } catch (err) {
      toast.error('Failed to save appointment')
    }
  }
  
  const getDaysInView = () => {
    if (viewMode === 'day') {
      return [currentDate]
    } else if (viewMode === 'week') {
      const start = startOfWeek(currentDate)
      const end = endOfWeek(currentDate)
      return eachDayOfInterval({ start, end })
    } else {
      const start = startOfMonth(currentDate)
      const end = endOfMonth(currentDate)
      const startCalendar = startOfWeek(start)
      const endCalendar = endOfWeek(end)
      return eachDayOfInterval({ start: startCalendar, end: endCalendar })
    }
  }
  
  const getAppointmentsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return appointments.filter(apt => {
      const aptDate = format(new Date(apt.dateTime), 'yyyy-MM-dd')
      return aptDate === dateStr
    })
  }
  
  const getViewTitle = () => {
    if (viewMode === 'day') {
      return format(currentDate, 'MMMM d, yyyy')
    } else if (viewMode === 'week') {
      const start = startOfWeek(currentDate)
      const end = endOfWeek(currentDate)
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
    } else {
      return format(currentDate, 'MMMM yyyy')
    }
  }
  
  if (loading) {
    return <Loading type="calendar" />
  }
  
  if (error) {
    return <Error message={error} onRetry={loadAppointments} />
  }
  
  const days = getDaysInView()
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">{getViewTitle()}</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon="ChevronLeft"
              onClick={handlePrevious}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleToday}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon="ChevronRight"
              onClick={handleNext}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['day', 'week', 'month'].map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode(mode)}
                className={viewMode === mode ? 'shadow-sm' : ''}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Button>
            ))}
          </div>
          
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => handleAddAppointment()}
          >
            New Appointment
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {viewMode === 'month' ? (
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700">
                {day}
              </div>
            ))}
            
            {days.map((day, index) => {
              const dayAppointments = getAppointmentsForDate(day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isDayToday = isToday(day)
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.01 }}
                  className={`bg-white p-2 min-h-[120px] border-r border-b border-gray-100 ${
                    !isCurrentMonth ? 'bg-gray-50' : ''
                  } ${isDayToday ? 'bg-primary-50' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${
                      !isCurrentMonth ? 'text-gray-400' : 
                      isDayToday ? 'text-primary-600' : 'text-gray-900'
                    }`}>
                      {format(day, 'd')}
                    </span>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Plus"
                      onClick={() => handleAddAppointment(day)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 3).map(appointment => (
                      <div
                        key={appointment.Id}
                        className="appointment-block cursor-pointer"
                        onClick={() => handleEditAppointment(appointment)}
                      >
                        <div className="text-xs font-medium">
                          {format(new Date(appointment.dateTime), 'h:mm a')}
                        </div>
                        <div className="text-xs truncate">
                          {appointment.patientName}
                        </div>
                      </div>
                    ))}
                    
                    {dayAppointments.length > 3 && (
                      <div className="text-xs text-gray-500 font-medium">
                        +{dayAppointments.length - 3} more
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-4">
              {days.map((day, index) => {
                const dayAppointments = getAppointmentsForDate(day)
                const isDayToday = isToday(day)
                
                return (
                  <div key={index} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`text-lg font-semibold ${
                        isDayToday ? 'text-primary-600' : 'text-gray-900'
                      }`}>
                        {format(day, 'EEEE, MMMM d')}
                        {isDayToday && <span className="ml-2 text-sm text-primary-500">(Today)</span>}
                      </h3>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        icon="Plus"
                        onClick={() => handleAddAppointment(day)}
                      >
                        Add Appointment
                      </Button>
                    </div>
                    
                    {dayAppointments.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <ApperIcon name="Calendar" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No appointments scheduled</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {dayAppointments.map(appointment => (
                          <div
                            key={appointment.Id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                <ApperIcon name="Calendar" className="w-6 h-6 text-primary-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{appointment.patientName}</h4>
                                <p className="text-sm text-gray-500">
                                  {format(new Date(appointment.dateTime), 'h:mm a')} • {appointment.type}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge variant={appointment.status}>{appointment.status}</Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                icon="Edit"
                                onClick={() => handleEditAppointment(appointment)}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                icon="Trash2"
                                onClick={() => handleDeleteAppointment(appointment)}
                                className="text-red-500 hover:text-red-700"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
      
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedAppointment ? 'Edit Appointment' : 'New Appointment'}
        size="lg"
      >
        <AppointmentForm
          appointment={selectedAppointment}
          selectedDate={selectedDate}
          onSave={handleSaveAppointment}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  )
}

export default AppointmentCalendar