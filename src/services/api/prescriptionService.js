import prescriptionsData from '@/services/mockData/prescriptions.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class PrescriptionService {
  constructor() {
    this.prescriptions = [...prescriptionsData]
  }

  async getAll() {
    await delay(300)
    return [...this.prescriptions]
  }

  async getById(id) {
    await delay(200)
    const prescription = this.prescriptions.find(p => p.Id === id)
    if (!prescription) {
      throw new Error('Prescription not found')
    }
    return { ...prescription }
  }

  async create(prescriptionData) {
    await delay(400)
    const newPrescription = {
      ...prescriptionData,
      Id: Math.max(...this.prescriptions.map(p => p.Id)) + 1
    }
    this.prescriptions.push(newPrescription)
    return { ...newPrescription }
  }

  async update(id, prescriptionData) {
    await delay(400)
    const index = this.prescriptions.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error('Prescription not found')
    }
    
    const updatedPrescription = {
      ...this.prescriptions[index],
      ...prescriptionData,
      Id: id
    }
    
    this.prescriptions[index] = updatedPrescription
    return { ...updatedPrescription }
  }

  async delete(id) {
    await delay(300)
    const index = this.prescriptions.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error('Prescription not found')
    }
    
    this.prescriptions.splice(index, 1)
    return { success: true }
  }
}

export const prescriptionService = new PrescriptionService()