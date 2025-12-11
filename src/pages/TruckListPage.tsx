import { useState, useEffect } from 'react';
import { Filter, Truck, Phone } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { useTheme } from '../contexts/ThemeContext';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { TruckOwner } from '../types';

const TruckListPage = ({ currentLang }: any) => {
  const { primaryColor, textColor } = useTheme();
  const t = TRANSLATIONS[currentLang as keyof typeof TRANSLATIONS];
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline'>('all');
  const [trucks, setTrucks] = useState<TruckOwner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, 'trucks'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const trucksData: TruckOwner[] = [];
      snapshot.forEach(doc => {
        trucksData.push({ id: doc.id, ...doc.data() } as TruckOwner);
      });
      setTrucks(trucksData);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  const filteredTrucks = trucks.filter(t => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'online') return t.isAvailable;
    if (filterStatus === 'offline') return !t.isAvailable;
    return true;
  });

  return (
    <div className={`p-4 pb-20 ${currentLang === 'ar' ? 'rtl' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`font-bold text-lg text-${textColor}-800`}>{t.truckList || "Trucks in your area"}</h2>
        <div className="flex items-center space-x-2 bg-white px-2 py-1 rounded-lg border border-gray-200">
           <Filter size={14} className="text-gray-400" />
           <select 
             value={filterStatus}
             onChange={(e) => setFilterStatus(e.target.value as any)}
             className={`text-xs font-medium outline-none bg-transparent text-${textColor}-600`}
           >
             <option value="all">{t.showAll || "All"}</option>
             <option value="online">{t.showOnline || "Online"}</option>
             <option value="offline">{t.showOffline || "Offline"}</option>
           </select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center text-sm text-gray-500 py-8 bg-white rounded-lg shadow-sm">
          <Truck size={24} className="mx-auto mb-2 text-gray-300 animate-pulse" />
          Loading trucks...
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTrucks.map(truck => (
            <div key={truck.id} className={`bg-white p-4 rounded-lg shadow-sm border border-${textColor}-100 flex items-center justify-between`}>
              <div className="flex items-center space-x-3">
                 <div className={`relative`}>
                   <div className={`bg-${primaryColor}-100 p-3 rounded-full text-${primaryColor}-600`}>
                     <Truck size={20} />
                   </div>
                   <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${truck.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                 </div>
                 <div>
                   <h4 className={`font-bold text-sm text-${textColor}-800`}>{truck.companyName}</h4>
                   <div className={`text-xs text-${textColor}-500 flex flex-col`}>
                     <span>{truck.name}</span>
                     <span className="flex items-center mt-0.5">
                       <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${truck.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                       {truck.isAvailable ? t.online : t.offlineStatus}
                     </span>
                   </div>
                 </div>
              </div>
              <div className="flex flex-col items-end space-y-1">
                 <a 
                  href={`tel:${truck.phone}`}
                  className={`flex items-center justify-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-sm ${truck.isAvailable ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'}`}
                  onClick={e => !truck.isAvailable && e.preventDefault()}
                >
                  <Phone size={14} />
                  <span>{t.call}</span>
                </a>
                <span className={`text-[10px] text-${textColor}-400`}>{truck.phone}</span>
              </div>
            </div>
          ))}
          {filteredTrucks.length === 0 && (
            <div className="text-center text-sm text-gray-500 py-8 bg-white rounded-lg shadow-sm">
              <Truck size={24} className="mx-auto mb-2 text-gray-300" />
              No trucks found matching this filter.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TruckListPage;
