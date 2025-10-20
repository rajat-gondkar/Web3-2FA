import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { formatAddress } from '../utils/web3';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-dark-card/50 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🔐</span>
            <span className="text-xl font-bold gradient-text">BlockQuest</span>
          </Link>

          {/* Nav Items */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Wallet Display */}
                {user?.walletAddress && (
                  <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-dark-bg rounded-lg border border-zinc-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-text-secondary">
                      {formatAddress(user.walletAddress)}
                    </span>
                  </div>
                )}

                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <span className="text-text-secondary">
                    Hello, <span className="text-text-primary font-semibold">{user?.username}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 
                             rounded-lg transition-all duration-200 border border-red-500/20"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-text-primary hover:text-accent-primary transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-accent-primary to-accent-secondary 
                           text-white rounded-lg hover:shadow-lg hover:shadow-accent-primary/50 
                           transition-all duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
