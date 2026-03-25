import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, MapPin, User, Heart, Sparkles, LogOut, Palmtree } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const links = [
    { to: '/', label: 'Home', icon: Palmtree },
    { to: '/destinations', label: 'Beaches', icon: MapPin },
    { to: '/hotels', label: 'Stays', icon: MapPin },
    { to: '/restaurants', label: 'Dining', icon: MapPin },
    { to: '/ai', label: 'AI Guide', icon: Sparkles },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-white">
            <span className="text-2xl">🌴</span>
            <span className="font-bold text-xl tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              discover<span className="text-ocean-300">ii</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/favorites"
                  className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-sm"
                >
                  <Heart size={16} />
                  <span>Saved</span>
                </Link>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm">
                  <User size={16} />
                  <span>{user?.name?.split(' ')[0]}</span>
                </div>
                <button
                  onClick={logout}
                  className="text-white/50 hover:text-white transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white/70 hover:text-white transition-colors text-sm font-medium"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-lg bg-ocean-500 text-white text-sm font-medium hover:bg-ocean-400 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden glass-dark border-t border-white/10">
          <div className="px-4 py-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.to)
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-3 mt-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/favorites"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-white/70 hover:text-white text-sm"
                  >
                    <Heart size={18} />
                    Saved Places
                  </Link>
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2.5 text-coral-400 text-sm w-full"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 text-center py-2.5 rounded-lg text-white/70 text-sm font-medium border border-white/20"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 text-center py-2.5 rounded-lg bg-ocean-500 text-white text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
