
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const DotsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
);

const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);


function Header() {
  const { cart } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const navLinks = [
    { path: '/products', label: 'Todos os Produtos' },
    { path: '/cart', label: 'Ver Carrinho' },
    { path: '/admin', label: 'Admin' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-brand-green-dark">
          Green Spot
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} className={`text-gray-600 hover:text-brand-green transition-colors duration-300 font-medium ${location.pathname === link.path ? 'text-brand-green' : ''}`}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
             <Link to="/cart" className="relative text-gray-600 hover:text-brand-green transition-colors duration-300">
                <CartIcon />
                {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                    </span>
                )}
            </Link>
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-gray-600 hover:text-brand-green transition-colors duration-300"
                aria-label="Abrir menu"
            >
                <DotsIcon />
            </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-slideIn">
          <nav className="flex flex-col p-4 space-y-2">
            {navLinks.map(link => (
                 <Link 
                    key={link.path} 
                    to={link.path} 
                    className={`block py-2 px-3 rounded-md text-gray-700 hover:bg-brand-gray hover:text-brand-green-dark transition-colors duration-200 ${location.pathname === link.path ? 'bg-brand-green-light text-white' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                >
                    {link.label}
                </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
