import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Palette, AlertTriangle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../hooks/useNotifications';
import { TRANSLATIONS } from '../constants';

const SettingsPage = ({ currentLang, setLanguage }: any) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const isRtl = currentLang === 'ar';
  const { primaryColor, textColor, setTheme } = useTheme();
  const { permission, requestPermission } = useNotifications();
  const t = TRANSLATIONS[currentLang as keyof typeof TRANSLATIONS];

  const handleNotificationToggle = () => {
    if (permission !== 'granted') {
      requestPermission();
    }
    setNotifications(!notifications);
  };

  const colors = ['blue', 'indigo', 'rose', 'orange', 'emerald'];
  const textColors = ['red', 'blue', 'green', 'rose'];

  return (
    <div className={`p-4 pb-20 ${isRtl ? 'rtl' : ''}`}>
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-full hover:bg-gray-100 mr-2"
        >
          <ChevronLeft size={24} className={`text-${textColor}-700 ${isRtl ? 'rotate-180' : ''}`} />
        </button>
        <h1 className={`text-xl font-bold text-${textColor}-800`}>{t.settings}</h1>
      </div>

      <div className="space-y-4">
        {/* Appearance Settings */}
        <div className="bg-white p-4 rounded-xl shadow-sm space-y-5">
          <div className="flex items-center space-x-3 mb-2">
             <div className={`bg-${primaryColor}-100 p-2 rounded-lg text-${primaryColor}-600`}>
               <Palette size={18} />
             </div>
             <span className={`font-medium text-${textColor}-700`}>{t.appTheme}</span>
          </div>
          
          {/* Primary Color */}
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <span className={`text-sm text-${textColor}-500`}>{t.primaryColor}</span>
            <div className="flex space-x-2">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setTheme({ primaryColor: color, textColor })}
                  className={`w-6 h-6 rounded-full bg-${color}-600 border-2 transition-transform ${primaryColor === color ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                />
              ))}
            </div>
          </div>

          {/* Font Color */}
          <div className="space-y-2">
            <span className={`text-sm text-${textColor}-500 block`}>{t.fontStyle}</span>
             <div className="grid grid-cols-2 gap-2">
              {textColors.map(color => (
                <button
                  key={color}
                  onClick={() => setTheme({ primaryColor, textColor: color })}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all flex items-center justify-between ${
                    textColor === color 
                      ? `bg-${color}-100 border-${color}-500 text-${color}-800 ring-1 ring-${color}-500` 
                      : `bg-white border-gray-200 text-gray-600 hover:bg-gray-50`
                  }`}
                >
                  <span className="capitalize">{color}</span>
                  <div className={`w-4 h-4 rounded-full bg-${color}-500 border border-black/10`}></div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className={`bg-${primaryColor}-100 p-2 rounded-lg text-${primaryColor}-600`}>
               <span className="font-bold text-xs">AZ</span>
             </div>
             <span className={`font-medium text-${textColor}-700`}>{t.language}</span>
          </div>
          <select 
            value={currentLang} 
            onChange={(e) => setLanguage(e.target.value)}
            className={`bg-${textColor}-50 border border-${textColor}-200 text-sm p-2 rounded-lg outline-none focus:ring-2 focus:ring-${primaryColor}-500`}
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
          </select>
        </div>

        {/* Notifications */}
        <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
           <div className="flex items-center space-x-3">
             <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
               <AlertTriangle size={18} />
             </div>
             <span className={`font-medium text-${textColor}-700`}>{t.notifications}</span>
          </div>
          <button 
            onClick={handleNotificationToggle}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${notifications ? `bg-${primaryColor}-600` : `bg-${textColor}-300`}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${notifications ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Info */}
         <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
            <h3 className={`text-xs font-bold text-${textColor}-400 uppercase`}>{t.appInfo}</h3>
            <div className="flex justify-between text-sm">
              <span className={`text-${textColor}-600`}>{t.version}</span>
              <span className="font-medium">1.0.0 (MVP)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={`text-${textColor}-600`}>Support</span>
              <span className={`font-medium text-${primaryColor}-600`}>help@dztow.dz</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SettingsPage;
