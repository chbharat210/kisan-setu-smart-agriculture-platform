import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import {
  Sprout,
  CloudSun,
  Bug,
  IndianRupee,
  Landmark,
  Stethoscope,
  Bot,
  ArrowRight,
  LogOut
} from 'lucide-react';

export default function DashboardLayout() {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: Sprout
    },
    {
      name: 'Crop Advisory',
      path: '/crop-advisory',
      icon: Sprout
    },
    {
      name: 'Weather',
      path: '/weather',
      icon: CloudSun
    },
    {
      name: 'Disease Detection',
      path: '/disease-detection',
      icon: Bug
    },
    {
      name: 'Mandi Prices',
      path: '/mandi-prices',
      icon: IndianRupee
    },
    {
      name: 'Government Schemes',
      path: '/government-schemes',
      icon: Landmark
    },
    {
      name: 'Expert Advice',
      path: '/expert-advice',
      icon: Stethoscope
    },
    {
      name: 'AI Assistant',
      path: '/ai-assistant',
      icon: Bot
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}

      <aside className="dashboard-sidebar">

        <NavLink
          to="/dashboard"
          className="sidebar-brand"
        >
          <div className="sidebar-brand-icon">
            <Sprout size={27} />
          </div>

          <div>
            <strong>Kisan Setu</strong>
            <span>SMART AGRICULTURE</span>
          </div>
        </NavLink>


        {/* MENU */}

        <nav className="sidebar-nav">

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={24} />

                <span>
                  {item.name}
                </span>
              </NavLink>
            );
          })}

        </nav>


        {/* HELP */}

        <div className="sidebar-help">

          <h3>Need help?</h3>

          <p>
            Ask our smart farming assistant.
          </p>

          <NavLink to="/ai-assistant">
            Ask AI
            <ArrowRight size={18} />
          </NavLink>

        </div>


        {/* LOGOUT */}

        <button
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>

      </aside>


      {/* CONTENT */}

      <main className="dashboard-content">
        <Outlet />
      </main>

    </div>
  );
}