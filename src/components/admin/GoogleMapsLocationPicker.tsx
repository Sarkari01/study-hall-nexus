
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Search } from "lucide-react";
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
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData>(
    initialLocation || { lat: 28.6315, lng: 77.2167, address: 'New Delhi, India' }
  );
  const { toast } = useToast();

  useEffect(() => {
    const initializeMap = async () => {
      try {
        // Get Google Maps API key from localStorage (set by Developer Management)
        const apiKey = localStorage.getItem('google_maps_api_key') || 'AIzaSyD5pi7yo0QubYKjSC86ZG0Q7IyvCm-qXg4';
        
        const loader = new Loader({
          apiKey: apiKey,
          version: 'weekly',
          libraries: ['places', 'geometry']
        });

        await loader.load();
        
        if (!mapRef.current || !window.google) return;

        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: { lat: currentLocation.lat, lng: currentLocation.lng },
          zoom: 15,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });

        // Create initial marker
        const markerInstance = new window.google.maps.Marker({
          position: { lat: currentLocation.lat, lng: currentLocation.lng },
          map: mapInstance,
          draggable: true,
          title: 'Study Hall Location'
        });

        // Add click listener to map
        mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            updateLocation(lat, lng, mapInstance, markerInstance);
          }
        });

        // Add drag listener to marker
        markerInstance.addListener('dragend', (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            updateLocation(lat, lng, mapInstance, markerInstance);
          }
        });

        setMap(mapInstance);
        setMarker(markerInstance);
        setIsLoaded(true);

      } catch (error) {
        console.error('Error loading Google Maps:', error);
        toast({
          title: "Error",
          description: "Failed to load Google Maps. Please check your API key.",
          variant: "destructive"
        });
      }
    };

    initializeMap();
  }, []);

  const updateLocation = async (lat: number, lng: number, mapInstance: google.maps.Map, markerInstance: google.maps.Marker) => {
    try {
      // Update marker position
      markerInstance.setPosition({ lat, lng });
      
      // Reverse geocoding to get address
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
    if (!map || !searchQuery.trim() || !window.google) return;

    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({ address: searchQuery });

      if (response.results && response.results[0]) {
        const location = response.results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        
        map.setCenter({ lat, lng });
        map.setZoom(15);
        
        if (marker) {
          updateLocation(lat, lng, map, marker);
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
        description: "Failed to search for the location.",
        variant: "destructive"
      });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          if (map && marker) {
            map.setCenter({ lat, lng });
            map.setZoom(15);
            updateLocation(lat, lng, map, marker);
          }
        },
        (error) => {
          console.error('Error getting current location:', error);
          toast({
            title: "Location error",
            description: "Unable to get your current location.",
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Not supported",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Select Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
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
            <Button onClick={getCurrentLocation} variant="outline" size="sm">
              📍 Current
            </Button>
          </div>
        </div>

        {/* Map Container */}
        <div className="space-y-2">
          <div 
            ref={mapRef} 
            className="w-full h-64 bg-gray-100 rounded-lg border"
            style={{ minHeight: '300px' }}
          />
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading Google Maps...</p>
              </div>
            </div>
          )}
        </div>

        {/* Selected Location Info */}
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
