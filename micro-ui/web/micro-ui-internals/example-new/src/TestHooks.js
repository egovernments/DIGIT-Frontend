import React from 'react';
import { useGetInitData } from '@egovernments/digit-ui-libraries-new';

const TestHooksComponent = () => {
  console.log('TestHooks: Using direct hook import');

  // Try to use the hook directly
  try {
    console.log('TestHooks: Calling useGetInitData hook');
    const result = useGetInitData();
    console.log('TestHooks: useGetInitData() result:', result);
    
    return (
      <div>
        <h3>Hook Test (Direct Import)</h3>
        <p>Loading: {result.isLoading ? 'Yes' : 'No'}</p>
        <p>Data: {result.data ? 'Has data' : 'No data'}</p>
        <p>Error: {result.error ? result.error.message : 'No error'}</p>
        {result.data && (
          <details>
            <summary>View Data</summary>
            <pre style={{ fontSize: '12px', maxHeight: '200px', overflow: 'auto' }}>
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </details>
        )}
      </div>
    );
  } catch (error) {
    console.error('TestHooks: Error calling useGetInitData():', error);
    return <div>Error: {error.message}</div>;
  }
};

const TestHooks = () => {
  return <TestHooksComponent />;
};

export default TestHooks;