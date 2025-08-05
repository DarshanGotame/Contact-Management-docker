'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/services/apiService';

export default function DebugAPI() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
    
    const testAPI = async () => {
      try {
        // Test login
        const loginResponse = await axiosInstance.post('/auth/login', {
          email: 'user@example.com',
          password: 'User123!'
        }, { isAuthRoute: false });
        
        console.log('Login successful:', loginResponse.data);
        setResult(loginResponse.data);
        
        // Save token for future requests
        if (loginResponse.data.data.accessToken) {
          localStorage.setItem('accessToken', loginResponse.data.data.accessToken);
        }
        
      } catch (err: any) {
        console.error('API Error:', err);
        setError(err.message || 'Unknown error');
      }
    };

    testAPI();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>API Debug Page</h1>
      <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL}</p>
      
      {error && (
        <div style={{ color: 'red', padding: '10px', border: '1px solid red' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {result && (
        <div style={{ color: 'green', padding: '10px', border: '1px solid green' }}>
          <strong>Success:</strong>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
