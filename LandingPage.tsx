
import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="relative h-[calc(100vh-120px)] -m-4 md:-m-6 flex items-center justify-center text-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('https://picsum.photos/seed/veggies/1200/800')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      
      <div className="relative z-10 p-8 animate-fadeIn">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 drop-shadow-lg">
          Bem-vindo ao <span className="text-brand-green-light">Green Spot</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Sua fonte de frutas e verduras frescas, entregues com carinho na sua porta.
        </p>
        <Link
          to="/products"
          className="bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 duration-300 shadow-xl"
        >
          Ver Produtos
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
