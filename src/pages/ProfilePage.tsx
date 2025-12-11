import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Camera, Edit2, Check, X, Car, Settings, AlertTriangle, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { TRANSLATIONS } from '../constants';
import { User } from '../types';

interface ProfilePageProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
  currentLang: 'en' | 'fr' | 'ar';
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout, onUpdateUser, currentLang }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const vehicleInputRef = useRef<HTMLInputElement>(null);
  const { primaryColor, textColor } = useTheme();
  
  const t = TRANSLATIONS[currentLang];

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);

  // Reset temp state when user changes
  useEffect(() => {
    setNameInput(user.name);
  }, [user.name]);

  const themeClasses = useMemo(() => ({
    background: textColor === 'gray' ? 'bg-gray-200' : 'bg-blue-200',
    text: textColor === 'gray' ? 'text-gray-700' : 'text-blue-700',
    textMuted: textColor === 'gray' ? 'text-gray-500' : 'text-blue-500',
    textLight: textColor === 'gray' ? 'text-gray-400' : 'text-blue-400',
    primary: primaryColor === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700',
    primaryText: primaryColor === 'blue' ? 'text-blue-800' : 'text-gray-800',
    primaryBg: primaryColor === 'blue' ? 'bg-blue-100' : 'bg-gray-100',
    ring: primaryColor === 'blue' ? 'ring-blue-100 border-blue-400' : 'ring-gray-100 border-gray-400',
    hover: primaryColor === 'blue' ? 'hover:text-blue-500' : 'hover:text-gray-500'
  }), [primaryColor, textColor]);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpdateUser({ ...user, photoUrl: url });
    }
  };

  const handleVehicleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && 'vehicle' in user) {
      const url = URL.createObjectURL(file);
      onUpdateUser({ ...user, vehicle: { ...user.vehicle!, photoUrl: url }});
    }
  };

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdateUser({ ...user, name: nameInput });
      setIsEditingName(false);
    }
  };

  return (
    <div className="p-4 pb-20">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-4 flex flex-col items-center">
        <div className="relative mb-3">
          <div className={`w-24 h-24 ${themeClasses.background} rounded-full flex items-center justify-center ${themeClasses.textLight} overflow-hidden border-4 border-white shadow-sm`}>
            {user.photoUrl ? (
              <img src={user.photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <UserIcon size={40} />
            )}
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className={`absolute bottom-0 right-0 text-white p-2 rounded-full shadow-md transition-colors ${themeClasses.primary}`}
          >
            <Camera size={16} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {isEditingName ? (
           <div className="flex items-center space-x-2 mb-1 w-full justify-center">
             <input 
               type="text" 
               value={nameInput}
               onChange={(e) => setNameInput(e.target.value)}
               className={`border rounded p-1 text-lg font-bold text-center w-40 outline-none ring-2 ${themeClasses.ring}`}
               autoFocus
             />
             <button onClick={handleSaveName} className="p-1.5 bg-green-100 text-green-600 rounded-full hover:bg-green-200">
               <Check size={16} />
             </button>
             <button onClick={() => { setIsEditingName(false); setNameInput(user.name); }} className="p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200">
               <X size={16} />
             </button>
           </div>
        ) : (
          <div className="flex items-center justify-center space-x-2 mb-1">
            <h2 className="font-bold text-lg">{user.name}</h2>
            <button onClick={() => setIsEditingName(true)} className={`p-1 text-gray-400 ${themeClasses.hover}`}>
              <Edit2 size={14} />
            </button>
          </div>
        )}
        
        <p className={`${themeClasses.textMuted} text-sm`}>{user.phone}</p>
        <span className={`mt-2 ${themeClasses.primaryBg} ${themeClasses.primaryText} text-xs px-2 py-1 rounded font-medium`}>
          {user.role}
        </span>
        {user.role === 'USER' && user.vehicle && (
          <div className="mt-4 w-full bg-gray-50 p-3 rounded-lg text-left text-sm relative">
             <p className={`text-gray-400 text-xs uppercase font-bold mb-1`}>{t.vehicle}</p>
             <p className="font-medium">{user.vehicle.model}</p>
             <p className={`text-gray-400 mb-2`}>{user.vehicle.plate}</p>
             
             <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden relative flex items-center justify-center border border-dashed border-gray-300">
                {user.vehicle.photoUrl ? (
                  <img src={user.vehicle.photoUrl} alt="Vehicle" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <Car size={24} />
                    <span className="text-[10px] mt-1">Add Photo</span>
                  </div>
                )}
                <button 
                  onClick={() => vehicleInputRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-white p-1.5 rounded-full shadow-sm text-gray-600 hover:text-blue-600"
                >
                  <Camera size={14} />
                </button>
                <input 
                  type="file" 
                  ref={vehicleInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleVehicleImageChange}
                />
             </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <button 
          onClick={() => navigate('/settings')}
          className="w-full flex items-center justify-between p-4 border-b hover:bg-gray-50"
        >
          <div className={`flex items-center space-x-3 ${themeClasses.text}`}>
             <Settings size={20} />
             <span>{t.settings}</span>
          </div>
        </button>
        <button 
          onClick={() => navigate('/support')}
          className="w-full flex items-center justify-between p-4 border-b hover:bg-gray-50"
        >
          <div className={`flex items-center space-x-3 ${themeClasses.text}`}>
             <AlertTriangle size={20} />
             <span>{t.helpSupport}</span>
          </div>
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-between p-4 text-red-600 hover:bg-red-50"
        >
          <div className="flex items-center space-x-3">
             <LogOut size={20} />
             <span>{t.logout}</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
