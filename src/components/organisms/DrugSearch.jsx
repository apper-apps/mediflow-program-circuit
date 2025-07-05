import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SearchBar from '@/components/molecules/SearchBar'
import DataTable from '@/components/molecules/DataTable'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import Modal from '@/components/molecules/Modal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { drugService } from '@/services/api/drugService'

const DrugSearch = () => {
  const [drugs, setDrugs] = useState([])
  const [filteredDrugs, setFilteredDrugs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDrug, setSelectedDrug] = useState(null)
  const [showModal, setShowModal] = useState(false)
  
  const loadDrugs = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await drugService.getAll()
      setDrugs(data)
      setFilteredDrugs(data)
    } catch (err) {
      setError(err.message || 'Failed to load drugs')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadDrugs()
  }, [])
  
  const handleSearch = (term) => {
    setSearchTerm(term)
    if (!term.trim()) {
      setFilteredDrugs(drugs)
    } else {
      const filtered = drugs.filter(drug =>
        drug.name.toLowerCase().includes(term.toLowerCase()) ||
        drug.genericName.toLowerCase().includes(term.toLowerCase()) ||
        drug.dosageForm.toLowerCase().includes(term.toLowerCase())
      )
      setFilteredDrugs(filtered)
    }
  }
  
  const handleViewDetails = (drug) => {
    setSelectedDrug(drug)
    setShowModal(true)
  }
  
  const columns = [
    {
      key: 'name',
      header: 'Drug Name',
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{row.genericName}</p>
        </div>
      )
    },
    {
      key: 'dosageForm',
      header: 'Form',
      render: (value) => (
        <Badge variant="default" size="sm">
          {value}
        </Badge>
      )
    },
    {
      key: 'strength',
      header: 'Strength',
      render: (value) => (
        <span className="text-gray-900 font-medium">{value}</span>
      )
    },
    {
      key: 'warnings',
      header: 'Warnings',
      render: (value) => (
        <div className="flex items-center gap-1">
          {value && value.length > 0 ? (
            <>
              <Badge variant="warning" size="sm">
                {value.length} warning{value.length !== 1 ? 's' : ''}
              </Badge>
            </>
          ) : (
            <Badge variant="success" size="sm">
              No warnings
            </Badge>
          )}
        </div>
      )
    },
    {
      key: 'interactions',
      header: 'Interactions',
      render: (value) => (
        <div className="flex items-center gap-1">
          {value && value.length > 0 ? (
            <Badge variant="danger" size="sm">
              {value.length} interaction{value.length !== 1 ? 's' : ''}
            </Badge>
          ) : (
            <Badge variant="success" size="sm">
              No interactions
            </Badge>
          )}
        </div>
      )
    }
  ]
  
  const actions = [
    {
      label: 'View Details',
      icon: 'Eye',
      onClick: handleViewDetails
    }
  ]
  
  if (loading) {
    return <Loading type="table" />
  }
  
  if (error) {
    return <Error message={error} onRetry={loadDrugs} />
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Drug Database</h2>
          <p className="text-sm text-gray-500">
            Search through {drugs.length} medications
          </p>
        </div>
        
        <div className="w-full sm:w-96">
          <SearchBar
            placeholder="Search drugs by name, generic name, or form..."
            value={searchTerm}
            onChange={handleSearch}
            showButton={false}
          />
        </div>
      </div>
      
      {filteredDrugs.length === 0 && searchTerm ? (
        <Empty
          type="drugs"
          title="No drugs found"
          description={`No medications found matching "${searchTerm}". Try a different search term.`}
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredDrugs}
          actions={actions}
        />
      )}
      
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Drug Details"
        size="lg"
      >
        {selectedDrug && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {selectedDrug.name}
                </h3>
                <p className="text-gray-600 mb-4">{selectedDrug.genericName}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Form:</span>
                    <Badge variant="default" size="sm">{selectedDrug.dosageForm}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Strength:</span>
                    <span className="text-sm text-gray-900">{selectedDrug.strength}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Warnings</h4>
                  {selectedDrug.warnings && selectedDrug.warnings.length > 0 ? (
                    <ul className="space-y-1">
                      {selectedDrug.warnings.map((warning, index) => (
                        <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          {warning}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No warnings</p>
                  )}
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Drug Interactions</h4>
                  {selectedDrug.interactions && selectedDrug.interactions.length > 0 ? (
                    <ul className="space-y-1">
                      {selectedDrug.interactions.map((interaction, index) => (
                        <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          {interaction}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No known interactions</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default DrugSearch