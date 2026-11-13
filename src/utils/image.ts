/**
 * Compresses and resizes an uploaded app interface screenshot or icon
 * proportionally (max 960px width) so it renders crisply in 16:9 cards
 * while staying lightweight for localStorage persistence.
 */
export async function processUploadedImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WebP, SVG).');
  }

  if (file.size > 15 * 1024 * 1024) {
    throw new Error('Kích thước ảnh vượt quá 15MB.');
  }

  if (file.type === 'image/svg+xml') {
    const text = await file.text();
    const encoded = btoa(unescape(encodeURIComponent(text)));
    return `data:image/svg+xml;base64,${encoded}`;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Không thể đọc tệp ảnh.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () =>
        reject(new Error('Tệp ảnh bị lỗi hoặc không được hỗ trợ.'));
      img.onload = () => {
        const maxWidth = 1024;
        const maxHeight = 768;

        const ratio = Math.min(
          1,
          maxWidth / img.width,
          maxHeight / img.height,
        );
        const targetWidth = Math.max(1, Math.round(img.width * ratio));
        const targetHeight = Math.max(1, Math.round(img.height * ratio));

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Trình duyệt không hỗ trợ xử lý ảnh.'));
          return;
        }

        ctx.clearRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        const outputMime =
          file.type === 'image/png' ? 'image/png' : 'image/webp';
        resolve(canvas.toDataURL(outputMime, 0.86));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

const FALLBACK_GRADIENTS = [
  'from-blue-600 to-indigo-700',
  'from-teal-600 to-emerald-700',
  'from-slate-700 to-slate-900',
  'from-amber-600 to-orange-700',
  'from-rose-600 to-red-700',
  'from-cyan-600 to-sky-700',
];

export function getDeterministicGradient(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % FALLBACK_GRADIENTS.length;
  return FALLBACK_GRADIENTS[index];
}

export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'AP';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
