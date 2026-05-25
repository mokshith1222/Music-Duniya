import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './layouts/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Album from './pages/Album'
import Artist from './pages/Artist'
import Favorites from './pages/Favorites'
import Home from './pages/Home'
import Jamendo from './pages/Jamendo'
import Login from './pages/Login'
import Playlist from './pages/Playlist'
import Radio from './pages/Radio'
import Search from './pages/Search'
import Signup from './pages/Signup'
import YouTube from './pages/YouTube'
import LikedSongs from './pages/LikedSongs'
import AIMood from './pages/AIMood'
import Library from './pages/Library'

function App() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="youtube" element={<YouTube />} />
        <Route path="artist/:id" element={<Artist />} />
        <Route path="album/:id" element={<Album />} />
        <Route path="playlist/:id" element={<ProtectedRoute><Playlist /></ProtectedRoute>} />
        <Route path="radio" element={<Radio />} />
        <Route path="jamendo" element={<Jamendo />} />
        <Route path="favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="liked" element={<ProtectedRoute><LikedSongs /></ProtectedRoute>} />
        <Route path="mood" element={<ProtectedRoute><AIMood /></ProtectedRoute>} />
        <Route path="library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
