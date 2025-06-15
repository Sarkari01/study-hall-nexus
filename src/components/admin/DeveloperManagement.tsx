import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Key, 
  Eye, 
  EyeOff, 
  Save, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  Copy,
  ExternalLink
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface APIKey {
  id: string;
  name: string;
  key: string;
  description: string;
  status: 'active' | 'inactive' | 'expired';
  lastUsed?: string;
  createdAt: string;
  environment: 'production' | 'sandbox' | 'development';
  provider: string;
  icon?: string;
}

const DeveloperManagement = () => {
  const { toast } = useToast();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Google Maps API',
      key: 'AIzaSyC1234567890abcdef',
      description: 'Used for location services and map integration',
      status: 'active',
      lastUsed: '2024-01-15',
      createdAt: '2024-01-01',
      environment: 'production',
      provider: 'Google',
      icon: '🗺️'
    },
    {
      id: '2',
      name: 'UPI Payment Gateway',
      key: 'upi_live_1234567890',
      description: 'UPI payment processing for Indian markets',
      status: 'active',
      lastUsed: '2024-01-14',
      createdAt: '2024-01-01',
      environment: 'production',
      provider: 'UPI Gateway',
      icon: '💳'
    },
    {
      id: '3',
      name: 'Razorpay API',
      key: 'rzp_live_abcdef123456',
      description: 'Payment gateway for online transactions',
      status: 'active',
      lastUsed: '2024-01-15',
      createdAt: '2024-01-01',
      environment: 'production',
      provider: 'Razorpay',
      icon: '💰'
    },
    {
      id: '4',
      name: 'WhatsApp Business API',
      key: 'EAAG1234567890',
      description: 'WhatsApp messaging for notifications',
      status: 'inactive',
      createdAt: '2024-01-01',
      environment: 'sandbox',
      provider: 'Meta',
      icon: '💬'
    },
    {
      id: '5',
      name: 'DeepSeek API',
      key: 'dsk_1234567890abcdef',
      description: 'AI-powered analytics and insights',
      status: 'active',
      lastUsed: '2024-01-15',
      createdAt: '2024-01-01',
      environment: 'production',
      provider: 'DeepSeek',
      icon: '🤖'
    }
  ]);

  const [newApiKey, setNewApiKey] = useState({
    name: '',
    key: '',
    description: '',
    environment: 'production' as const,
    provider: ''
  });

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "API key has been copied to your clipboard",
    });
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  const handleSaveApiKey = () => {
    if (!newApiKey.name || !newApiKey.key) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const apiKey: APIKey = {
      id: Date.now().toString(),
      ...newApiKey,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setApiKeys(prev => [...prev, apiKey]);
    setNewApiKey({
      name: '',
      key: '',
      description: '',
      environment: 'production',
      provider: ''
    });

    toast({
      title: "Success",
      description: "API key has been saved successfully",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'production': return 'bg-blue-100 text-blue-800';
      case 'sandbox': return 'bg-yellow-100 text-yellow-800';
      case 'development': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Developer Management</h2>
          <p className="text-gray-600">Manage API keys and integrations</p>
        </div>
        <Button variant="outline">
          <ExternalLink className="h-4 w-4 mr-2" />
          API Documentation
        </Button>
      </div>

      <Tabs defaultValue="api-keys" className="space-y-6">
        <TabsList>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="rate-limits">Rate Limits</TabsTrigger>
          <TabsTrigger value="logs">API Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys" className="space-y-6">
          {/* Add New API Key */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Add New API Key
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="api-name">API Name *</Label>
                  <Input
                    id="api-name"
                    placeholder="e.g., Google Maps API"
                    value={newApiKey.name}
                    onChange={(e) => setNewApiKey(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="provider">Provider</Label>
                  <Input
                    id="provider"
                    placeholder="e.g., Google, Razorpay"
                    value={newApiKey.provider}
                    onChange={(e) => setNewApiKey(prev => ({ ...prev, provider: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="api-key">API Key *</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your API key"
                  value={newApiKey.key}
                  onChange={(e) => setNewApiKey(prev => ({ ...prev, key: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this API is used for"
                  value={newApiKey.description}
                  onChange={(e) => setNewApiKey(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="environment">Environment</Label>
                <select
                  id="environment"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newApiKey.environment}
                  onChange={(e) => setNewApiKey(prev => ({ 
                    ...prev, 
                    environment: e.target.value as 'production' | 'sandbox' | 'development'
                  }))}
                >
                  <option value="production">Production</option>
                  <option value="sandbox">Sandbox</option>
                  <option value="development">Development</option>
                </select>
              </div>

              <Button onClick={handleSaveApiKey} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save API Key
              </Button>
            </CardContent>
          </Card>

          {/* Existing API Keys */}
          <Card>
            <CardHeader>
              <CardTitle>Existing API Keys</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{apiKey.icon}</span>
                          <div>
                            <h3 className="font-medium text-gray-900">{apiKey.name}</h3>
                            <p className="text-sm text-gray-600">{apiKey.provider}</p>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{apiKey.description}</p>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={getStatusColor(apiKey.status)}>
                            {apiKey.status}
                          </Badge>
                          <Badge className={getEnvironmentColor(apiKey.environment)}>
                            {apiKey.environment}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>Created: {apiKey.createdAt}</span>
                          {apiKey.lastUsed && (
                            <span>• Last used: {apiKey.lastUsed}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                            {showKeys[apiKey.id] ? apiKey.key : maskApiKey(apiKey.key)}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                          >
                            {showKeys[apiKey.id] ? 
                              <EyeOff className="h-4 w-4" /> : 
                              <Eye className="h-4 w-4" />
                            }
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(apiKey.key)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">Webhook management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rate-limits">
          <Card>
            <CardHeader>
              <CardTitle>API Rate Limits</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">Rate limit configuration coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>API Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">API logs viewer coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeveloperManagement;
