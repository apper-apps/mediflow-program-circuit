import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import DataTable from '@/components/molecules/DataTable'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { prescriptionService } from '@/services/api/prescriptionService'
import { patientService } from '@/services/api/patientService'

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([])
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  
  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [prescriptionsData, patientsData] = await Promise.all([
        prescriptionService.getAll(),
        patientService.getAll()
      ])
      
      // Enrich prescriptions with patient names
      const enrichedPrescriptions = prescriptionsData.map(prescription => {
        const patient = patientsData.find(p => p.Id === prescription.patientId)
        return {
          ...prescription,
          patientName: patient?.name || 'Unknown Patient'
        }
      })
      
      setPrescriptions(enrichedPrescriptions)
      setFilteredPrescriptions(enrichedPrescriptions)
      setPatients(patientsData)
    } catch (err) {
      setError(err.message || 'Failed to load prescriptions')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  const handleSearch = (term) => {
    setSearchTerm(term)
    if (!term.trim()) {
      setFilteredPrescriptions(prescriptions)
    } else {
      const filtered = prescriptions.filter(prescription =>
        prescription.patientName.toLowerCase().includes(term.toLowerCase()) ||
        prescription.medications.some(med => 
          med.name.toLowerCase().includes(term.toLowerCase())
        ) ||
        prescription.instructions.toLowerCase().includes(term.toLowerCase())
      )
      setFilteredPrescriptions(filtered)
    }
  }
  
  const handleDeletePrescription = async (prescription) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      try {
        await prescriptionService.delete(prescription.Id)
        const newPrescriptions = prescriptions.filter(p => p.Id !== prescription.Id)
        setPrescriptions(newPrescriptions)
        setFilteredPrescriptions(newPrescriptions)
        toast.success('Prescription deleted successfully')
      } catch (err) {
        toast.error('Failed to delete prescription')
      }
    }
  }
  
  const columns = [
    {
      key: 'Id',
      header: 'Prescription #',
      render: (value) => (
        <span className="font-medium text-gray-900">#{value}</span>
      )
    },
    {
      key: 'patientName',
      header: 'Patient',
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">
            {format(new Date(row.date), 'MMM dd, yyyy')}
          </p>
        </div>
      )
    },
    {
      key: 'medications',
      header: 'Medications',
      render: (value) => (
        <div className="space-y-1">
          {value.slice(0, 2).map((medication, index) => (
            <Badge key={index} variant="primary" size="sm">
              {medication.name}
            </Badge>
          ))}
          {value.length > 2 && (
            <Badge variant="default" size="sm">
              +{value.length - 2} more
            </Badge>
          )}
        </div>
      )
    },
    {
      key: 'instructions',
      header: 'Instructions',
      render: (value) => (
        <p className="text-sm text-gray-600 truncate max-w-xs">
          {value || 'No instructions provided'}
        </p>
      )
    },
    {
      key: 'templateId',
      header: 'Template',
      render: (value) => (
        value ? (
          <Badge variant="info" size="sm">
            Template #{value}
          </Badge>
        ) : (
          <Badge variant="default" size="sm">
            Custom
          </Badge>
        )
      )
    }
  ]
  
  const actions = [
    {
      label: 'View',
      icon: 'Eye',
      onClick: (prescription) => {
        // In a real app, this would open a detailed view
        console.log('View prescription:', prescription)
      }
    },
    {
      label: 'Print',
      icon: 'Printer',
      onClick: (prescription) => {
        // In a real app, this would print the prescription
        toast.info('Print functionality would be implemented here')
      }
    },
    {
      label: 'Delete',
      icon: 'Trash2',
      onClick: handleDeletePrescription
    }
  ]
  
  if (loading) {
    return <Loading type="table" />
  }
  
  if (error) {
    return <Error message={error} onRetry={loadData} />
  }
  
  if (prescriptions.length === 0) {
    return <Empty type="prescriptions" onAction={() => navigate('/prescriptions/builder')} />
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Prescriptions</h2>
          <p className="text-sm text-gray-500">
            {prescriptions.length} prescription{prescriptions.length !== 1 ? 's' : ''} issued
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-80">
            <SearchBar
              placeholder="Search prescriptions..."
              value={searchTerm}
              onChange={handleSearch}
              showButton={false}
            />
          </div>
          
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => navigate('/prescriptions/builder')}
          >
            New Prescription
          </Button>
        </div>
      </div>
      
      {filteredPrescriptions.length === 0 && searchTerm ? (
        <Empty
          title="No prescriptions found"
          description={`No prescriptions found matching "${searchTerm}". Try a different search term.`}
          icon="FileText"
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredPrescriptions}
          actions={actions}
        />
      )}
    </div>
  )
}

export default Prescriptions