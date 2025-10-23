import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { formatAddress } from '../utils/web3';
import { formatSolanaAddress } from '../utils/solana';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const formatWalletAddress = (address) => {
    if (!user?.walletType) return address;
    return user.walletType === 'ethereum' 
      ? formatAddress(address)
      : formatSolanaAddress(address);
  };

  return (
    <div className="navbar bg-white/80 backdrop-blur-md border-b border-base-300/30 sticky top-0 z-50 shadow-sm">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost normal-case text-xl gap-2 hover:bg-transparent">
          <span className="text-2xl">🔐</span>
          <span className="font-bold text-primary hidden sm:inline">BlockQuest</span>
        </Link>
      </div>

      <div className="navbar-end gap-2">
        {isAuthenticated ? (
          <>
            {/* Wallet Display */}
            {user?.walletAddress && (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/20 rounded-full">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm font-mono text-base-content/80">
                  {formatWalletAddress(user.walletAddress)}
                </span>
              </div>
            )}

            {/* User Dropdown */}
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost gap-2 hover:bg-base-200/50">
                <div className="avatar placeholder">
                  <div className="bg-primary text-white rounded-full w-8">
                    <span className="text-sm">{user?.username?.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
                <span className="hidden sm:inline text-base-content">{user?.username}</span>
              </label>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-xl bg-white border border-base-300/30 rounded-2xl w-52 gap-1 mt-2">
                <li className="menu-title px-4 pt-2">
                  <span className="text-xs text-base-content/60">Account</span>
                </li>
                <li>
                  <Link to="/home" className="gap-2 hover:bg-primary/10 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                  </Link>
                </li>
                {user?.walletAddress && (
                  <li>
                    <a className="gap-2 hover:bg-primary/10 rounded-lg">
                      <img 
                        src={user.walletType === 'ethereum' ? '/metamask.png' : '/phantom.png'}
                        alt="wallet"
                        className="w-4 h-4"
                      />
                      <span className="font-mono text-xs">{formatWalletAddress(user.walletAddress)}</span>
                    </a>
                  </li>
                )}
                <div className="divider my-1"></div>
                <li>
                  <button onClick={handleLogout} className="text-error gap-2 hover:bg-error/10 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn btn-ghost hover:bg-primary/10 text-base-content">
              Login
            </Link>
            <Link to="/register" className="btn bg-primary text-white border-0 hover:bg-primary/80 shadow-lg">
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
