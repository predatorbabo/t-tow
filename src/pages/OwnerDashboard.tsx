import { useState, useEffect } from 'react';
import { Truck, Check, X, Edit2 } from 'lucide-react';
import { TruckOwner } from '../types';
import { TRANSLATIONS } from '../constants';
import { useTheme } from '../contexts/ThemeContext';

const OwnerDashboard = ({ user, currentLang, onUpdateUser }: { user: TruckOwner, currentLang: string, onUpdateUser: (u: TruckOwner) => void }) => {
  const [isAvailable, setIsAvailable] = useState<boolean>(user.isAvailable);
  const [isEditingTruck, setIsEditingTruck] = useState(false);
  const [truckData, setTruckData] = useState({
    truckType: user.truckType || 'flatbed',
    truckBrand: user.truckBrand || '',
    plate: user.plate || '00123-116-25',
    serviceArea: user.serviceArea || 'Constantine + 20km'
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const t = TRANSLATIONS[currentLang as keyof typeof TRANSLATIONS];
  const { primaryColor, textColor } = useTheme();

  useEffect(() => {
     if (!isEditingTruck) {
         setTruckData({
            truckType: user.truckType || 'flatbed',
            truckBrand: user.truckBrand || '',
            plate: user.plate || '00123-116-25',
            serviceArea: user.serviceArea || 'Constantine + 20km'
         });
         setErrors({});
     }
  }, [isEditingTruck, user]);

  const validate = () => {
      const newErrors: {[key: string]: string} = {};
      if (!truckData.plate.trim()) newErrors.plate = t.required || "Required";
      if (!truckData.serviceArea.trim()) newErrors.serviceArea = t.required || "Required";
      if (!truckData.truckBrand.trim()) newErrors.truckBrand = t.required || "Required";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleSaveTruck = () => {
    if (validate()) {
      onUpdateUser({ 
        ...user, 
        truckType: truckData.truckType,
        truckBrand: truckData.truckBrand,
        plate: truckData.plate,
        serviceArea: truckData.serviceArea,
        isAvailable: isAvailable 
      });
      setIsEditingTruck(false);
    }
  };

  useEffect(() => {
     if (user.isAvailable !== isAvailable) {
         onUpdateUser({ ...user, isAvailable });
     }
  }, [isAvailable]);

  return (
    <div className={`p-4 pb-20 space-y-4 ${currentLang === 'ar' ? 'rtl' : ''}`}>
      <div className="bg-white p-6 rounded-xl shadow-sm text-center">
        <h2 className={`text-${textColor}-500 text-sm mb-2`}>{t.availabilityStatus}</h2>
        <div className="flex items-center justify-center space-x-4 mb-4">
          <span className={`font-bold ${!isAvailable ? `text-${textColor}-400` : `text-${textColor}-800`}`}>{t.offlineStatus}</span>
          <button 
            onClick={() => setIsAvailable(!isAvailable)}
            className={`w-16 h-8 rounded-full p-1 transition-colors duration-300 ${isAvailable ? 'bg-green-500' : `bg-${textColor}-300`}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isAvailable ? 'translate-x-8' : 'translate-x-0'}`} />
          </button>
          <span className={`font-bold ${isAvailable ? 'text-green-600' : `text-${textColor}-400`}`}>{t.online}</span>
        </div>
        {isAvailable && (
          <div className="flex items-center justify-center text-xs text-green-600 bg-green-50 py-1 px-3 rounded-full inline-block">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-ping mr-2"></div>
             Broadcasting location
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className={`font-bold text-${textColor}-800 flex items-center`}>
            <Truck size={18} className={`mr-2 text-${primaryColor}-500`} /> {t.myTruck}
          </h3>
          {isEditingTruck ? (
            <div className="flex space-x-2">
              <button onClick={handleSaveTruck} className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 flex items-center">
                <Check size={14} className="mr-1" /> {t.save}
              </button>
              <button onClick={() => setIsEditingTruck(false)} className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                <X size={16} />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditingTruck(true)} className={`text-${textColor}-400 hover:text-${primaryColor}-600`}>
              <Edit2 size={16} />
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex flex-col border-b pb-2">
            <div className="flex justify-between items-center h-8">
              <span className={`text-${textColor}-500 text-sm`}>{t.truckBrand || "Brand"}</span>
              {isEditingTruck ? (
                <input 
                  type="text" 
                  value={truckData.truckBrand}
                  onChange={(e) => setTruckData({...truckData, truckBrand: e.target.value})}
                  className={`text-sm border border-${textColor}-300 rounded p-1 w-32 text-right outline-none focus:ring-1 focus:ring-${primaryColor}-500 ${errors.truckBrand ? 'border-red-500' : ''}`}
                  placeholder="e.g. Isuzu"
                />
              ) : (
                <span className="font-medium text-sm">{truckData.truckBrand || "-"}</span>
              )}
            </div>
            {errors.truckBrand && <span className="text-[10px] text-red-500 text-right">{errors.truckBrand}</span>}
          </div>

          <div className="flex justify-between border-b pb-2 items-center h-8">
            <span className={`text-${textColor}-500 text-sm`}>{t.truckType}</span>
            {isEditingTruck ? (
              <select 
                value={truckData.truckType}
                onChange={(e) => setTruckData({...truckData, truckType: e.target.value as 'flatbed' | 'wheel_lift' | 'hook_and_chain'})}
                className={`text-sm border border-${textColor}-300 rounded p-1 outline-none`}
              >
                <option value="flatbed">Flatbed</option>
                <option value="hook_and_chain">Heavy Duty</option>
                <option value="wheel_lift">Wheel Lift</option>
              </select>
            ) : (
              <span className="font-medium text-sm">
                {user.truckType ? (user.truckType === 'flatbed' ? 'Flatbed' : user.truckType === 'hook_and_chain' ? 'Heavy Duty' : 'Wheel Lift') : 'Flatbed'}
              </span>
            )}
          </div>

          <div className="flex flex-col border-b pb-2">
             <div className="flex justify-between items-center h-8">
              <span className={`text-${textColor}-500 text-sm`}>{t.plate}</span>
              {isEditingTruck ? (
                <input 
                  type="text" 
                  value={truckData.plate}
                  onChange={(e) => setTruckData({...truckData, plate: e.target.value})}
                  className={`text-sm border border-${textColor}-300 rounded p-1 w-32 text-right outline-none focus:ring-1 focus:ring-${primaryColor}-500 ${errors.plate ? 'border-red-500' : ''}`}
                />
              ) : (
                <span className="font-medium text-sm">{truckData.plate}</span>
              )}
            </div>
            {errors.plate && <span className="text-[10px] text-red-500 text-right">{errors.plate}</span>}
          </div>

          <div className="flex flex-col">
            <div className="flex justify-between items-center h-8">
              <span className={`text-${textColor}-500 text-sm`}>{t.serviceArea}</span>
              {isEditingTruck ? (
                <input 
                  type="text" 
                  value={truckData.serviceArea}
                  onChange={(e) => setTruckData({...truckData, serviceArea: e.target.value})}
                  className={`text-sm border border-${textColor}-300 rounded p-1 w-32 text-right outline-none focus:ring-1 focus:ring-${primaryColor}-500 ${errors.serviceArea ? 'border-red-500' : ''}`}
                />
              ) : (
                <span className="font-medium text-sm">{truckData.serviceArea}</span>
              )}
            </div>
            {errors.serviceArea && <span className="text-[10px] text-red-500 text-right">{errors.serviceArea}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
