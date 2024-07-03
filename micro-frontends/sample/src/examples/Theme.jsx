import { createContext, useState, use,useEffect } from 'react';

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
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
      className={`max-w-l mx-auto rounded-lg p-6
       bg-white dark:bg-gray-800`}
    >
      <h1
        className={`text-2xl my-3  text-black dark:text-white`}
      >
        Theme Card
      </h1>
      <p className={ 'text-black dark:text-white'}>
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
