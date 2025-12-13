import React, { useState, useEffect, useRef } from 'react';
import { Loader } from 'lucide-react';
import { TruckOwner } from '../types';
import { GeoPoint } from 'firebase/firestore';

interface MapVisualizerProps {
  userLocation: { lat: number, lng: number };
  trucks: TruckOwner[];
  onTruckClick: (truck: TruckOwner) => void;
  isLoading: boolean;
  primaryColor: string;
  mapStyle: 'normal' | 'roads';
  onMapStyleChange: (style: 'normal' | 'roads') => void;
}

const MapVisualizer: React.FC<MapVisualizerProps> = ({ 
  userLocation, 
  trucks, 
  onTruckClick, 
  isLoading, 
  primaryColor, 
  mapStyle, 
  onMapStyleChange 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  useEffect(() => {
    if (window.google) {
      setIsApiLoaded(true);
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.onload = () => setIsApiLoaded(true);
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (isApiLoaded && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 12,
        disableDefaultUI: true,
        styles: mapStyle === 'roads' ? [{ featureType: 'road', stylers: [{ visibility: 'on' }] }] : [],
      });

      new window.google.maps.Marker({
        position: userLocation,
        map,
        title: 'You are here',
      });

      trucks.forEach(truck => {
        const truckPosition = {
          lat: truck.location.latitude,
          lng: truck.location.longitude,
        };
        const marker = new window.google.maps.Marker({
          position: truckPosition,
          map,
          title: truck.companyName,
          icon: {
            url: truck.isAvailable ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
          },
        });
        marker.addListener('click', () => onTruckClick(truck));
      });
    }
  }, [isApiLoaded, userLocation, trucks, onTruckClick, mapStyle, primaryColor]);

  if (isLoading || !isApiLoaded) {
    return (
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
        <Loader className="animate-spin text-gray-500" size={32} />
        <p className="ml-2 text-gray-500">Loading Map...</p>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-64 rounded-lg shadow-md" />;
};

export default MapVisualizer;
