import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home        from './pages/Home.jsx'
import Login       from './pages/Login.jsx'
import SignUp      from './pages/SignUp.jsx'
import Services    from './pages/Services.jsx'
import Game        from './pages/Game.jsx'
import Profile     from './pages/Profile.jsx'
import Dashboard   from './pages/Dashboard.jsx'
import Performance from './pages/Performance.jsx'
import Navbar      from './components/Navbar.jsx'

function App() {
  const token   = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('is_admin') === 'true';

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route
          path='/login'
          element={token ? <Navigate to='/profile' replace /> : <Login />}
        />
        <Route
          path='/profile'
          element={token ? <Profile /> : <Navigate to='/login' replace />}
        />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/services' element={<Services />} />
        <Route
          path='/game'
          element={token ? <Game /> : <Navigate to='/login' replace />}
        />
        <Route
          path='/dashboard'
          element={
            !token   ? <Navigate to='/login' replace /> :
            !isAdmin ? <Navigate to='/'     replace /> :
            <Dashboard />
          }
        />
        <Route
          path='/performance/:id'
          element={token ? <Performance /> : <Navigate to='/login' replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App