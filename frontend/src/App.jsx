import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Destinations from './pages/Destinations';
import Hotels from './pages/Hotels';
import Restaurants from './pages/Restaurants';
import Detail from './pages/Detail';
import AIChat from './pages/AIChat';
import Favorites from './pages/Favorites';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/destinations/:id" element={<Detail />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/hotels/:id" element={<Detail />} />
              <Route path="/restaurants" element={<Restaurants />} />
              <Route path="/restaurants/:id" element={<Detail />} />
              <Route path="/ai" element={<AIChat />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
