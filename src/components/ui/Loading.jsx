import { motion } from 'framer-motion'

const Loading = ({ type = 'default' }) => {
  if (type === 'table') {
    return (
      <div className="w-full">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="border-b border-gray-100 p-4">
            <div className="flex items-center gap-4">
              <div className="skeleton h-10 w-10 rounded-full bg-gray-200"></div>
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-32 rounded bg-gray-200"></div>
                <div className="skeleton h-3 w-48 rounded bg-gray-200"></div>
              </div>
              <div className="skeleton h-8 w-24 rounded bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="skeleton h-5 w-24 rounded bg-gray-200"></div>
              <div className="skeleton h-8 w-8 rounded bg-gray-200"></div>
            </div>
            <div className="space-y-3">
              <div className="skeleton h-8 w-16 rounded bg-gray-200"></div>
              <div className="skeleton h-4 w-32 rounded bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'calendar') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="skeleton h-6 w-32 rounded bg-gray-200"></div>
          <div className="flex gap-2">
            <div className="skeleton h-8 w-8 rounded bg-gray-200"></div>
            <div className="skeleton h-8 w-8 rounded bg-gray-200"></div>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, index) => (
            <div key={index} className="skeleton h-20 rounded bg-gray-200"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <div className="text-gray-600 font-medium">Loading...</div>
      </div>
    </div>
  )
}

export default Loading