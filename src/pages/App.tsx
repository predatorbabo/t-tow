import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User, AssistanceRequest, UserRole } from '../types';
import { TRANSLATIONS } from '../constants';
import { ThemeContext, Theme } from '../contexts/ThemeContext';
import { NavBar } from '../components/NavBar';
import { Header } from '../components/Header';
import AuthPage from './AuthPage';

// Lazy-loaded components
const HomePage = lazy(() => import('./HomePage'));
const TruckListPage = lazy(() => import('./TruckListPage'));
const OwnerChatPage = lazy(() => import('./OwnerChatPage'));
const OwnerDashboard = lazy(() => import('./OwnerDashboard'));
const ProfilePage = lazy(() => import('./ProfilePage'));
const SettingsPage = lazy(() => import('./SettingsPage'));
const SupportPage = lazy(() => import('./SupportPage'));

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentLang, setCurrentLang] = useState<'en' | 'fr' | 'ar'>('en');
  const [activeRequest, setActiveRequest] = useState<AssistanceRequest | null>(null);
  const [theme, setTheme] = useState<Theme>({ primaryColor: 'blue', textColor: 'gray' });

  const handleLogin = (loggedInUser: User) => {
    if (loggedInUser.language) {
      setCurrentLang(loggedInUser.language);
    }
    setUser(loggedInUser);
  };

  useEffect(() => {
    if (user && user.language !== currentLang) {
      setUser(currentUser => currentUser ? { ...currentUser, language: currentLang } : null);
    }
  }, [currentLang, user]);

  const t = TRANSLATIONS[currentLang];

  const themeClasses = useMemo(() => ({
    background: theme.textColor === 'gray' ? 'bg-gray-50' : 'bg-blue-50'
  }), [theme.textColor]);

  const renderLoader = () => (
    <div className="w-full h-screen flex items-center justify-center">
      <p>Loading...</p>
    </div>
  );

  if (!user) {
    return (
      <ThemeContext.Provider value={{ ...theme, setTheme }}>
        <AuthPage onLogin={handleLogin} currentLang={currentLang} setLanguage={setCurrentLang} />
      </ThemeContext.Provider>
    );
  }

  return (
    <Router>
      <ThemeContext.Provider value={{ ...theme, setTheme }}>
        <div className={`min-h-screen ${themeClasses.background} max-w-md mx-auto shadow-2xl relative overflow-hidden ${currentLang === 'ar' ? 'rtl' : ''}`}>
          <Header 
            title="DzTow" 
            currentLang={currentLang} 
            setLanguage={setCurrentLang} 
          />
          
          <div className="pt-2">
            <Suspense fallback={renderLoader()}>
              <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={
                  <HomePage 
                    user={user} 
                    currentLang={currentLang} 
                    activeRequest={activeRequest}
                    setActiveRequest={setActiveRequest}
                  />
                } />
                <Route path="/trucks" element={<TruckListPage currentLang={currentLang} />} />
                <Route path="/chat" element={
                  user.role === UserRole.OWNER ? (
                    <OwnerChatPage 
                      user={user} 
                      currentLang={currentLang}
                    />
                  ) : <Navigate to="/home" />
                } />
                <Route path="/dashboard" element={
                  user.role === UserRole.OWNER ? (
                    <OwnerDashboard 
                      user={user} 
                      currentLang={currentLang} 
                      onUpdateUser={setUser}
                    />
                  ) : <Navigate to="/home" />
                } />
                <Route path="/profile" element={
                  <ProfilePage 
                    user={user} 
                    onLogout={() => setUser(null)} 
                    onUpdateUser={setUser} 
                    currentLang={currentLang}
                  />
                } />
                <Route path="/settings" element={<SettingsPage currentLang={currentLang} setLanguage={setCurrentLang} />} />
                <Route path="/support" element={<SupportPage currentLang={currentLang} />} />
              </Routes>
            </Suspense>
          </div>

          <NavBar 
            role={user.role} 
            setLanguage={setCurrentLang} 
            currentLang={currentLang} 
            onLogout={() => setUser(null)}
          />
        </div>
      </ThemeContext.Provider>
    </Router>
  );
};

export default App;
