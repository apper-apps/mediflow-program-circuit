import appointmentsData from '@/services/mockData/appointments.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class AppointmentService {
  constructor() {
    this.appointments = [...appointmentsData]
  }

  async getAll() {
    await delay(300)
    return [...this.appointments]
  }

  async getById(id) {
    await delay(200)
    const appointment = this.appointments.find(a => a.Id === id)
    if (!appointment) {
      throw new Error('Appointment not found')
    }
    return { ...appointment }
  }

  async create(appointmentData) {
    await delay(400)
    const newAppointment = {
      ...appointmentData,
      Id: Math.max(...this.appointments.map(a => a.Id)) + 1
    }
    this.appointments.push(newAppointment)
    return { ...newAppointment }
  }

  async update(id, appointmentData) {
    await delay(400)
    const index = this.appointments.findIndex(a => a.Id === id)
    if (index === -1) {
      throw new Error('Appointment not found')
    }
    
    const updatedAppointment = {
      ...this.appointments[index],
      ...appointmentData,
      Id: id
    }
    
    this.appointments[index] = updatedAppointment
    return { ...updatedAppointment }
  }

  async delete(id) {
    await delay(300)
    const index = this.appointments.findIndex(a => a.Id === id)
    if (index === -1) {
      throw new Error('Appointment not found')
    }
    
    this.appointments.splice(index, 1)
    return { success: true }
  }
}

export const appointmentService = new AppointmentService()