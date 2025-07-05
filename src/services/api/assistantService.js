import assistantsData from '@/services/mockData/assistants.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class AssistantService {
  constructor() {
    this.assistants = [...assistantsData]
  }

  async getAll() {
    await delay(300)
    return [...this.assistants]
  }

  async getById(id) {
    await delay(200)
    const assistant = this.assistants.find(a => a.Id === id)
    if (!assistant) {
      throw new Error('Assistant not found')
    }
    return { ...assistant }
  }

  async create(assistantData) {
    await delay(400)
    const newAssistant = {
      ...assistantData,
      Id: Math.max(...this.assistants.map(a => a.Id)) + 1
    }
    this.assistants.push(newAssistant)
    return { ...newAssistant }
  }

  async update(id, assistantData) {
    await delay(400)
    const index = this.assistants.findIndex(a => a.Id === id)
    if (index === -1) {
      throw new Error('Assistant not found')
    }
    
    const updatedAssistant = {
      ...this.assistants[index],
      ...assistantData,
      Id: id
    }
    
    this.assistants[index] = updatedAssistant
    return { ...updatedAssistant }
  }

  async delete(id) {
    await delay(300)
    const index = this.assistants.findIndex(a => a.Id === id)
    if (index === -1) {
      throw new Error('Assistant not found')
    }
    
    this.assistants.splice(index, 1)
    return { success: true }
  }
}

export const assistantService = new AssistantService()