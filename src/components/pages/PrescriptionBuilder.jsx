import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Modal from '@/components/molecules/Modal'
import ApperIcon from '@/components/ApperIcon'
import { patientService } from '@/services/api/patientService'
import { drugService } from '@/services/api/drugService'
import { prescriptionService } from '@/services/api/prescriptionService'

const PrescriptionBuilder = () => {
  const navigate = useNavigate()
  const [patients, setPatients] = useState([])
  const [drugs, setDrugs] = useState([])
  const [selectedPatient, setSelectedPatient] = useState('')
  const [medications, setMedications] = useState([])
  const [instructions, setInstructions] = useState('')
  const [showDrugModal, setShowDrugModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [templates, setTemplates] = useState([])
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    try {
      const [patientsData, drugsData] = await Promise.all([
        patientService.getAll(),
        drugService.getAll()
      ])
      setPatients(patientsData)
      setDrugs(drugsData)
    } catch (err) {
      toast.error('Failed to load data')
    }
  }
  
  const handleAddMedication = (drug) => {
    const newMedication = {
      id: Date.now(),
      name: drug.name,
      genericName: drug.genericName,
      dosage: drug.strength,
      frequency: 'Take as needed',
      duration: '7 days',
      instructions: ''
    }
    setMedications([...medications, newMedication])
    setShowDrugModal(false)
    setSearchTerm('')
  }
  
  const handleRemoveMedication = (id) => {
    setMedications(medications.filter(med => med.id !== id))
  }
  
  const handleMedicationChange = (id, field, value) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ))
  }
  
  const handleSavePrescription = async () => {
    if (!selectedPatient) {
      toast.error('Please select a patient')
      return
    }
    
    if (medications.length === 0) {
      toast.error('Please add at least one medication')
      return
    }
    
    setLoading(true)
    
    try {
      const prescriptionData = {
        patientId: parseInt(selectedPatient),
        doctorId: 'dr-1', // In a real app, this would come from auth
        date: new Date().toISOString(),
        medications: medications.map(med => ({
          name: med.name,
          genericName: med.genericName,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          instructions: med.instructions
        })),
        instructions,
        templateId: null
      }
      
      await prescriptionService.create(prescriptionData)
      toast.success('Prescription created successfully')
      navigate('/prescriptions')
    } catch (err) {
      toast.error('Failed to create prescription')
    } finally {
      setLoading(false)
    }
  }
  
  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      toast.error('Please enter a template name')
      return
    }
    
    if (medications.length === 0) {
      toast.error('Please add at least one medication')
      return
    }
    
    try {
      const template = {
        name: templateName,
        medications: medications.map(med => ({
          name: med.name,
          genericName: med.genericName,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          instructions: med.instructions
        })),
        instructions,
        createdAt: new Date().toISOString()
      }
      
      setTemplates([...templates, template])
      setShowTemplateModal(false)
      setTemplateName('')
      toast.success('Template saved successfully')
    } catch (err) {
      toast.error('Failed to save template')
    }
  }
  
  const filteredDrugs = drugs.filter(drug =>
    drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.genericName.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const frequencyOptions = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every 4 hours',
    'Every 6 hours',
    'Every 8 hours',
    'Every 12 hours',
    'As needed',
    'Before meals',
    'After meals',
    'At bedtime'
  ]
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prescription Builder</h1>
          <p className="text-gray-600">Create prescriptions and templates</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            icon="Save"
            onClick={() => setShowTemplateModal(true)}
            disabled={medications.length === 0}
          >
            Save Template
          </Button>
          <Button
            variant="outline"
            icon="ArrowLeft"
            onClick={() => navigate('/prescriptions')}
          >
            Back
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Prescription Form */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Patient <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Choose a patient</option>
                {patients.map(patient => (
                  <option key={patient.Id} value={patient.Id}>
                    {patient.name} - {patient.email}
                  </option>
                ))}
              </select>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Medications</h2>
              <Button
                variant="primary"
                size="sm"
                icon="Plus"
                onClick={() => setShowDrugModal(true)}
              >
                Add Medication
              </Button>
            </div>
            
            {medications.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Pill" className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No medications added yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setShowDrugModal(true)}
                >
                  Add First Medication
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {medications.map(medication => (
                  <motion.div
                    key={medication.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{medication.name}</h3>
                        <p className="text-sm text-gray-500">{medication.genericName}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Trash2"
                        onClick={() => handleRemoveMedication(medication.id)}
                        className="text-red-500 hover:text-red-700"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Dosage"
                        value={medication.dosage}
                        onChange={(e) => handleMedicationChange(medication.id, 'dosage', e.target.value)}
                        placeholder="e.g., 500mg"
                      />
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Frequency
                        </label>
                        <select
                          value={medication.frequency}
                          onChange={(e) => handleMedicationChange(medication.id, 'frequency', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          {frequencyOptions.map(option => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Duration"
                        value={medication.duration}
                        onChange={(e) => handleMedicationChange(medication.id, 'duration', e.target.value)}
                        placeholder="e.g., 7 days"
                      />
                      
                      <Input
                        label="Special Instructions"
                        value={medication.instructions}
                        onChange={(e) => handleMedicationChange(medication.id, 'instructions', e.target.value)}
                        placeholder="e.g., Take with food"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
          
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">General Instructions</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Additional Instructions
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={4}
                placeholder="Enter any additional instructions for the patient..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </Card>
          
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/prescriptions')}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSavePrescription}
              loading={loading}
              disabled={!selectedPatient || medications.length === 0}
            >
              Create Prescription
            </Button>
          </div>
        </div>
        
        {/* Preview */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
            <div className="prescription-preview">
              <div className="prescription-header">
                <h3 className="text-xl font-bold text-gray-900">MediFlow Pro</h3>
                <p className="text-gray-600">Dr. Sarah Johnson, MD</p>
                <p className="text-sm text-gray-500">General Practitioner</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Patient:</h4>
                  <p className="text-gray-700">
                    {selectedPatient ? 
                      patients.find(p => p.Id === parseInt(selectedPatient))?.name || 'Unknown' : 
                      'No patient selected'
                    }
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">Date:</h4>
                  <p className="text-gray-700">{new Date().toLocaleDateString()}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">Medications:</h4>
                  {medications.length === 0 ? (
                    <p className="text-gray-500 italic">No medications added</p>
                  ) : (
                    <div className="space-y-2">
                      {medications.map((medication, index) => (
                        <div key={medication.id} className="border-l-2 border-primary-500 pl-3">
                          <p className="font-medium text-gray-900">
                            {index + 1}. {medication.name} {medication.dosage}
                          </p>
                          <p className="text-sm text-gray-600">
                            {medication.frequency} for {medication.duration}
                          </p>
                          {medication.instructions && (
                            <p className="text-sm text-gray-500 italic">
                              {medication.instructions}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {instructions && (
                  <div>
                    <h4 className="font-semibold text-gray-900">General Instructions:</h4>
                    <p className="text-gray-700">{instructions}</p>
                  </div>
                )}
              </div>
              
              <div className="prescription-footer">
                <p className="text-sm text-gray-500">
                  Dr. Sarah Johnson, MD
                </p>
                <p className="text-sm text-gray-500">
                  License: MD123456
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Drug Selection Modal */}
      <Modal
        isOpen={showDrugModal}
        onClose={() => setShowDrugModal(false)}
        title="Add Medication"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Search Medications"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by drug name or generic name..."
            icon="Search"
          />
          
          <div className="max-h-96 overflow-y-auto">
            {filteredDrugs.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Search" className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No medications found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredDrugs.map(drug => (
                  <div
                    key={drug.Id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleAddMedication(drug)}
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">{drug.name}</h3>
                      <p className="text-sm text-gray-500">{drug.genericName}</p>
                      <p className="text-sm text-gray-500">{drug.dosageForm} • {drug.strength}</p>
                    </div>
                    <ApperIcon name="Plus" className="w-5 h-5 text-primary-500" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
      
      {/* Template Modal */}
      <Modal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        title="Save as Template"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Template Name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Enter template name..."
            required
          />
          
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowTemplateModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveTemplate}
            >
              Save Template
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default PrescriptionBuilder