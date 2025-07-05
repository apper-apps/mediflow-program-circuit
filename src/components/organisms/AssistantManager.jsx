import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import DataTable from '@/components/molecules/DataTable'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Modal from '@/components/molecules/Modal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import AssistantForm from '@/components/organisms/AssistantForm'
import { assistantService } from '@/services/api/assistantService'

const AssistantManager = () => {
  const [assistants, setAssistants] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedAssistant, setSelectedAssistant] = useState(null)
  
  const loadAssistants = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await assistantService.getAll()
      setAssistants(data)
    } catch (err) {
      setError(err.message || 'Failed to load assistants')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadAssistants()
  }, [])
  
  const handleAddAssistant = () => {
    setSelectedAssistant(null)
    setShowModal(true)
  }
  
  const handleEditAssistant = (assistant) => {
    setSelectedAssistant(assistant)
    setShowModal(true)
  }
  
  const handleDeleteAssistant = async (assistant) => {
    if (window.confirm(`Are you sure you want to remove ${assistant.name}?`)) {
      try {
        await assistantService.delete(assistant.Id)
        setAssistants(assistants.filter(a => a.Id !== assistant.Id))
        toast.success('Assistant removed successfully')
      } catch (err) {
        toast.error('Failed to remove assistant')
      }
    }
  }
  
  const handleSaveAssistant = async (assistantData) => {
    try {
      if (selectedAssistant) {
        const updated = await assistantService.update(selectedAssistant.Id, assistantData)
        setAssistants(assistants.map(a => a.Id === selectedAssistant.Id ? updated : a))
        toast.success('Assistant updated successfully')
      } else {
        const newAssistant = await assistantService.create(assistantData)
        setAssistants([...assistants, newAssistant])
        toast.success('Assistant added successfully')
      }
      setShowModal(false)
    } catch (err) {
      toast.error('Failed to save assistant')
    }
  }
  
  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
            <span className="text-secondary-600 font-medium text-sm">
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
      key: 'role',
      header: 'Role',
      render: (value) => (
        <Badge variant="primary" size="sm">
          {value}
        </Badge>
      )
    },
    {
      key: 'permissions',
      header: 'Permissions',
      render: (value) => {
        const permissionCount = Object.values(value || {}).filter(Boolean).length
        return (
          <div className="flex items-center gap-2">
            <Badge variant="info" size="sm">
              {permissionCount} permission{permissionCount !== 1 ? 's' : ''}
            </Badge>
          </div>
        )
      }
    },
    {
      key: 'createdAt',
      header: 'Added',
      render: (value) => (
        <span className="text-gray-600 text-sm">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (value, row) => (
        <Badge variant={row.active ? 'active' : 'inactive'} size="sm">
          {row.active ? 'Active' : 'Inactive'}
        </Badge>
      )
    }
  ]
  
  const actions = [
    {
      label: 'Edit',
      icon: 'Edit',
      onClick: handleEditAssistant
    },
    {
      label: 'Remove',
      icon: 'UserMinus',
      onClick: handleDeleteAssistant
    }
  ]
  
  if (loading) {
    return <Loading type="table" />
  }
  
  if (error) {
    return <Error message={error} onRetry={loadAssistants} />
  }
  
  if (assistants.length === 0) {
    return <Empty type="assistants" onAction={handleAddAssistant} />
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Team Assistants</h2>
          <p className="text-sm text-gray-500">
            Manage your medical assistants and their permissions
          </p>
        </div>
        <Button
          variant="primary"
          icon="UserPlus"
          onClick={handleAddAssistant}
        >
          Add Assistant
        </Button>
      </div>
      
      <DataTable
        columns={columns}
        data={assistants}
        actions={actions}
      />
      
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedAssistant ? 'Edit Assistant' : 'Add New Assistant'}
        size="lg"
      >
        <AssistantForm
          assistant={selectedAssistant}
          onSave={handleSaveAssistant}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  )
}

export default AssistantManager