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

  // Template operations
  async getTemplates() {
    await delay(300)
    return [...this.templates]
  }

  async getTemplatesByCategory(category) {
    await delay(250)
    if (category === 'All') {
      return [...this.templates]
    }
    return this.templates.filter(template => template.category === category)
  }

  async saveAsTemplate(prescriptionId, templateData) {
    await delay(400)
    const prescription = this.prescriptions.find(p => p.Id === prescriptionId)
    if (!prescription) {
      throw new Error('Prescription not found')
    }

    const newTemplate = {
      ...templateData,
      Id: Math.max(...this.templates.map(t => t.Id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      medications: prescription.medications || []
    }

    this.templates.push(newTemplate)
    return { ...newTemplate }
  }

  async deleteTemplate(id) {
    await delay(300)
    const index = this.templates.findIndex(t => t.Id === id)
    if (index === -1) {
      throw new Error('Template not found')
    }

    this.templates.splice(index, 1)
    return { success: true }
  }

  // Initialize templates
  templates = [
    {
      Id: 1,
      name: 'Hypertension Standard',
      description: 'Standard treatment for essential hypertension',
      category: 'Chronic Care',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      usageCount: 45,
      medications: [
        { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days' },
        { name: 'Hydrochlorothiazide', dosage: '25mg', frequency: 'Once daily', duration: '30 days' }
      ]
    },
    {
      Id: 2,
      name: 'Diabetes Type 2 Initial',
      description: 'Initial treatment protocol for Type 2 diabetes',
      category: 'Chronic Care',
      createdAt: '2024-01-20T14:30:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
      usageCount: 32,
      medications: [
        { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '90 days' },
        { name: 'Glipizide', dosage: '5mg', frequency: 'Once daily', duration: '90 days' }
      ]
    },
    {
      Id: 3,
      name: 'Upper Respiratory Infection',
      description: 'Common cold and flu symptom relief',
      category: 'General',
      createdAt: '2024-02-01T09:15:00Z',
      updatedAt: '2024-02-01T09:15:00Z',
      usageCount: 78,
      medications: [
        { name: 'Acetaminophen', dosage: '500mg', frequency: 'Every 6 hours', duration: '7 days' },
        { name: 'Dextromethorphan', dosage: '15mg', frequency: 'Every 4 hours', duration: '7 days' }
      ]
    },
    {
      Id: 4,
      name: 'Pediatric Fever',
      description: 'Fever management for children 2-12 years',
      category: 'Pediatric',
      createdAt: '2024-02-05T11:45:00Z',
      updatedAt: '2024-02-05T11:45:00Z',
      usageCount: 23,
      medications: [
        { name: 'Ibuprofen (Pediatric)', dosage: '10mg/kg', frequency: 'Every 6 hours', duration: '5 days' },
        { name: 'Acetaminophen (Pediatric)', dosage: '15mg/kg', frequency: 'Every 4 hours', duration: '5 days' }
      ]
    },
    {
      Id: 5,
      name: 'Anxiety - First Line',
      description: 'Initial treatment for generalized anxiety disorder',
      category: 'Mental Health',
      createdAt: '2024-02-10T16:20:00Z',
      updatedAt: '2024-02-10T16:20:00Z',
      usageCount: 15,
      medications: [
        { name: 'Sertraline', dosage: '50mg', frequency: 'Once daily', duration: '30 days' },
        { name: 'Lorazepam', dosage: '0.5mg', frequency: 'As needed', duration: '14 days' }
      ]
    },
    {
      Id: 6,
      name: 'Migraine Acute',
      description: 'Acute migraine treatment protocol',
      category: 'Neurology',
      createdAt: '2024-02-12T13:10:00Z',
      updatedAt: '2024-02-12T13:10:00Z',
      usageCount: 28,
      medications: [
        { name: 'Sumatriptan', dosage: '100mg', frequency: 'At onset, may repeat once', duration: '2 doses' },
        { name: 'Naproxen', dosage: '500mg', frequency: 'Twice daily', duration: '5 days' }
      ]
    }
  ]
}

export const prescriptionService = new PrescriptionService()