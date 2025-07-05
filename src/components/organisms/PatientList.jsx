import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import DataTable from '@/components/molecules/DataTable'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Modal from '@/components/molecules/Modal'
import PatientForm from '@/components/organisms/PatientForm'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { patientService } from '@/services/api/patientService'

const PatientList = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const navigate = useNavigate()
  
  const loadPatients = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await patientService.getAll()
      setPatients(data)
    } catch (err) {
      setError(err.message || 'Failed to load patients')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadPatients()
  }, [])
  
  const handleAddPatient = () => {
    setSelectedPatient(null)
    setShowModal(true)
  }
  
  const handleEditPatient = (patient) => {
    setSelectedPatient(patient)
    setShowModal(true)
  }
  
  const handleDeletePatient = async (patient) => {
    if (window.confirm(`Are you sure you want to delete ${patient.name}?`)) {
      try {
        await patientService.delete(patient.Id)
        setPatients(patients.filter(p => p.Id !== patient.Id))
        toast.success('Patient deleted successfully')
      } catch (err) {
        toast.error('Failed to delete patient')
      }
    }
  }
  
  const handleSavePatient = async (patientData) => {
    try {
      if (selectedPatient) {
        const updated = await patientService.update(selectedPatient.Id, patientData)
        setPatients(patients.map(p => p.Id === selectedPatient.Id ? updated : p))
        toast.success('Patient updated successfully')
      } else {
        const newPatient = await patientService.create(patientData)
        setPatients([...patients, newPatient])
        toast.success('Patient added successfully')
      }
      setShowModal(false)
    } catch (err) {
      toast.error('Failed to save patient')
    }
  }
  
  const handleRowClick = (patient) => {
    navigate(`/patients/${patient.Id}`)
  }
  
  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-medium text-sm">
              {value.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (value) => (
        <span className="text-gray-900">{value}</span>
      )
    },
    {
      key: 'age',
      header: 'Age',
      render: (value, row) => {
        const age = new Date().getFullYear() - new Date(row.dateOfBirth).getFullYear()
        return <span className="text-gray-900">{age} years</span>
      }
    },
    {
      key: 'gender',
      header: 'Gender',
      render: (value) => (
        <Badge variant="default" size="sm">
          {value}
        </Badge>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (value, row) => (
        <Badge variant={row.allergies?.length > 0 ? 'warning' : 'success'} size="sm">
          {row.allergies?.length > 0 ? 'Has Allergies' : 'No Allergies'}
        </Badge>
      )
    }
  ]
  
  const actions = [
    {
      label: 'Edit',
      icon: 'Edit',
      onClick: handleEditPatient
    },
    {
      label: 'Delete',
      icon: 'Trash2',
      onClick: handleDeletePatient
    }
  ]
  
  if (loading) {
    return <Loading type="table" />
  }
  
  if (error) {
    return <Error message={error} onRetry={loadPatients} />
  }
  
  if (patients.length === 0) {
    return <Empty type="patients" onAction={handleAddPatient} />
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">All Patients</h2>
          <p className="text-sm text-gray-500">
            {patients.length} patient{patients.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={handleAddPatient}
        >
          Add Patient
        </Button>
      </div>
      
      <DataTable
        columns={columns}
        data={patients}
        onRowClick={handleRowClick}
        actions={actions}
      />
      
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedPatient ? 'Edit Patient' : 'Add New Patient'}
        size="lg"
      >
        <PatientForm
          patient={selectedPatient}
          onSave={handleSavePatient}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  )
}

export default PatientList