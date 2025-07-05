import patientsData from '@/services/mockData/patients.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class PatientService {
  constructor() {
    this.patients = [...patientsData]
  }

  async getAll() {
    await delay(300)
    return [...this.patients]
  }

  async getById(id) {
    await delay(200)
    const patient = this.patients.find(p => p.Id === id)
    if (!patient) {
      throw new Error('Patient not found')
    }
    return { ...patient }
  }

  async create(patientData) {
    await delay(400)
    const newPatient = {
      ...patientData,
      Id: Math.max(...this.patients.map(p => p.Id)) + 1
    }
    this.patients.push(newPatient)
    return { ...newPatient }
  }

  async update(id, patientData) {
    await delay(400)
    const index = this.patients.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error('Patient not found')
    }
    
    const updatedPatient = {
      ...this.patients[index],
      ...patientData,
      Id: id
    }
    
    this.patients[index] = updatedPatient
    return { ...updatedPatient }
  }

  async delete(id) {
    await delay(300)
    const index = this.patients.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error('Patient not found')
    }
    
    this.patients.splice(index, 1)
    return { success: true }
  }
}

export const patientService = new PatientService()