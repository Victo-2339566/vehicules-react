import { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { VehiculeContext } from '../../contexts/VehiculeContext';

export default function Menu() {
  const { isLoggedIn, logout } = useContext(VehiculeContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/vehicules')}>
              <h1 className="text-2xl sm:text-3xl font-bold"> ViCtO Location Car</h1>
            </div>

            {/* Menu items */}
            <div className="flex items-center gap-3 sm:gap-6">
              <button
                type="button"
                onClick={() => navigate('/vehicules')}
                className="px-4 sm:px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 text-sm sm:text-base font-medium"
              >
                Nos Véhicules
              </button>

              {isLoggedIn && (
                <>
                  <button
                    type="button"
                    onClick={() => navigate('/create')}
                    className="px-4 sm:px-6 py-3 bg-green-500 rounded-lg hover:bg-green-600 transition duration-300 text-sm sm:text-base font-medium"
                  >
                     Ajouter
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="px-4 sm:px-6 py-3 bg-red-500 rounded-lg hover:bg-red-600 transition duration-300 text-sm sm:text-base font-medium"
                  >
                    Déconnexion
                  </button>
                </>
              )}

              {!isLoggedIn && (
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="px-4 sm:px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition duration-300 text-sm sm:text-base font-semibold"
                >
                   Connexion
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}