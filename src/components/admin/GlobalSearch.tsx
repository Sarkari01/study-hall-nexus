
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, User, Building2, Calendar } from "lucide-react";

interface SearchResult {
  id: string;
  type: 'student' | 'study_hall' | 'booking';
  title: string;
  subtitle: string;
  status?: string;
}

const GlobalSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'student',
      title: 'Rajesh Kumar',
      subtitle: 'rajesh.kumar@email.com • +91 9876543210',
      status: 'active'
    },
    {
      id: '2',
      type: 'study_hall',
      title: 'Central Study Hub',
      subtitle: 'Delhi • 50 seats • ₹250/day',
      status: 'active'
    },
    {
      id: '3',
      type: 'booking',
      title: 'BOK000123',
      subtitle: 'Rajesh Kumar • Central Study Hub • Today',
      status: 'confirmed'
    }
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setIsSearching(true);
      // Simulate API call
      setTimeout(() => {
        setSearchResults(mockResults.filter(result => 
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.subtitle.toLowerCase().includes(query.toLowerCase())
        ));
        setIsSearching(false);
        setShowResults(true);
      }, 500);
    } else {
      setShowResults(false);
      setSearchResults([]);
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'student':
        return <User className="h-4 w-4 text-blue-600" />;
      case 'study_hall':
        return <Building2 className="h-4 w-4 text-green-600" />;
      case 'booking':
        return <Calendar className="h-4 w-4 text-orange-600" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative">
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search students, study halls, bookings..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => {
                setSearchQuery('');
                setShowResults(false);
                setSearchResults([]);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {showResults && (
        <Card className="absolute top-12 left-0 right-0 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {isSearching ? (
              <div className="p-4 text-center text-gray-500">
                Searching...
              </div>
            ) : searchResults.length > 0 ? (
              <div className="divide-y">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getResultIcon(result.type)}
                        <div>
                          <div className="font-medium text-gray-900">
                            {result.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {result.subtitle}
                          </div>
                        </div>
                      </div>
                      {result.status && (
                        <Badge className={getStatusColor(result.status)}>
                          {result.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No results found for "{searchQuery}"
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GlobalSearch;
