import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast';
import { store } from './store'
import ProtectedRoute from './components/ProtectedRoute'
import SignUp from './pages/SignUp'
import Chat from './pages/Chat'
import { SocketProvider } from './context/SocketContext'
function App() {
  return (
    <Provider store={store}>
      <SocketProvider>
        <div>
          <main className='bg-gray-50'>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path='signup' element={<SignUp />}/>
              <Route path='/home/*' element={
                <ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path='/chat' element={
                <ProtectedRoute><Chat /></ProtectedRoute>} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </SocketProvider>
    </Provider>
  )
}

export default App