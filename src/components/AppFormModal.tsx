import { ImagePlus, Link2, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent, FormEvent } from 'react';
import type { WebAppItem } from '../types/app';
import { processUploadedImage } from '../utils/image';
import { isValidWebUrl, normalizeUrl } from '../utils/url';
import { AppPreviewImage } from './AppPreviewImage';

interface AppFormModalProps {
  open: boolean;
  editingApp: WebAppItem | null;
  onClose: () => void;
  onSave: (
    payload: Omit<WebAppItem, 'id' | 'createdAt'>,
    editingId?: string,
  ) => void;
}

export function AppFormModal({
  open,
  editingApp,
  onClose,
  onSave,
}: AppFormModalProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setError('');
    setIsDraggingFile(false);
    if (editingApp) {
      setName(editingApp.name);
      setUrl(editingApp.url);
      setImageUrl(editingApp.imageUrl);
      setShowUrlInput(
        Boolean(editingApp.imageUrl) && !editingApp.imageUrl.startsWith('data:'),
      );
    } else {
      setName('');
      setUrl('');
      setImageUrl('');
      setShowUrlInput(false);
    }
  }, [open, editingApp]);

  if (!open) return null;

  const handleImageFile = async (file: File) => {
    setError('');
    setUploading(true);
    try {
      const dataUrl = await processUploadedImage(file);
      setImageUrl(dataUrl);
      setShowUrlInput(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Không thể xử lý tệp ảnh.',
      );
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleImageFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleImageFile(file);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanName = name.trim();
    if (!cleanName) {
      setError('Vui lòng nhập tên ứng dụng.');
      return;
    }

    if (!isValidWebUrl(url)) {
      setError(
        'Vui lòng nhập đường link ứng dụng hợp lệ (ví dụ: https://app.cuaban.com).',
      );
      return;
    }

    onSave(
      {
        name: cleanName,
        url: normalizeUrl(url),
        imageUrl: imageUrl.trim(),
      },
      editingApp?.id,
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-app-title"
    >
      <div
        className="fixed inset-0 bg-slate-900/35 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-sky-100 bg-white p-6 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.2)]">
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
          <h2
            id="modal-app-title"
            className="font-display text-lg font-bold text-slate-900"
          >
            {editingApp ? 'Chỉnh sửa ứng dụng' : 'Thêm ứng dụng mới'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 hover:bg-sky-50 hover:text-blue-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* 1. Tên ứng dụng */}
          <div>
            <label
              htmlFor="app-name"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              Tên ứng dụng <span className="text-red-500">*</span>
            </label>
            <input
              id="app-name"
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Hệ thống CRM, Dashboard bán hàng..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 shadow-2xs placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* 2. Đường link ứng dụng */}
          <div>
            <label
              htmlFor="app-url"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              Đường link ứng dụng <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Link2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-500" />
              <input
                id="app-url"
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://ten-ung-dung.vercel.app"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 font-mono text-sm text-slate-900 shadow-2xs placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* 3. Tải ảnh giao diện web của ứng dụng */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">
                Ảnh giao diện / Logo ứng dụng
              </span>
              <button
                type="button"
                onClick={() => setShowUrlInput((prev) => !prev)}
                className="cursor-pointer text-xs font-semibold text-blue-600 hover:underline"
              >
                {showUrlInput ? 'Tải ảnh từ máy' : 'Hoặc dùng link ảnh (URL)'}
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {showUrlInput ? (
              <div className="space-y-2.5">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/anh-giao-dien.png"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 font-mono text-sm text-slate-900 shadow-2xs placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                {imageUrl && (
                  <AppPreviewImage
                    name={name || 'Xem trước'}
                    imageUrl={imageUrl}
                    className="rounded-xl border border-slate-200 shadow-sm"
                  />
                )}
              </div>
            ) : imageUrl ? (
              <div className="space-y-2">
                <AppPreviewImage
                  name={name || 'Xem trước'}
                  imageUrl={imageUrl}
                  className="rounded-xl border border-slate-200 shadow-sm"
                />
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs hover:border-sky-300 hover:bg-sky-50"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Đổi ảnh khác</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    Xóa ảnh
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingFile(true);
                }}
                onDragLeave={() => setIsDraggingFile(false)}
                onDrop={handleDrop}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                className={`flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 text-center transition-colors ${
                  isDraggingFile
                    ? 'border-blue-500 bg-sky-50'
                    : 'border-sky-200 bg-sky-50/40 hover:border-blue-400 hover:bg-sky-50/80'
                }`}
              >
                <div className="mb-2.5 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <ImagePlus className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  {uploading
                    ? 'Đang xử lý ảnh...'
                    : 'Nhấn để tải ảnh giao diện hoặc logo lên'}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Tự động căn chỉnh tỷ lệ để hiển thị trọn vẹn toàn bộ ảnh (PNG, JPG, WebP, SVG)
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="h-10 cursor-pointer rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="h-10 cursor-pointer rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all hover:brightness-105 disabled:opacity-50"
            >
              {editingApp ? 'Lưu thay đổi' : 'Thêm ứng dụng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
