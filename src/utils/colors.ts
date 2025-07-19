// utils/colors.ts
// Constantes de couleurs pour une utilisation cohérente dans toute l'application

export const COLORS = {
  // Actions principales
  PRIMARY: {
    bg: 'bg-primary-500',
    bgHover: 'hover:bg-primary-600',
    bgLight: 'bg-primary-50',
    text: 'text-primary-500',
    textHover: 'hover:text-primary-600',
    border: 'border-primary-500',
    ring: 'ring-primary-500',
  },
  
  // Actions secondaires
  SECONDARY: {
    bg: 'bg-secondary-500',
    bgHover: 'hover:bg-secondary-600',
    bgLight: 'bg-secondary-50',
    text: 'text-secondary-500',
    textHover: 'hover:text-secondary-600',
    border: 'border-secondary-500',
    ring: 'ring-secondary-500',
  },

  // Accents et éléments spéciaux
  ACCENT: {
    bg: 'bg-accent-500',
    bgHover: 'hover:bg-accent-600',
    bgLight: 'bg-accent-50',
    text: 'text-accent-500',
    textHover: 'hover:text-accent-600',
    border: 'border-accent-500',
    ring: 'ring-accent-500',
  },

  // Succès (ajouter à la liste, validations)
  SUCCESS: {
    bg: 'bg-emerald-500',
    bgHover: 'hover:bg-emerald-600',
    bgLight: 'bg-emerald-50',
    text: 'text-emerald-500',
    textHover: 'hover:text-emerald-600',
    border: 'border-emerald-500',
    ring: 'ring-emerald-500',
  },

  // Attention / Ratings
  WARNING: {
    bg: 'bg-amber-500',
    bgHover: 'hover:bg-amber-600',
    bgLight: 'bg-amber-50',
    text: 'text-amber-500',
    textHover: 'hover:text-amber-600',
    border: 'border-amber-500',
    ring: 'ring-amber-500',
  },

  // Erreurs / Likes / Suppressions
  DANGER: {
    bg: 'bg-rose-500',
    bgHover: 'hover:bg-rose-600',
    bgLight: 'bg-rose-50',
    text: 'text-rose-500',
    textHover: 'hover:text-rose-600',
    border: 'border-rose-500',
    ring: 'ring-rose-500',
  },

  // Éléments neutres
  NEUTRAL: {
    bg: 'bg-slate-100',
    bgHover: 'hover:bg-slate-200',
    bgDark: 'bg-slate-800',
    text: 'text-slate-700',
    textLight: 'text-slate-500',
    textDark: 'text-slate-800',
    border: 'border-slate-200',
    borderDark: 'border-slate-300',
  },
} as const;

// Classes de boutons prédéfinies
export const BUTTON_STYLES = {
  primary: `${COLORS.PRIMARY.bg} ${COLORS.PRIMARY.bgHover} text-white shadow-md hover:shadow-lg transition-all duration-200`,
  secondary: `${COLORS.NEUTRAL.bg} ${COLORS.NEUTRAL.bgHover} ${COLORS.NEUTRAL.text} ${COLORS.NEUTRAL.border} border transition-all duration-200`,
  success: `${COLORS.SUCCESS.bg} ${COLORS.SUCCESS.bgHover} text-white shadow-md hover:shadow-lg transition-all duration-200`,
  danger: `${COLORS.DANGER.bg} ${COLORS.DANGER.bgHover} text-white shadow-md hover:shadow-lg transition-all duration-200`,
  ghost: `${COLORS.NEUTRAL.bgHover} ${COLORS.NEUTRAL.text} transition-all duration-200`,
} as const;

// Classes de badges prédéfinies
export const BADGE_STYLES = {
  success: `${COLORS.SUCCESS.bgLight} ${COLORS.SUCCESS.text} ${COLORS.SUCCESS.border} border`,
  warning: `${COLORS.WARNING.bgLight} ${COLORS.WARNING.text} ${COLORS.WARNING.border} border`,
  danger: `${COLORS.DANGER.bgLight} ${COLORS.DANGER.text} ${COLORS.DANGER.border} border`,
  neutral: `${COLORS.NEUTRAL.bg} ${COLORS.NEUTRAL.text} ${COLORS.NEUTRAL.border} border`,
  primary: `${COLORS.PRIMARY.bgLight} ${COLORS.PRIMARY.text} ${COLORS.PRIMARY.border} border`,
} as const;

// Fonction utilitaire pour créer des classes conditionnelles
export function createButtonClass(
  variant: keyof typeof BUTTON_STYLES,
  size: 'sm' | 'md' | 'lg' = 'md',
  rounded: 'md' | 'lg' | 'xl' | 'full' = 'lg'
): string {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const roundedClasses = {
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  return `${BUTTON_STYLES[variant]} ${sizeClasses[size]} ${roundedClasses[rounded]} font-medium`;
}

// Export des couleurs HEX pour usage en JavaScript (graphiques, etc.)
export const HEX_COLORS = {
  primary: '#3b82f6',
  secondary: '#6366f1',
  accent: '#a855f7',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#f43f5e',
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    500: '#64748b',
    700: '#334155',
    800: '#1e293b',
  },
} as const;