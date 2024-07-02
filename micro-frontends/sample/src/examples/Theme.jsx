import { createContext, useState, use } from 'react';

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
      <div className={`theme-${theme} min-h-screen`}>
      <button >
        Toggle Theme
      </button>
      <div className="bg-primary text-secondary p-4">
        Hello, Tailwind CSS with Theme!
      </div>
    </div>
    </ThemeContext.Provider>
  );
};

const Card = ({ children }) => {
  const { theme, toggleTheme } = use(ThemeContext);

  return (
    <div
      className={`max-w-l mx-auto rounded-lg p-6 ${
        theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'
      }`}
    >
      <h1
        className={`text-2xl my-3 ${
          theme === 'light' ? 'text-gray-800' : 'text-white'
        }`}
      >
        Theme Card
      </h1>
      <p className={theme === 'light' ? 'text-gray-800' : 'text-white'}>
       Hello!! use() hook
      </p>
      {children}
      <button
        onClick={toggleTheme}
        className='bg-blue-500 hover:bg-blue-600 text-white rounded-md mt-4 p-4'
      >
        {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      </button>
    </div>
  );
};

const Theme = ({ children }) => {
  return (
    <ThemeProvider>
      <Card  children={children}/>
     
    </ThemeProvider>
  );
};

export default Theme
