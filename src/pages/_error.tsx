import React from 'react';
import { useRouter } from 'next/router';

interface ErrorProps {
  statusCode?: number;
}

const Error: React.FC<ErrorProps> = ({ statusCode }) => {
  const router = useRouter();

  const getErrorMessage = () => {
    switch (statusCode) {
      case 404:
        return 'Page not found';
      case 500:
        return 'Internal server error';
      default:
        return 'An error occurred';
    }
  };

  const getErrorDescription = () => {
    switch (statusCode) {
      case 404:
        return 'The page you are looking for does not exist.';
      case 500:
        return 'Something went wrong on our end. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      padding: '24px',
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '16px', color: statusCode === 404 ? '#1890ff' : '#ff4d4f' }}>
          {statusCode || 'Error'}
        </h1>
        <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#666' }}>
          {getErrorMessage()}
        </h2>
        <p style={{ fontSize: '16px', marginBottom: '32px', color: '#999' }}>
          {getErrorDescription()}
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button
            onClick={() => router.push('/')}
            style={{
              padding: '12px 24px',
              background: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Go Home
          </button>
          <button
            onClick={() => router.back()}
            style={{
              padding: '12px 24px',
              background: 'white',
              color: '#1890ff',
              border: '1px solid #1890ff',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

Error.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error; 