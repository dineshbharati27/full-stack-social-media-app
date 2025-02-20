import { Info } from 'lucide-react'

export default function About() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-blue-50 p-6 rounded-lg mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900">About Us</h2>
        </div>
        <p className="text-gray-600">
          We're a demo website showcasing the integration of various React libraries including:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
          <li>Tailwind CSS for styling</li>
          <li>React Router for navigation</li>
          <li>Lucide React for beautiful icons</li>
          <li>React Hot Toast for notifications</li>
          <li>Axios for API handling</li>
        </ul>
      </div>
    </div>
  )
}