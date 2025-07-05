import drugsData from '@/services/mockData/drugs.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class DrugService {
  constructor() {
    this.drugs = [...drugsData]
  }

  async getAll() {
    await delay(300)
    return [...this.drugs]
  }

  async getById(id) {
    await delay(200)
    const drug = this.drugs.find(d => d.Id === id)
    if (!drug) {
      throw new Error('Drug not found')
    }
    return { ...drug }
  }

  async create(drugData) {
    await delay(400)
    const newDrug = {
      ...drugData,
      Id: Math.max(...this.drugs.map(d => d.Id)) + 1
    }
    this.drugs.push(newDrug)
    return { ...newDrug }
  }

  async update(id, drugData) {
    await delay(400)
    const index = this.drugs.findIndex(d => d.Id === id)
    if (index === -1) {
      throw new Error('Drug not found')
    }
    
    const updatedDrug = {
      ...this.drugs[index],
      ...drugData,
      Id: id
    }
    
    this.drugs[index] = updatedDrug
    return { ...updatedDrug }
  }

  async delete(id) {
    await delay(300)
    const index = this.drugs.findIndex(d => d.Id === id)
    if (index === -1) {
      throw new Error('Drug not found')
    }
    
    this.drugs.splice(index, 1)
    return { success: true }
  }
}

export const drugService = new DrugService()