import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import Patients from '@/components/pages/Patients'
import PatientDetail from '@/components/pages/PatientDetail'
import Appointments from '@/components/pages/Appointments'
import Prescriptions from '@/components/pages/Prescriptions'
import PrescriptionBuilder from '@/components/pages/PrescriptionBuilder'
import TemplateLibrary from '@/components/pages/TemplateLibrary'
import Drugs from '@/components/pages/Drugs'
import Assistants from '@/components/pages/Assistants'
import Settings from '@/components/pages/Settings'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/:id" element={<PatientDetail />} />
          <Route path="/appointments" element={<Appointments />} />
<Route path="/prescriptions" element={<Prescriptions />} />
          <Route path="/prescriptions/builder" element={<PrescriptionBuilder />} />
          <Route path="/templates" element={<TemplateLibrary />} />
          <Route path="/drugs" element={<Drugs />} />
          <Route path="/assistants" element={<Assistants />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 9999 }}
      />
    </div>
  )
}

export default App