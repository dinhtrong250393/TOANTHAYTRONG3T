import { LayoutGrid, Plus, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AppCard } from './components/AppCard';
import { AppFormModal } from './components/AppFormModal';
import { useApps } from './hooks/useApps';
import type { WebAppItem } from './types/app';

export default function App() {
  const { apps, addApp, updateApp, deleteApp } = useApps();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<WebAppItem | null>(null);

  const filteredApps = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return apps;
    return apps.filter(
      (app) =>
        app.name.toLowerCase().includes(q) ||
        app.url.toLowerCase().includes(q),
    );
  }, [apps, searchQuery]);

  const handleOpenAdd = () => {
    setEditingApp(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (app: WebAppItem) => {
    setEditingApp(app);
    setModalOpen(true);
  };

  const handleSave = (
    payload: Omit<WebAppItem, 'id' | 'createdAt'>,
    editingId?: string,
  ) => {
    if (editingId) {
      updateApp(editingId, payload);
    } else {
      addApp(payload);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFF] bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.16),_transparent_58%)] text-slate-900">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Centered Header Card with Logo on the Left */}
        <header className="mx-auto mb-10 max-w-4xl rounded-3xl border border-white bg-white/95 px-6 py-7 shadow-[0_14px_40px_-10px_rgba(37,99,235,0.12),0_4px_14px_-4px_rgba(15,23,42,0.05)] backdrop-blur-sm sm:px-9 sm:py-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full bg-white shadow-[0_10px_25px_-5px_rgba(217,119,6,0.3)] ring-2 ring-amber-400/50 sm:h-28 sm:w-28">
              <img
                src="/assets/aistudio/logo-toan-thay-trong.png_ebb6f9dd.png"
                alt="Logo Toán Thầy Trọng 3T"
                className="h-full w-full object-cover object-center"
              />
            </div>

            <div className="min-w-0 flex-1 text-center">
              <h1 className="font-display bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-600 bg-clip-text text-xl font-bold tracking-tight text-transparent text-balance sm:text-2xl lg:text-[26px]">
                QUẢN LÝ ỨNG DỤNG - THẦY TRỌNG 3T
              </h1>

              <p className="mt-2 text-sm text-slate-600 sm:text-base">
                <span className="font-semibold text-blue-600 tabular-nums">
                  {apps.length} ứng dụng web
                </span>
                <span aria-hidden="true" className="mx-2 text-slate-300">
                  ·
                </span>
                <span>Kích trực tiếp vào thẻ để mở ứng dụng ngay</span>
              </p>

              {/* Centered Search + Primary CTA Row */}
              <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                {apps.length > 0 && (
                  <div className="relative w-full sm:w-72">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm kiếm ứng dụng..."
                      aria-label="Tìm kiếm ứng dụng"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-9 text-sm text-slate-900 shadow-2xs placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        aria-label="Xóa tìm kiếm"
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded p-0.5 text-slate-400 hover:text-slate-700"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-6 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:w-auto whitespace-nowrap shrink-0"
                >
                  <Plus className="h-4 w-4 shrink-0" />
                  <span>Thêm ứng dụng</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Centered Empty State or Centered App Cards */}
        {apps.length === 0 ? (
          <div className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white px-6 py-16 text-center shadow-[0_14px_36px_-10px_rgba(37,99,235,0.1)]">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-50 to-blue-100 text-blue-600 shadow-xs">
              <LayoutGrid className="h-7 w-7" />
            </div>
            <h2 className="font-display text-lg font-bold text-slate-900">
              Chưa có ứng dụng nào trên trang chủ
            </h2>
            <p className="mt-1.5 max-w-md text-sm text-slate-600">
              Nhấn nút bên dưới để thêm tên ứng dụng, tải ảnh giao diện/logo và gắn đường link chạy ứng dụng web của bạn.
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="mt-6 inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-6 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm ứng dụng đầu tiên</span>
            </button>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="mx-auto flex max-w-xl flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white px-6 py-14 text-center shadow-[0_10px_30px_-8px_rgba(15,23,42,0.08)]">
            <p className="text-sm text-slate-600">
              Không tìm thấy ứng dụng phù hợp với &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-4 h-9 cursor-pointer rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-blue-600 shadow-2xs hover:border-sky-300 hover:bg-sky-50"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {filteredApps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                onEdit={handleOpenEdit}
                onDelete={deleteApp}
              />
            ))}
          </div>
        )}
      </main>

      <AppFormModal
        open={modalOpen}
        editingApp={editingApp}
        onClose={() => {
          setModalOpen(false);
          setEditingApp(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
