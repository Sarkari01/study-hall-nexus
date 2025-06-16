
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Search, AlertCircle, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

interface GoogleMapsLocationPickerProps {
  initialLocation?: LocationData;
  onLocationSelect: (location: LocationData) => void;
}

const GoogleMapsLocationPicker: React.FC<GoogleMapsLocationPickerProps> = ({
  initialLocation,
  onLocationSelect
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const loadingRef = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [mapError, setMapError] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<LocationData>(
    initialLocation || { lat: 28.6315, lng: 77.2167, address: 'New Delhi, India' }
  );
  const { toast } = useToast();

  // Cleanup function
  const cleanupMap = () => {
    try {
      if (markerRef.current) {
        markerRef.current.map = null;
        markerRef.current = null;
      }
      
      if (mapInstanceRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(mapInstanceRef.current);
        mapInstanceRef.current = null;
      }
    } catch (error) {
      console.warn('Map cleanup warning:', error);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    
    const initializeMap = async () => {
      if (loadingRef.current || !isMountedRef.current) return;
      
      try {
        loadingRef.current = true;
        
        const apiKey = localStorage.getItem('google_maps_api_key');
        
        if (!apiKey || apiKey.trim() === '') {
          if (isMountedRef.current) {
            setMapError('Google Maps API key not configured. Please set your Google Maps API key in Developer Management settings.');
          }
          return;
        }
        
        const loader = new Loader({
          apiKey: apiKey,
          version: 'weekly',
          libraries: ['places', 'geometry', 'marker']
        });

        await loader.load();
        
        if (!mapRef.current || !window.google || !isMountedRef.current) {
          return;
        }

        // Create map instance
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: { lat: currentLocation.lat, lng: currentLocation.lng },
          zoom: 15,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          mapId: 'DEMO_MAP_ID',
        });

        // Create marker
        const markerInstance = new window.google.maps.marker.AdvancedMarkerElement({
          position: { lat: currentLocation.lat, lng: currentLocation.lng },
          map: mapInstance,
          title: 'Study Hall Location',
          gmpDraggable: true,
        });

        // Add event listeners
        mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
          if (event.latLng && isMountedRef.current) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            updateLocation(lat, lng, mapInstance, markerInstance);
          }
        });

        markerInstance.addListener('dragend', (event: google.maps.MapMouseEvent) => {
          if (event.latLng && isMountedRef.current) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            updateLocation(lat, lng, mapInstance, markerInstance);
          }
        });

        if (isMountedRef.current) {
          mapInstanceRef.current = mapInstance;
          markerRef.current = markerInstance;
          setIsLoaded(true);
          setMapError('');
        }

      } catch (error) {
        console.error('Error loading Google Maps:', error);
        if (isMountedRef.current) {
          if (error instanceof Error) {
            if (error.message.includes('InvalidKeyMapError')) {
              setMapError('Invalid Google Maps API key. Please check your API key in Developer Management settings.');
            } else if (error.message.includes('RefererNotAllowedMapError')) {
              setMapError('Google Maps API key domain restriction error. Please configure your API key for this domain.');
            } else {
              setMapError(`Google Maps loading error: ${error.message}`);
            }
          } else {
            setMapError('Failed to load Google Maps. Please check your API key and settings.');
          }
        }
      } finally {
        loadingRef.current = false;
      }
    };

    initializeMap();

    return () => {
      isMountedRef.current = false;
      cleanupMap();
    };
  }, []);

  const updateLocation = async (lat: number, lng: number, mapInstance: google.maps.Map, markerInstance: google.maps.marker.AdvancedMarkerElement) => {
    try {
      markerInstance.position = { lat, lng };
      
      if (!window.google) return;
      
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({ location: { lat, lng } });
      
      let address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      if (response.results && response.results[0]) {
        address = response.results[0].formatted_address;
      }

      const locationData = { lat, lng, address };
      setCurrentLocation(locationData);
      onLocationSelect(locationData);

    } catch (error) {
      console.error('Error getting address:', error);
      const locationData = { lat, lng, address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` };
      setCurrentLocation(locationData);
      onLocationSelect(locationData);
    }
  };

  const searchLocation = async () => {
    if (!mapInstanceRef.current || !searchQuery.trim() || !window.google) return;

    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({ address: searchQuery });

      if (response.results && response.results[0]) {
        const location = response.results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        
        mapInstanceRef.current.setCenter({ lat, lng });
        mapInstanceRef.current.setZoom(15);
        
        if (markerRef.current) {
          updateLocation(lat, lng, mapInstanceRef.current, markerRef.current);
        }
      } else {
        toast({
          title: "Location not found",
          description: "Please try a different search query.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error searching location:', error);
      toast({
        title: "Search error",
        description: "Failed to search for the location. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Not supported",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive"
      });
      return;
    }

    setIsLoadingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setCenter({ lat, lng });
          mapInstanceRef.current.setZoom(15);
          updateLocation(lat, lng, mapInstanceRef.current, markerRef.current);
        }
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        
        let errorMessage = "Unable to get your current location.";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        
        toast({
          title: "Location error",
          description: errorMessage,
          variant: "destructive"
        });
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000
      }
    );
  };

  const openDeveloperSettings = () => {
    window.location.href = '/admin?tab=developer-management';
  };

  if (mapError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Google Maps Configuration Error
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-sm">{mapError}</p>
          <Button 
            onClick={openDeveloperSettings}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Configure API Key
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Select Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="location-search">Search Location</Label>
            <Input
              id="location-search"
              placeholder="Enter address, landmark, or place name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
            />
          </div>
          <div className="flex gap-2 items-end">
            <Button onClick={searchLocation} size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Button 
              onClick={getCurrentLocation} 
              variant="outline" 
              size="sm"
              disabled={isLoadingLocation}
            >
              {isLoadingLocation ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              ) : (
                "📍 Current"
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div 
            ref={mapRef} 
            className="w-full h-64 bg-gray-100 rounded-lg border relative"
            style={{ minHeight: '300px' }}
          >
            {!isLoaded && !mapError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Loading Google Maps...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <Label className="text-sm font-medium">Selected Location:</Label>
          <p className="text-sm text-gray-700 mt-1">{currentLocation.address}</p>
          <p className="text-xs text-gray-500">
            Coordinates: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
          </p>
        </div>

        <div className="text-xs text-gray-500">
          💡 Click on the map or drag the marker to select a precise location
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleMapsLocationPicker;
