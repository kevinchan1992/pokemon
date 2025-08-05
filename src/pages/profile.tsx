import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const router = useRouter();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth');
        return;
      }

      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data);
        setFormData({
          firstName: data.data.firstName || '',
          lastName: data.data.lastName || '',
          email: data.data.email || ''
        });
      } else {
        setError('獲取用戶資料失敗');
      }
    } catch (error) {
      setError('網絡錯誤');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data);
        setEditMode(false);
        alert('資料更新成功！');
      } else {
        setError(data.error || '更新失敗');
      }
    } catch (error) {
      setError('網絡錯誤');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>載入中...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="error">
        <p>{error || '無法載入用戶資料'}</p>
        <button onClick={() => router.push('/auth')}>返回登錄</button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>用戶資料 - Pokemon TCG 價格追蹤</title>
        <meta name="description" content="管理您的用戶資料" />
      </Head>

      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <h1>用戶資料</h1>
            <button onClick={() => router.push('/')} className="back-btn">
              返回首頁
            </button>
          </div>

          <div className="profile-card">
            {editMode ? (
              <form onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label>名字</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>姓氏</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>電子郵件</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="form-actions">
                  <button type="submit" disabled={loading} className="save-btn">
                    {loading ? '保存中...' : '保存'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setEditMode(false)}
                    className="cancel-btn"
                  >
                    取消
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-item">
                  <label>用戶名</label>
                  <span>{user.username}</span>
                </div>

                <div className="info-item">
                  <label>名字</label>
                  <span>{user.firstName}</span>
                </div>

                <div className="info-item">
                  <label>姓氏</label>
                  <span>{user.lastName}</span>
                </div>

                <div className="info-item">
                  <label>電子郵件</label>
                  <span>{user.email}</span>
                </div>

                <div className="profile-actions">
                  <button onClick={() => setEditMode(true)} className="edit-btn">
                    編輯資料
                  </button>
                  <button onClick={handleLogout} className="logout-btn">
                    登出
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
          .profile-page {
            min-height: 100vh;
            background: #f5f5f5;
            padding: 2rem;
          }

          .profile-container {
            max-width: 600px;
            margin: 0 auto;
          }

          .profile-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
          }

          .profile-header h1 {
            color: #333;
            margin: 0;
          }

          .back-btn {
            padding: 0.5rem 1rem;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }

          .profile-card {
            background: white;
            border-radius: 8px;
            padding: 2rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }

          .form-group {
            margin-bottom: 1.5rem;
          }

          .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #555;
            font-weight: 500;
          }

          .form-group input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
          }

          .info-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
            border-bottom: 1px solid #eee;
          }

          .info-item:last-child {
            border-bottom: none;
          }

          .info-item label {
            font-weight: 500;
            color: #555;
          }

          .info-item span {
            color: #333;
          }

          .form-actions, .profile-actions {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
          }

          .save-btn, .edit-btn {
            padding: 0.75rem 1.5rem;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }

          .cancel-btn {
            padding: 0.75rem 1.5rem;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }

          .logout-btn {
            padding: 0.75rem 1.5rem;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }

          .error-message {
            background: #f8d7da;
            color: #721c24;
            padding: 0.75rem;
            border-radius: 4px;
            margin-bottom: 1rem;
          }

          .loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }

          .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #007bff;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .error {
            text-align: center;
            padding: 2rem;
          }
        `}</style>
      </div>
    </>
  );
};

export default ProfilePage; 