import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌴</span>
              <span className="font-bold text-xl tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                discover<span className="text-ocean-400">ii</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Your ultimate guide to discovering the best of Goa — from pristine beaches and hidden restaurants to luxury stays and local experiences.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gray-300" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Explore
            </h4>
            <ul className="space-y-2">
              {[
                { to: '/destinations', label: 'Beaches & Destinations' },
                { to: '/hotels', label: 'Hotels & Stays' },
                { to: '/restaurants', label: 'Restaurants & Spots' },
                { to: '/ai', label: 'AI Travel Guide' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 hover:text-ocean-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gray-300" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Company
            </h4>
            <ul className="space-y-2">
              {['About', 'Contact', 'Privacy Policy', 'Terms of Use'].map((item) => (
                <li key={item}>
                  <span className="text-gray-400 hover:text-ocean-400 text-sm transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 Discoverii. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            Made with <Heart size={14} className="fill-coral-400 text-coral-400" /> for Goa lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
