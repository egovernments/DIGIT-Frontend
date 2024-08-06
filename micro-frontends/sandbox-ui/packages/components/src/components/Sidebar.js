import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Sidebar Component
 * 
 * A simple sidebar component with navigation links, styled using Tailwind CSS.
 * 
 * @returns {JSX.Element} The rendered Sidebar component.
 */
const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white top-0 left-0 p-4">
      <h2 className="text-2xl font-semibold mb-6">Sidebar</h2>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link to="/home" className="hover:text-gray-400">Home</Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-gray-400">About</Link>
          </li>
          <li>
            <Link to="/services" className="hover:text-gray-400">Services</Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-gray-400">Contact</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
