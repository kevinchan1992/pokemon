import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'zh', name: '繁體中文', flag: '🇹🇼' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' }
  ];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('language', languageCode);
  };

  const currentLanguage = i18n.language || 'zh';

  return (
    <div className="language-switcher">
      <div className="language-dropdown">
        <button className="language-button">
          {languages.find(lang => lang.code === currentLanguage)?.flag} 
          {languages.find(lang => lang.code === currentLanguage)?.name}
          <span className="dropdown-arrow">▼</span>
        </button>
        <div className="language-menu">
          {languages.map((language) => (
            <button
              key={language.code}
              className={`language-option ${currentLanguage === language.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(language.code)}
            >
              {language.flag} {language.name}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .language-switcher {
          position: relative;
        }

        .language-dropdown {
          position: relative;
          display: inline-block;
        }

        .language-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: white;
          border: 1px solid #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          color: #333;
          transition: all 0.3s ease;
        }

        .language-button:hover {
          border-color: #1890ff;
          color: #1890ff;
        }

        .dropdown-arrow {
          font-size: 12px;
          transition: transform 0.3s ease;
        }

        .language-dropdown:hover .dropdown-arrow {
          transform: rotate(180deg);
        }

        .language-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid #d9d9d9;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          min-width: 150px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.3s ease;
        }

        .language-dropdown:hover .language-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .language-option {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 8px 12px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          color: #333;
          text-align: left;
          transition: background-color 0.3s ease;
        }

        .language-option:hover {
          background-color: #f5f5f5;
        }

        .language-option.active {
          background-color: #e6f7ff;
          color: #1890ff;
        }

        @media (max-width: 768px) {
          .language-button {
            padding: 6px 8px;
            font-size: 12px;
          }

          .language-menu {
            min-width: 120px;
          }

          .language-option {
            padding: 6px 8px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default LanguageSwitcher; 