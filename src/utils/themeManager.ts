export interface ClassroomThemeConfig {
  wallpaperId: 'default' | 'meadow' | 'galaxy' | 'ocean' | 'castle' | 'custom';
  customWallpaperUrl?: string;
  paletteId: 'amber' | 'emerald' | 'ocean' | 'pink' | 'violet';
  voiceLang: 'en-GB' | 'en-US';
  speechRate: number; // 0.75, 0.85, 1.0
}

const THEME_STORAGE_KEY = 'esmart_classroom_theme_v1';

export const WALLPAPER_PRESETS = [
  {
    id: 'default',
    nameVi: 'Mặc định (Vàng Tươi Sáng)',
    previewGradient: 'from-amber-100 via-yellow-50 to-orange-100',
    cssBackground: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 50%, #ffedd5 100%)',
    darkCssBackground: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
  },
  {
    id: 'meadow',
    nameVi: 'Đồng Cỏ & Vườn Hoa 🌸',
    previewGradient: 'from-emerald-100 via-teal-50 to-green-100',
    cssBackground: 'linear-gradient(135deg, #d1fae5 0%, #f0fdf4 50%, #ccfbf1 100%)',
    darkCssBackground: 'linear-gradient(135deg, #064e3b 0%, #022c22 50%, #042f2e 100%)',
  },
  {
    id: 'ocean',
    nameVi: 'Đại Dương Xanh Thẳm 🐬',
    previewGradient: 'from-sky-100 via-blue-50 to-cyan-100',
    cssBackground: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 50%, #cffafe 100%)',
    darkCssBackground: 'linear-gradient(135deg, #082f49 0%, #0c4a6e 50%, #164e63 100%)',
  },
  {
    id: 'galaxy',
    nameVi: 'Vũ Trụ Huyền Bí 🚀',
    previewGradient: 'from-indigo-100 via-purple-50 to-slate-100',
    cssBackground: 'linear-gradient(135deg, #e0e7ff 0%, #faf5ff 50%, #f1f5f9 100%)',
    darkCssBackground: 'linear-gradient(135deg, #1e1b4b 0%, #2e1065 50%, #0f172a 100%)',
  },
  {
    id: 'castle',
    nameVi: 'Lâu Đài Kẹo Ngọt 🏰',
    previewGradient: 'from-pink-100 via-rose-50 to-amber-100',
    cssBackground: 'linear-gradient(135deg, #fce7f3 0%, #fff1f2 50%, #fef3c7 100%)',
    darkCssBackground: 'linear-gradient(135deg, #831843 0%, #500724 50%, #18181b 100%)',
  },
];

export const COLOR_PALETTES = [
  { id: 'amber', nameVi: 'Mặt Trời (Amber)', primaryHex: '#f59e0b', ringClass: 'ring-amber-400' },
  { id: 'emerald', nameVi: 'Mầm Xanh (Emerald)', primaryHex: '#10b981', ringClass: 'ring-emerald-400' },
  { id: 'ocean', nameVi: 'Biển Cả (Sky Blue)', primaryHex: '#0284c7', ringClass: 'ring-sky-400' },
  { id: 'pink', nameVi: 'Kẹo Ngọt (Pink)', primaryHex: '#ec4899', ringClass: 'ring-pink-400' },
  { id: 'violet', nameVi: 'Ma Thuật (Violet)', primaryHex: '#8b5cf6', ringClass: 'ring-purple-400' },
];

export const DEFAULT_THEME_CONFIG: ClassroomThemeConfig = {
  wallpaperId: 'default',
  paletteId: 'amber',
  voiceLang: 'en-GB',
  speechRate: 0.85,
};

export function loadClassroomTheme(): ClassroomThemeConfig {
  if (typeof window === 'undefined') return DEFAULT_THEME_CONFIG;
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_THEME_CONFIG, ...JSON.parse(raw) };
    }
  } catch {}
  return DEFAULT_THEME_CONFIG;
}

export function saveClassroomTheme(config: ClassroomThemeConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(config));
    applyThemeToDOM(config);
  } catch (e) {
    console.error('Failed to save theme config:', e);
  }
}

export function applyThemeToDOM(config?: ClassroomThemeConfig): void {
  if (typeof document === 'undefined') return;
  const theme = config || loadClassroomTheme();
  const root = document.getElementById('root') || document.body;

  if (theme.wallpaperId === 'custom' && theme.customWallpaperUrl) {
    root.style.backgroundImage = `url("${theme.customWallpaperUrl}")`;
    root.style.backgroundSize = 'cover';
    root.style.backgroundAttachment = 'fixed';
    root.style.backgroundPosition = 'center';
  } else {
    const preset = WALLPAPER_PRESETS.find((p) => p.id === theme.wallpaperId) || WALLPAPER_PRESETS[0];
    const isDark = document.documentElement.classList.contains('dark');
    root.style.backgroundImage = isDark ? preset.darkCssBackground : preset.cssBackground;
    root.style.backgroundSize = 'cover';
    root.style.backgroundAttachment = 'fixed';
  }
}
