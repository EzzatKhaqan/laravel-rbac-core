import { createContext, useContext, useState, useEffect } from 'react';

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [expandedLabel, setExpandedLabel] = useState(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [expandedMap, setExpandedMap] = useState({});


  // Synchronize path state seamlessly on navigation events
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    // Support custom routing events if you aren't using an abstraction router
    window.addEventListener('pushstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('pushstate', handleLocationChange);
    };
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  };

  // State calculations moved straight into the provider
  const isRouteActive = (path) => currentPath === path;
  const isSubItemActive = (subItemPath) => currentPath === subItemPath;

  const handleToggle = (label) => {
    setExpandedLabel((prev) => (prev === label ? null : label));
  };

  return (
    <LayoutContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        expandedMap,
        setExpandedMap,
        isDarkMode,
        setIsDarkMode,
        toggleSidebar,
        toggleDarkMode,
        expandedLabel,
        handleToggle,
        isRouteActive,
        isSubItemActive,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error("useLayout must be within a LayoutProvider");
  return context;
};
