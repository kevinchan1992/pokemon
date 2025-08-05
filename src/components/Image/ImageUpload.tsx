import React, { useState, useRef } from 'react';

interface ImageUploadProps {
  onUpload: (file: File) => void;
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
  accept?: string;
  maxSize?: number; // MB
  className?: string;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  onSuccess,
  onError,
  accept = 'image/*',
  maxSize = 10,
  className = '',
  disabled = false
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // 驗證文件類型
    if (!file.type.startsWith('image/')) {
      onError?.('只允許上傳圖片文件');
      return;
    }

    // 驗證文件大小
    if (file.size > maxSize * 1024 * 1024) {
      onError?.(`文件大小不能超過 ${maxSize}MB`);
      return;
    }

    // 創建預覽
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // 調用上傳回調
    onUpload(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`image-upload ${className}`}>
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''} ${disabled ? 'disabled' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="預覽" className="preview-image" />
            <div className="preview-overlay">
              <span>點擊或拖拽更換圖片</span>
            </div>
          </div>
        ) : (
          <div className="upload-content">
            <div className="upload-icon">📷</div>
            <p className="upload-text">點擊或拖拽上傳圖片</p>
            <p className="upload-hint">支持 JPG、PNG、WebP 格式，最大 {maxSize}MB</p>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInput}
          style={{ display: 'none' }}
          disabled={disabled}
        />
      </div>

      <style jsx>{`
        .image-upload {
          width: 100%;
        }

        .upload-area {
          border: 2px dashed #ddd;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #fafafa;
        }

        .upload-area:hover:not(.disabled) {
          border-color: #007bff;
          background: #f0f8ff;
        }

        .upload-area.drag-active {
          border-color: #007bff;
          background: #e3f2fd;
        }

        .upload-area.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .upload-icon {
          font-size: 3rem;
          color: #666;
        }

        .upload-text {
          font-size: 1.1rem;
          color: #333;
          margin: 0;
        }

        .upload-hint {
          font-size: 0.9rem;
          color: #666;
          margin: 0;
        }

        .preview-container {
          position: relative;
          display: inline-block;
        }

        .preview-image {
          max-width: 100%;
          max-height: 200px;
          border-radius: 4px;
        }

        .preview-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .preview-container:hover .preview-overlay {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default ImageUpload; 