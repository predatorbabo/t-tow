import React, { useState, useEffect } from 'react';
import { Navigation, Layers, AlertTriangle, Phone } from 'lucide-react';
import MapVisualizer from '../components/map/MapVisualizer';
import { TruckOwner, RequestStatus, AssistanceRequest, User } from '../types';
import { CONSTANTINE_COORDS, TRANSLATIONS } from '../constants';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../hooks/useNotifications';
import { TruckTypeBadge } from '../components/TruckTypeBadge';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, getDoc, GeoPoint } from 'firebase/firestore';

interface HomePageProps {
  user: User;
  currentLang: 'en' | 'fr' | 'ar';
  activeRequest: AssistanceRequest | null;
  setActiveRequest: (request: AssistanceRequest | null) => void;
}

const HomePage: React.FC<HomePageProps> = ({ user, currentLang, activeRequest, setActiveRequest }) => {
  const t = TRANSLATIONS[currentLang as keyof typeof TRANSLATIONS];
  const { primaryColor, textColor } = useTheme();
  const { notify } = useNotifications();
  const [radius, setRadius] = useState(10);
  const [showTraffic, setShowTraffic] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline'>('all');
  const [mapStyle, setMapStyle] = useState<'normal' | 'roads'>('normal');
  const [selectedTruck, setSelectedTruck] = useState<TruckOwner | null>(null);
  const [userLoc, setUserLoc] = useState(CONSTANTINE_COORDS);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [trucks, setTrucks] = useState<TruckOwner[]>([]);

  useEffect(() => {
    setIsMapLoading(true);
    const q = query(collection(db, 'trucks'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const trucksData: TruckOwner[] = [];
      snapshot.forEach(doc => {
        trucksData.push({ id: doc.id, ...doc.data() } as TruckOwner);
      });
      setTrucks(trucksData);
      setIsMapLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (activeRequest && activeRequest.status === RequestStatus.PENDING) {
      const timer = setTimeout(async () => {
        if (activeRequest.id) {
          const requestRef = doc(db, 'assistanceRequests', activeRequest.id);
          await updateDoc(requestRef, { status: RequestStatus.ACCEPTED });
          notify(t.driverAcceptedTitle, { body: t.driverAcceptedBody });
        }
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [activeRequest, notify, t]);

  const handleRequest = async () => {
    setIsRequesting(true);
    try {
      const newRequest: Omit<AssistanceRequest, 'id'> = {
        userId: user.id,
        userLocation: new GeoPoint(userLoc.lat, userLoc.lng),
        note: '',
        status: RequestStatus.PENDING,
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, 'assistanceRequests'), newRequest);
      const newRequestDoc = await getDoc(docRef);
      setActiveRequest({ id: newRequestDoc.id, ...newRequestDoc.data() } as AssistanceRequest);
      notify(t.requestCreatedTitle, { body: t.requestCreatedBody });
    } catch (error) {
      console.error("Error creating request:", error);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleCancel = async () => {
    if (activeRequest && activeRequest.id) {
      const requestRef = doc(db, 'assistanceRequests', activeRequest.id);
      await updateDoc(requestRef, { status: RequestStatus.CANCELLED });
      setActiveRequest(null);
      setSelectedTruck(null);
    }
  };

  const filteredTrucks = trucks.filter(t => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'online') return t.isAvailable;
    if (filterStatus === 'offline') return !t.isAvailable;
    return true;
  });

  return (
    <div className={`pb-20 ${currentLang === 'ar' ? 'rtl' : ''}`}>
      <div className="bg-white p-4 shadow-sm z-40 sticky top-16">
        <div className="flex items-center justify-between mb-2">
           <div className={`flex items-center space-x-2 text-sm text-${textColor}-600`}>
             <Navigation size={16} className={`text-${primaryColor}-500`} />
             <span>Constantine, Algeria</span>
           </div>
           <div className="flex space-x-2">
             <select 
               value={filterStatus}
               onChange={(e) => setFilterStatus(e.target.value as any)}
               className={`text-xs p-1.5 rounded-md border border-${textColor}-200 outline-none bg-white text-${textColor}-600`}
             >
               <option value="all">{t.showAll || "All"}</option>
               <option value="online">{t.showOnline || "Online"}</option>
               <option value="offline">{t.showOffline || "Offline"}</option>
             </select>
             
             <button 
               onClick={() => setShowTraffic(!showTraffic)}
               className={`p-1.5 rounded-md transition-colors ${showTraffic ? `bg-${primaryColor}-100 text-${primaryColor}-600` : `bg-${textColor}-100 text-${textColor}-400`}`}
               title="Toggle Traffic"
             >
               <Layers size={16} />
             </button>
           </div>
        </div>
        
        {!activeRequest && (
          <div className="flex items-center space-x-2">
            <span className={`text-xs font-bold text-${textColor}-500`}>Radius: {radius}km</span>
            <input 
              type="range" 
              min="5" 
              max="50" 
              value={radius} 
              onChange={(e) => setRadius(Number(e.target.value))}
              className={`flex-1 h-2 bg-${textColor}-200 rounded-lg appearance-none cursor-pointer`}
            />
          </div>
        )}
      </div>

      <div className="p-4 relative">
        <MapVisualizer 
          userLocation={userLoc} 
          trucks={activeRequest ? filteredTrucks : filteredTrucks} 
          onTruckClick={setSelectedTruck}
          isLoading={isMapLoading}
          primaryColor={primaryColor}
          mapStyle={mapStyle}
          onMapStyleChange={setMapStyle}
        />
        {showTraffic && (
          <div className="absolute top-6 right-6 bg-white/90 text-[10px] px-2 py-1 rounded shadow text-red-500 font-bold border border-red-200 z-30">
            Heavy Traffic (N3)
          </div>
        )}
      </div>

      <div className="px-4">
        {activeRequest ? (
          <div className={`bg-white rounded-xl shadow-lg border-l-4 border-yellow-500 p-4 animate-fade-in`}>
             <div className="flex justify-between items-start mb-4">
               <div>
                 <h2 className={`font-bold text-lg text-${textColor}-800`}>{t.status}: {activeRequest.status}</h2>
                 <p className={`text-sm text-${textColor}-500`}>Request ID: #{activeRequest.id.substr(0, 4)}</p>
               </div>
               <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold animate-pulse">
                 Active
               </div>
             </div>
             
             <p className={`text-${textColor}-600 text-sm mb-4`}>
               {filteredTrucks.length} trucks notified in your area.
             </p>

             <button 
              onClick={handleCancel}
              className={`w-full bg-${textColor}-100 text-${textColor}-700 py-2 rounded-lg font-medium`}
             >
               {t.cancel}
             </button>
          </div>
        ) : (
          <button 
            onClick={handleRequest}
            disabled={isRequesting || isMapLoading}
            className={`w-full bg-red-600 text-white py-4 rounded-xl shadow-lg shadow-red-200 font-bold text-lg flex items-center justify-center space-x-2 transform transition active:scale-95 ${isMapLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isRequesting ? (
               <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
               <>
                 <AlertTriangle size={24} />
                 <span>{t.requestTow}</span>
               </>
            )}
          </button>
        )}
      </div>

      <div className="mt-6 px-4">
        <h3 className={`font-bold text-${textColor}-700 mb-3`}>{t.findingTrucks} ({filteredTrucks.length})</h3>
        {isMapLoading ? (
           <div className="space-y-3">
             {[1,2,3].map(i => (
               <div key={i} className={`bg-white p-4 rounded-lg shadow-sm border border-${textColor}-100 flex items-center space-x-3 animate-pulse`}>
                  <div className={`w-10 h-10 bg-${textColor}-200 rounded-full`}></div>
                  <div className="flex-1 space-y-2">
                    <div className={`h-4 bg-${textColor}-200 rounded w-1/3`}></div>
                    <div className={`h-3 bg-${textColor}-200 rounded w-1/4`}></div>
                  </div>
               </div>
             ))}
           </div>
        ) : (
          <div className="space-y-3">
            {filteredTrucks.map(truck => (
              <div key={truck.id} className={`bg-white p-4 rounded-lg shadow-sm border border-${textColor}-100 flex items-center justify-between`}>
                <div className="flex items-center space-x-3">
                  <div className={`bg-${primaryColor}-100 p-2 rounded-full text-${primaryColor}-600`}>
                    <Truck size={20} />
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm text-${textColor}-800`}>{truck.companyName}</h4>
                    <p className={`text-xs text-${textColor}-500 flex items-center`}>
                      <TruckTypeBadge type={truck.truckType} />
                      <span className="mx-1">•</span>
                      {Math.abs(truck.location.latitude - userLoc.lat) * 100 < 1 ? '0.5' : '1.2'} {t.distance}
                    </p>
                  </div>
                </div>
                <a 
                  href={`tel:${truck.phone}`}
                  className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 shadow-md shadow-green-200"
                >
                  <Phone size={18} />
                </a>
              </div>
            ))}
            {filteredTrucks.length === 0 && (
              <div className="text-center text-sm text-gray-500 py-4">
                No trucks match your filter.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default HomePage;
