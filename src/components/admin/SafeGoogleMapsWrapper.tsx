
import React, { useEffect, useRef, useState } from 'react';

interface SafeGoogleMapsWrapperProps {
  children: React.ReactNode;
  onError?: (error: Error) => void;
}

const SafeGoogleMapsWrapper: React.FC<SafeGoogleMapsWrapperProps> = ({ 
  children, 
  onError 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadGoogleMaps = async () => {
      try {
        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
          if (isMounted) {
            setIsLoaded(true);
          }
          return;
        }

        // Load Google Maps API
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          if (isMounted) {
            setIsLoaded(true);
          }
        };

        script.onerror = (error) => {
          console.error('Failed to load Google Maps API:', error);
          if (isMounted) {
            setHasError(true);
            onError?.(new Error('Failed to load Google Maps API'));
          }
        };

        document.head.appendChild(script);

        // Store cleanup function
        cleanupRef.current = () => {
          try {
            if (script.parentNode) {
              script.parentNode.removeChild(script);
            }
          } catch (error) {
            console.warn('Script cleanup error:', error);
          }
        };

      } catch (error) {
        console.error('Error loading Google Maps:', error);
        if (isMounted) {
          setHasError(true);
          onError?.(error as Error);
        }
      }
    };

    loadGoogleMaps();

    return () => {
      isMounted = false;
      
      // Safe cleanup
      try {
        if (cleanupRef.current) {
          cleanupRef.current();
        }
      } catch (error) {
        console.warn('Cleanup error:', error);
      }
    };
  }, [onError]);

  if (hasError) {
    return (
      <div className="p-4 border border-red-200 rounded bg-red-50">
        <p className="text-red-600">Failed to load Google Maps. Please check your API key and try again.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="p-4 border border-gray-200 rounded bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="google-maps-wrapper">
      {children}
    </div>
  );
};

export default SafeGoogleMapsWrapper;
