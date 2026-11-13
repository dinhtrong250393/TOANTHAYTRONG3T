import { ArrowUpRight, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { MouseEvent } from 'react';
import type { WebAppItem } from '../types/app';
import { getDisplayDomain, normalizeUrl } from '../utils/url';
import { AppPreviewImage } from './AppPreviewImage';

interface AppCardProps {
  app: WebAppItem;
  onEdit: (app: WebAppItem) => void;
  onDelete: (id: string) => void;
}

export function AppCard({ app, onEdit, onDelete }: AppCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const launchHref = normalizeUrl(app.url);
  const domain = getDisplayDomain(app.url);

  const stopLink = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="group relative w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_28px_-6px_rgba(15,23,42,0.08),0_4px_12px_-4px_rgba(37,99,235,0.08)] transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.2)] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
      {/* Clickable area that launches the web app URL */}
      <a
        href={launchHref}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-600"
      >
        <AppPreviewImage
          name={app.name}
          imageUrl={app.imageUrl}
          className="border-b border-slate-100"
        />

        {/* App Info */}
        <div className="flex items-center justify-between gap-3 bg-white px-5 py-4">
          <div className="min-w-0 flex-1">
            <h2 className="font-display truncate text-base font-bold text-slate-900 transition-colors group-hover:text-blue-600">
              {app.name}
            </h2>
            <p className="mt-0.5 truncate font-mono text-xs font-medium text-sky-600">
              {domain}
            </p>
          </div>
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-50 to-blue-50 text-blue-600 shadow-2xs transition-all duration-150 group-hover:from-blue-600 group-hover:to-sky-500 group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-500/25">
            <ArrowUpRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </a>

      {/* Edit & Delete Controls */}
      <div className="absolute right-3 top-3 flex items-center gap-1.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <button
          type="button"
          onClick={(e) => {
            stopLink(e);
            onEdit(app);
          }}
          title="Chỉnh sửa"
          aria-label={`Chỉnh sửa ${app.name}`}
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200/90 bg-white/95 text-slate-700 shadow-sm backdrop-blur-xs transition-colors hover:border-sky-300 hover:bg-white hover:text-blue-600"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>

        {confirmDelete ? (
          <button
            type="button"
            onClick={(e) => {
              stopLink(e);
              onDelete(app.id);
            }}
            onMouseLeave={() => setConfirmDelete(false)}
            className="inline-flex h-8 cursor-pointer items-center rounded-lg bg-red-600 px-2.5 text-xs font-semibold text-white shadow-sm hover:bg-red-700 whitespace-nowrap"
          >
            Xóa?
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              stopLink(e);
              setConfirmDelete(true);
            }}
            title="Xóa"
            aria-label={`Xóa ${app.name}`}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200/90 bg-white/95 text-slate-700 shadow-sm backdrop-blur-xs transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
