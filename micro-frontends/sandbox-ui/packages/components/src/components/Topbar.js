import React from 'react';

/**
 * Topbar Component
 * 
 * A simple topbar component with navigation items, styled using Tailwind CSS.
 * 
 * @returns {JSX.Element} The rendered Topbar component.
 */
const Topbar = () => {
  return (
    <header className="w-full h-16 bg-gray-900 text-white  top-0 left-0 flex items-center justify-between px-6 shadow-md z-50">
      <div className="text-2xl font-semibold">App Logo</div>
      <nav>
        <ul className="flex space-x-6">
          <li>
            <a href="/profile" className="hover:text-gray-400">Profile</a>
          </li>
          <li>
            <a href="/settings" className="hover:text-gray-400">Settings</a>
          </li>
          <li>
            <a href="/logout" className="hover:text-gray-400">Logout</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Topbar;
