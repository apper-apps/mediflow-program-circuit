import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { prescriptionService } from '@/services/api/prescriptionService'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import SearchBar from '@/components/molecules/SearchBar'
import Modal from '@/components/molecules/Modal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'

const TemplateLibrary = () => {
  const navigate = useNavigate()
  const [templates, setTemplates] = useState([])
  const [filteredTemplates, setFilteredTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState(null)

  const categories = ['All', 'General', 'Chronic Care', 'Pediatric', 'Mental Health', 'Neurology', 'Cardiology', 'Dermatology']

  useEffect(() => {
    loadTemplates()
  }, [])

  useEffect(() => {
    filterTemplates()
  }, [templates, searchTerm, selectedCategory])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      const data = await prescriptionService.getTemplates()
      setTemplates(data)
      setError(null)
    } catch (err) {
      setError('Failed to load templates')
      toast.error('Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  const filterTemplates = () => {
    let filtered = templates

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(template => template.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredTemplates(filtered)
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category)
  }

  const handleUseTemplate = (template) => {
    // Navigate to prescription builder with template data
    navigate('/prescriptions/builder', { 
      state: { 
        template: template,
        medications: template.medications 
      }
    })
    toast.success(`Using template: ${template.name}`)
  }

  const handlePreviewTemplate = (template) => {
    setSelectedTemplate(template)
    setShowPreview(true)
  }

  const handleDeleteTemplate = async (template) => {
    setTemplateToDelete(template)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    if (!templateToDelete) return

    try {
      await prescriptionService.deleteTemplate(templateToDelete.Id)
      setTemplates(prev => prev.filter(t => t.Id !== templateToDelete.Id))
      toast.success('Template deleted successfully')
    } catch (err) {
      toast.error('Failed to delete template')
    } finally {
      setShowDeleteConfirm(false)
      setTemplateToDelete(null)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const TemplateCard = ({ template }) => (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
          <p className="text-gray-600 text-sm mb-3">{template.description}</p>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {template.category}
            </span>
            <span className="text-xs text-gray-500">
              Used {template.usageCount} times
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 ml-4">
          <Button
            variant="ghost"
            size="sm"
            icon="Eye"
            onClick={() => handlePreviewTemplate(template)}
            className="text-gray-500 hover:text-gray-700"
          />
          <Button
            variant="ghost"
            size="sm"
            icon="Trash2"
            onClick={() => handleDeleteTemplate(template)}
            className="text-red-500 hover:text-red-700"
          />
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <p className="text-sm font-medium text-gray-700">Medications:</p>
        <div className="space-y-1">
          {template.medications.slice(0, 2).map((med, index) => (
            <div key={index} className="text-sm text-gray-600 bg-gray-50 rounded px-2 py-1">
              {med.name} - {med.dosage} {med.frequency}
            </div>
          ))}
          {template.medications.length > 2 && (
            <div className="text-xs text-gray-500">
              +{template.medications.length - 2} more medications
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <span className="text-xs text-gray-500">
          Updated {formatDate(template.updatedAt)}
        </span>
        <Button
          variant="primary"
          size="sm"
          onClick={() => handleUseTemplate(template)}
          className="px-4"
        >
          Use Template
        </Button>
      </div>
    </Card>
  )

  const TemplateListItem = ({ template }) => (
    <Card className="p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {template.category}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-2">{template.description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Used {template.usageCount} times</span>
            <span>Updated {formatDate(template.updatedAt)}</span>
            <span>{template.medications.length} medications</span>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            icon="Eye"
            onClick={() => handlePreviewTemplate(template)}
            className="text-gray-500 hover:text-gray-700"
          />
          <Button
            variant="ghost"
            size="sm"
            icon="Trash2"
            onClick={() => handleDeleteTemplate(template)}
            className="text-red-500 hover:text-red-700"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleUseTemplate(template)}
            className="px-4"
          >
            Use Template
          </Button>
        </div>
      </div>
    </Card>
  )

  if (loading) {
    return <Loading type="page" />
  }

  if (error) {
    return <Error message={error} onRetry={loadTemplates} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Template Library</h1>
          <p className="text-gray-600 mt-1">Browse and reuse prescription templates</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            icon={viewMode === 'grid' ? 'List' : 'Grid'}
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </Button>
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => navigate('/prescriptions/builder')}
          >
            Create Template
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search templates by name, description, or category..."
            onSearch={handleSearch}
            value={searchTerm}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleCategoryFilter(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'} found
        </p>
      </div>

      {/* Templates Grid/List */}
      {filteredTemplates.length === 0 ? (
        <Empty
          title="No templates found"
          description="Try adjusting your search or filter criteria"
          icon="FileText"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {filteredTemplates.map(template => 
            viewMode === 'grid' ? (
              <TemplateCard key={template.Id} template={template} />
            ) : (
              <TemplateListItem key={template.Id} template={template} />
            )
          )}
        </motion.div>
      )}

      {/* Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Template Preview"
        size="lg"
      >
        {selectedTemplate && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {selectedTemplate.name}
              </h3>
              <p className="text-gray-600 mb-4">{selectedTemplate.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {selectedTemplate.category}
                </span>
                <span>Used {selectedTemplate.usageCount} times</span>
                <span>Updated {formatDate(selectedTemplate.updatedAt)}</span>
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Medications</h4>
              <div className="space-y-3">
                {selectedTemplate.medications.map((med, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{med.name}</span>
                      <span className="text-sm text-gray-500">{med.dosage}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span>Frequency: {med.frequency}</span>
                      <span>Duration: {med.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setShowPreview(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  handleUseTemplate(selectedTemplate)
                  setShowPreview(false)
                }}
              >
                Use Template
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Template"
        size="md"
      >
        {templateToDelete && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete the template "{templateToDelete.name}"? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
              >
                Delete Template
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default TemplateLibrary