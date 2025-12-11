import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Truck, User as UserIcon, MessageSquare, List } from 'lucide-react';
import { UserRole } from '../types';
import { TRANSLATIONS } from '../constants';
import { useTheme } from '../contexts/ThemeContext';

export const NavBar = ({ role, setLanguage, currentLang, onLogout }: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const t = TRANSLATIONS[currentLang as keyof typeof TRANSLATIONS];
  const { primaryColor, textColor } = useTheme();

  const NavItem = ({ path, icon: Icon, label }: any) => {
    const isActive = location.pathname === path;
    return (
      <button 
        onClick={() => navigate(path)}
        className={`flex flex-col items-center justify-center w-full py-2 ${isActive ? `text-${primaryColor}-600` : `text-${textColor}-500`}`}
      >
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
        <span className="text-[10px] mt-1">{label}</span>
      </button>
    );
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-${textColor}-200 pb-[env(safe-area-inset-bottom)] flex justify-around shadow-lg z-50`}>
      <NavItem path="/home" icon={MapPin} label={t.home} />
      {role === UserRole.USER && <NavItem path="/trucks" icon={List} label={t.truckList || "List"} />}
      {role === UserRole.OWNER && <NavItem path="/chat" icon={MessageSquare} label={t.chat} />}
      {role === UserRole.OWNER && <NavItem path="/dashboard" icon={Truck} label={t.dashboard} />}
      <NavItem path="/profile" icon={UserIcon} label={t.profile} />
    </div>
  );
};