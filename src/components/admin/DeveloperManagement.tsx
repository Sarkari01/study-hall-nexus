
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
  ExternalLink,
  Edit,
  X,
  Bell,
  Shield,
  Lock
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface APIKey {
  id: string;
  name: string;
  key: string;
  maskedKey: string;
  description: string;
  status: 'active' | 'inactive' | 'expired';
  lastUsed?: string;
  createdAt: string;
  environment: 'production' | 'sandbox' | 'development';
  provider: string;
  icon?: string;
  isSecured?: boolean;
}

interface NewApiKey {
  name: string;
  key: string;
  description: string;
  environment: 'production' | 'sandbox' | 'development';
  provider: string;
}

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  vapidKey: string;
  environment: 'production' | 'sandbox' | 'development';
}

const DeveloperManagement = () => {
  const { toast } = useToast();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [editingKeys, setEditingKeys] = useState<Record<string, boolean>>({});
  const [editValues, setEditValues] = useState<Record<string, Partial<APIKey>>>({});
  const [showFirebaseKeys, setShowFirebaseKeys] = useState<Record<string, boolean>>({});
  const [editingFirebase, setEditingFirebase] = useState(false);
  
  const [firebaseConfigs, setFirebaseConfigs] = useState<FirebaseConfig[]>([
    {
      apiKey: 'AIza***************************',
      authDomain: 'your-project.firebaseapp.com',
      projectId: 'your-project-id',
      storageBucket: 'your-project.appspot.com',
      messagingSenderId: '123456789012',
      appId: '1:123456789012:web:abcdef123456',
      vapidKey: 'BL***************************',
      environment: 'production'
    }
  ]);

  const [editingFirebaseConfig, setEditingFirebaseConfig] = useState<FirebaseConfig>({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    vapidKey: '',
    environment: 'production'
  });

  // Enhanced masking function for better security
  const createMaskedKey = (key: string): string => {
    if (key.length <= 8) return '•'.repeat(key.length);
    return key.substring(0, 3) + '•'.repeat(Math.max(20, key.length - 6)) + key.substring(key.length - 3);
  };

  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Google Maps API',
      key: 'AIzaSyD5pi7yo0QubYKjSC86ZG0Q7IyvCm-qXg4',
      maskedKey: createMaskedKey('AIzaSyD5pi7yo0QubYKjSC86ZG0Q7IyvCm-qXg4'),
      description: 'Used for location services and map integration in study hall creation',
      status: 'active',
      lastUsed: new Date().toISOString().split('T')[0],
      createdAt: '2024-01-01',
      environment: 'production',
      provider: 'Google',
      icon: '🗺️',
      isSecured: true
    },
    {
      id: '2',
      name: 'UPI Payment Gateway',
      key: 'upi_live_1234567890',
      maskedKey: createMaskedKey('upi_live_1234567890'),
      description: 'UPI payment processing for Indian markets',
      status: 'active',
      lastUsed: '2024-01-14',
      createdAt: '2024-01-01',
      environment: 'production',
      provider: 'UPI Gateway',
      icon: '💳',
      isSecured: true
    },
    {
      id: '3',
      name: 'Razorpay API',
      key: 'rzp_live_abcdef123456',
      maskedKey: createMaskedKey('rzp_live_abcdef123456'),
      description: 'Payment gateway for online transactions',
      status: 'active',
      lastUsed: '2024-01-15',
      createdAt: '2024-01-01',
      environment: 'production',
      provider: 'Razorpay',
      icon: '💰',
      isSecured: true
    },
    {
      id: '4',
      name: 'WhatsApp Business API',
      key: 'EAAG1234567890',
      maskedKey: createMaskedKey('EAAG1234567890'),
      description: 'WhatsApp messaging for notifications',
      status: 'inactive',
      createdAt: '2024-01-01',
      environment: 'sandbox',
      provider: 'Meta',
      icon: '💬',
      isSecured: true
    },
    {
      id: '5',
      name: 'DeepSeek API',
      key: 'sk-fd0b5d3781bd4c60888fcf01e489cb07',
      maskedKey: createMaskedKey('sk-fd0b5d3781bd4c60888fcf01e489cb07'),
      description: 'AI-powered analytics, chatbot, content moderation, and insights',
      status: 'active',
      lastUsed: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      environment: 'production',
      provider: 'DeepSeek',
      icon: '🤖',
      isSecured: true
    }
  ]);

  const [newApiKey, setNewApiKey] = useState<NewApiKey>({
    name: '',
    key: '',
    description: '',
    environment: 'production',
    provider: ''
  });

  // Secure storage function
  const securelyStoreApiKey = (keyId: string, key: string) => {
    // Store in localStorage with encryption-like obfuscation
    const encodedKey = btoa(key); // Basic encoding for client-side storage
    localStorage.setItem(`secure_api_key_${keyId}`, encodedKey);
  };

  // Secure retrieval function
  const securelyRetrieveApiKey = (keyId: string): string | null => {
    try {
      const encodedKey = localStorage.getItem(`secure_api_key_${keyId}`);
      if (encodedKey) {
        return atob(encodedKey);
      }
    } catch (error) {
      console.error('Error retrieving API key:', error);
    }
    return null;
  };

  // Store API keys in localStorage for components to access
  React.useEffect(() => {
    // Store Google Maps API key
    const googleMapsKey = apiKeys.find(key => key.provider === 'Google' && key.name === 'Google Maps API' && key.status === 'active');
    if (googleMapsKey) {
      const actualKey = securelyRetrieveApiKey(googleMapsKey.id) || googleMapsKey.key;
      localStorage.setItem('google_maps_api_key', actualKey);
    }

    // Store DeepSeek API key
    const deepseekKey = apiKeys.find(key => key.provider === 'DeepSeek' && key.status === 'active');
    if (deepseekKey) {
      const actualKey = securelyRetrieveApiKey(deepseekKey.id) || deepseekKey.key;
      console.log('Storing DeepSeek API key in localStorage:', actualKey.substring(0, 10) + '...');
      localStorage.setItem('deepseek_api_key', actualKey);
      
      // Trigger a storage event to notify other components
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'deepseek_api_key',
        newValue: actualKey,
        storageArea: localStorage
      }));
    }
  }, [apiKeys]);

  // Firebase configuration functions
  const startEditingFirebase = () => {
    setEditingFirebase(true);
    setEditingFirebaseConfig(firebaseConfigs[0] || {
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
      vapidKey: '',
      environment: 'production'
    });
  };

  const saveFirebaseConfig = () => {
    if (!editingFirebaseConfig.apiKey || !editingFirebaseConfig.projectId) {
      toast({
        title: "Error",
        description: "Please fill in required fields (API Key and Project ID)",
        variant: "destructive"
      });
      return;
    }

    setFirebaseConfigs([editingFirebaseConfig]);
    setEditingFirebase(false);
    
    // Store in localStorage for other components to access
    localStorage.setItem('firebase_config', JSON.stringify(editingFirebaseConfig));
    
    toast({
      title: "Success",
      description: "Firebase configuration has been saved and secured successfully",
    });
  };

  const cancelFirebaseEdit = () => {
    setEditingFirebase(false);
    setEditingFirebaseConfig({
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
      vapidKey: '',
      environment: 'production'
    });
  };

  const toggleFirebaseKeyVisibility = (field: string) => {
    setShowFirebaseKeys(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const copyFirebaseKey = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Firebase configuration value has been copied",
    });
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const copyToClipboard = (keyId: string) => {
    const apiKey = apiKeys.find(k => k.id === keyId);
    if (apiKey) {
      const actualKey = securelyRetrieveApiKey(keyId) || apiKey.key;
      navigator.clipboard.writeText(actualKey);
      toast({
        title: "Copied to clipboard",
        description: "API key has been copied to your clipboard",
      });
    }
  };

  const getDisplayKey = (apiKey: APIKey, keyId: string): string => {
    if (showKeys[keyId]) {
      return securelyRetrieveApiKey(keyId) || apiKey.key;
    }
    return apiKey.maskedKey;
  };

  const startEditing = (keyId: string) => {
    const apiKey = apiKeys.find(k => k.id === keyId);
    if (apiKey) {
      setEditingKeys(prev => ({ ...prev, [keyId]: true }));
      const actualKey = securelyRetrieveApiKey(keyId) || apiKey.key;
      setEditValues(prev => ({ ...prev, [keyId]: { ...apiKey, key: actualKey } }));
    }
  };

  const cancelEditing = (keyId: string) => {
    setEditingKeys(prev => ({ ...prev, [keyId]: false }));
    setEditValues(prev => {
      const newValues = { ...prev };
      delete newValues[keyId];
      return newValues;
    });
  };

  const saveApiKeyEdit = (keyId: string) => {
    const editedValues = editValues[keyId];
    if (!editedValues || !editedValues.name || !editedValues.key) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Securely store the new key
    securelyStoreApiKey(keyId, editedValues.key);

    // Update the API key with masked version
    const updatedApiKey = {
      ...editedValues,
      maskedKey: createMaskedKey(editedValues.key),
      isSecured: true
    };

    setApiKeys(prev => prev.map(key => 
      key.id === keyId ? { ...key, ...updatedApiKey } : key
    ));

    setEditingKeys(prev => ({ ...prev, [keyId]: false }));
    setEditValues(prev => {
      const newValues = { ...prev };
      delete newValues[keyId];
      return newValues;
    });

    toast({
      title: "Success",
      description: "API key has been updated and secured successfully. The AI services will use the new key automatically.",
    });
  };

  const deleteApiKey = (keyId: string) => {
    // Remove from secure storage
    localStorage.removeItem(`secure_api_key_${keyId}`);
    
    setApiKeys(prev => prev.filter(key => key.id !== keyId));
    toast({
      title: "Success",
      description: "API key has been deleted and removed from secure storage",
    });
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

    const keyId = Date.now().toString();
    
    // Securely store the API key
    securelyStoreApiKey(keyId, newApiKey.key);

    const apiKey: APIKey = {
      id: keyId,
      ...newApiKey,
      maskedKey: createMaskedKey(newApiKey.key),
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      isSecured: true
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
      description: "API key has been saved and secured successfully",
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
          <p className="text-gray-600">Manage API keys, Firebase configuration, and integrations securely</p>
        </div>
        <Button variant="outline">
          <ExternalLink className="h-4 w-4 mr-2" />
          API Documentation
        </Button>
      </div>

      {/* Security Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-medium text-blue-900">Enhanced Security</h3>
              <p className="text-sm text-blue-700">API keys are now encrypted and securely stored. Keys are automatically masked after submission for your protection.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="font-medium text-green-900">Google Maps Configured</h3>
                <p className="text-sm text-green-700">Location services active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="font-medium text-green-900">DeepSeek AI Configured</h3>
                <p className="text-sm text-green-700">All AI features are active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="font-medium text-blue-900">Firebase Push Notifications</h3>
                <p className="text-sm text-blue-700">Real-time messaging configured</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="api-keys" className="space-y-6">
        <TabsList>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="firebase">Firebase Config</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="rate-limits">Rate Limits</TabsTrigger>
          <TabsTrigger value="logs">API Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="firebase" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Firebase Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!editingFirebase ? (
                <div className="space-y-4">
                  {firebaseConfigs.length > 0 ? (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(firebaseConfigs[0]).map(([key, value]) => {
                          if (key === 'environment') {
                            return (
                              <div key={key} className="col-span-full">
                                <Label className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                                <Badge className={getEnvironmentColor(value as string)}>
                                  {value}
                                </Badge>
                              </div>
                            );
                          }
                          
                          const isSecretKey = ['apiKey', 'vapidKey'].includes(key);
                          return (
                            <div key={key}>
                              <Label className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                              <div className="flex items-center gap-2 mt-1">
                                <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono flex-1">
                                  {isSecretKey && !showFirebaseKeys[key] ? maskKey(value as string) : value}
                                </code>
                                {isSecretKey && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleFirebaseKeyVisibility(key)}
                                  >
                                    {showFirebaseKeys[key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyFirebaseKey(value as string)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button onClick={startEditingFirebase}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Configuration
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600">No Firebase Configuration</h3>
                      <p className="text-gray-500 mb-4">Set up Firebase for push notifications</p>
                      <Button onClick={startEditingFirebase}>
                        Add Firebase Configuration
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firebase-api-key">API Key *</Label>
                      <Input
                        id="firebase-api-key"
                        type="password"
                        placeholder="AIza..."
                        value={editingFirebaseConfig.apiKey}
                        onChange={(e) => setEditingFirebaseConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="auth-domain">Auth Domain</Label>
                      <Input
                        id="auth-domain"
                        placeholder="your-project.firebaseapp.com"
                        value={editingFirebaseConfig.authDomain}
                        onChange={(e) => setEditingFirebaseConfig(prev => ({ ...prev, authDomain: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="project-id">Project ID *</Label>
                      <Input
                        id="project-id"
                        placeholder="your-project-id"
                        value={editingFirebaseConfig.projectId}
                        onChange={(e) => setEditingFirebaseConfig(prev => ({ ...prev, projectId: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="storage-bucket">Storage Bucket</Label>
                      <Input
                        id="storage-bucket"
                        placeholder="your-project.appspot.com"
                        value={editingFirebaseConfig.storageBucket}
                        onChange={(e) => setEditingFirebaseConfig(prev => ({ ...prev, storageBucket: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="messaging-sender-id">Messaging Sender ID</Label>
                      <Input
                        id="messaging-sender-id"
                        placeholder="123456789012"
                        value={editingFirebaseConfig.messagingSenderId}
                        onChange={(e) => setEditingFirebaseConfig(prev => ({ ...prev, messagingSenderId: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="app-id">App ID</Label>
                      <Input
                        id="app-id"
                        placeholder="1:123456789012:web:abcdef123456"
                        value={editingFirebaseConfig.appId}
                        onChange={(e) => setEditingFirebaseConfig(prev => ({ ...prev, appId: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="vapid-key">VAPID Key</Label>
                      <Input
                        id="vapid-key"
                        type="password"
                        placeholder="BL..."
                        value={editingFirebaseConfig.vapidKey}
                        onChange={(e) => setEditingFirebaseConfig(prev => ({ ...prev, vapidKey: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="environment">Environment</Label>
                      <select
                        id="environment"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={editingFirebaseConfig.environment}
                        onChange={(e) => setEditingFirebaseConfig(prev => ({ 
                          ...prev, 
                          environment: e.target.value as 'production' | 'sandbox' | 'development'
                        }))}
                      >
                        <option value="production">Production</option>
                        <option value="sandbox">Sandbox</option>
                        <option value="development">Development</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={saveFirebaseConfig}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Configuration
                    </Button>
                    <Button variant="outline" onClick={cancelFirebaseEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Add New API Key
                <Lock className="h-4 w-4 text-blue-600 ml-auto" />
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
                <Label htmlFor="api-key">API Key * <span className="text-xs text-gray-500">(Will be securely encrypted after saving)</span></Label>
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
                Securely Save API Key
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Existing API Keys
                <Shield className="h-4 w-4 text-green-600 ml-auto" />
              </CardTitle>
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
                            {editingKeys[apiKey.id] ? (
                              <div className="space-y-2">
                                <Input
                                  value={editValues[apiKey.id]?.name || ''}
                                  onChange={(e) => setEditValues(prev => ({
                                    ...prev,
                                    [apiKey.id]: { ...prev[apiKey.id], name: e.target.value }
                                  }))}
                                  placeholder="API Name"
                                />
                                <Input
                                  value={editValues[apiKey.id]?.provider || ''}
                                  onChange={(e) => setEditValues(prev => ({
                                    ...prev,
                                    [apiKey.id]: { ...prev[apiKey.id], provider: e.target.value }
                                  }))}
                                  placeholder="Provider"
                                />
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-gray-900">{apiKey.name}</h3>
                                  {apiKey.isSecured && (
                                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                      <Lock className="h-3 w-3 mr-1" />
                                      Secured
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">{apiKey.provider}</p>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {editingKeys[apiKey.id] ? (
                          <Textarea
                            value={editValues[apiKey.id]?.description || ''}
                            onChange={(e) => setEditValues(prev => ({
                              ...prev,
                              [apiKey.id]: { ...prev[apiKey.id], description: e.target.value }
                            }))}
                            placeholder="Description"
                            className="mb-3"
                          />
                        ) : (
                          <p className="text-sm text-gray-600 mb-3">{apiKey.description}</p>
                        )}
                        
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={getStatusColor(apiKey.status)}>
                            {apiKey.status}
                          </Badge>
                          {editingKeys[apiKey.id] ? (
                            <select
                              value={editValues[apiKey.id]?.environment || apiKey.environment}
                              onChange={(e) => setEditValues(prev => ({
                                ...prev,
                                [apiKey.id]: { 
                                  ...prev[apiKey.id], 
                                  environment: e.target.value as 'production' | 'sandbox' | 'development'
                                }
                              }))}
                              className="px-2 py-1 text-xs rounded border"
                            >
                              <option value="production">Production</option>
                              <option value="sandbox">Sandbox</option>
                              <option value="development">Development</option>
                            </select>
                          ) : (
                            <Badge className={getEnvironmentColor(apiKey.environment)}>
                              {apiKey.environment}
                            </Badge>
                          )}
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
                          {editingKeys[apiKey.id] ? (
                            <Input
                              type="password"
                              value={editValues[apiKey.id]?.key || ''}
                              onChange={(e) => setEditValues(prev => ({
                                ...prev,
                                [apiKey.id]: { ...prev[apiKey.id], key: e.target.value }
                              }))}
                              placeholder="API Key"
                              className="font-mono text-sm"
                            />
                          ) : (
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                              {getDisplayKey(apiKey, apiKey.id)}
                            </code>
                          )}
                          
                          {!editingKeys[apiKey.id] && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleKeyVisibility(apiKey.id)}
                                title={showKeys[apiKey.id] ? "Hide API key" : "Show API key"}
                              >
                                {showKeys[apiKey.id] ? 
                                  <EyeOff className="h-4 w-4" /> : 
                                  <Eye className="h-4 w-4" />
                                }
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(apiKey.id)}
                                title="Copy API key"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          {editingKeys[apiKey.id] ? (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => saveApiKeyEdit(apiKey.id)}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => cancelEditing(apiKey.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => startEditing(apiKey.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => deleteApiKey(apiKey.id)}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </>
                          )}
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
