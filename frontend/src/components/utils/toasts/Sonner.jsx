// SonnerToast.jsx - Advanced toast system using Sonner library
import { Toaster, toast } from 'sonner';
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// Theme configuration for Sonner to match your design system
export function SonnerToaster() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: 'var(--toast-bg)',
          color: 'var(--toast-text)',
          border: '1px solid var(--toast-border)',
          borderLeft: '4px solid var(--toast-accent)',
          borderRadius: '0.75rem',
          boxShadow: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
          fontSize: '0.875rem',
          fontFamily: "'Inter', sans-serif",
        },
        className: "custom-toast",
        duration: 3000,
      }}
      theme="system" // Will follow system dark/light mode
    />
  );
}

// Helper to define styles based on variant
const getVariantStyles = (variant) => {
  const styles = {
    success: {
      '--toast-bg': 'var(--accent-100, #d1fae5)',
      '--toast-border': 'var(--accent-300, #6ee7b7)',
      '--toast-accent': 'var(--accent-500, #10b981)',
      '--toast-text': 'var(--accent-800, #065f46)',
      icon: <CheckCircle2 className="text-accent-500 dark:text-accent-400 w-5 h-5" />
    },
    error: {
      '--toast-bg': 'var(--red-100, #fee2e2)',
      '--toast-border': 'var(--red-300, #fca5a5)',
      '--toast-accent': 'var(--red-500, #ef4444)',
      '--toast-text': 'var(--red-800, #991b1b)',
      icon: <AlertCircle className="text-red-500 dark:text-red-400 w-5 h-5" />
    },
    info: {
      '--toast-bg': 'var(--primary-100, #e0f2fe)',
      '--toast-border': 'var(--primary-300, #7dd3fc)',
      '--toast-accent': 'var(--primary-500, #0ea5e9)',
      '--toast-text': 'var(--primary-800, #075985)',
      icon: <Info className="text-primary-500 dark:text-primary-400 w-5 h-5" />
    },
    warning: {
      '--toast-bg': 'var(--amber-100, #fef3c7)',
      '--toast-border': 'var(--amber-300, #fcd34d)',
      '--toast-accent': 'var(--amber-500, #f59e0b)',
      '--toast-text': 'var(--amber-800, #92400e)',
      icon: <AlertTriangle className="text-amber-500 dark:text-amber-400 w-5 h-5" />
    },
    default: {
      '--toast-bg': 'var(--secondary-100, #f1f5f9)',
      '--toast-border': 'var(--secondary-300, #cbd5e1)',
      '--toast-accent': 'var(--secondary-500, #64748b)',
      '--toast-text': 'var(--secondary-800, #1e293b)',
      icon: <Info className="text-secondary-500 dark:text-secondary-400 w-5 h-5" />
    }
  };
  
  // Add dark mode styles - These would be applied via CSS variables in a real impl
  document.documentElement.classList.contains('dark') && Object.assign(styles, {
    success: {
      '--toast-bg': 'var(--accent-900, #064e3b)',
      '--toast-border': 'var(--accent-700, #047857)',
      '--toast-accent': 'var(--accent-600, #059669)',
      '--toast-text': 'var(--accent-100, #d1fae5)',
    },
    error: {
      '--toast-bg': 'var(--red-900, #7f1d1d)',
      '--toast-border': 'var(--red-700, #b91c1c)',
      '--toast-accent': 'var(--red-600, #dc2626)',
      '--toast-text': 'var(--red-100, #fee2e2)',
    },
    info: {
      '--toast-bg': 'var(--primary-900, #0c4a6e)',
      '--toast-border': 'var(--primary-700, #0369a1)',
      '--toast-accent': 'var(--primary-600, #0284c7)',
      '--toast-text': 'var(--primary-100, #e0f2fe)',
    },
    warning: {
      '--toast-bg': 'var(--amber-900, #78350f)',
      '--toast-border': 'var(--amber-700, #b45309)',
      '--toast-accent': 'var(--amber-600, #d97706)',
      '--toast-text': 'var(--amber-100, #fef3c7)',
    },
    default: {
      '--toast-bg': 'var(--secondary-800, #1e293b)',
      '--toast-border': 'var(--secondary-700, #334155)',
      '--toast-accent': 'var(--secondary-600, #475569)',
      '--toast-text': 'var(--secondary-100, #f1f5f9)',
    }
  });
  
  return styles[variant] || styles.default;
};

// Custom styled toast functions
const customToast = {
  message: (message, options = {}) => {
    const variant = options.variant || 'default';
    const variantStyles = getVariantStyles(variant);
    
    return toast(message, {
      ...options,
      style: {
        ...variantStyles,
      },
      icon: options.icon || variantStyles.icon,
    });
  },
  
  success: (message, options = {}) => {
    return customToast.message(message, { ...options, variant: 'success' });
  },
  
  error: (message, options = {}) => {
    return customToast.message(message, { ...options, variant: 'error' });
  },
  
  info: (message, options = {}) => {
    return customToast.message(message, { ...options, variant: 'info' });
  },
  
  warning: (message, options = {}) => {
    return customToast.message(message, { ...options, variant: 'warning' });
  },
  
  // Custom toast with progress bar
  promise: (promise, options = {}) => {
    const variant = options.variant || 'info';
    const variantStyles = getVariantStyles(variant);
    
    return toast.promise(promise, {
      loading: options.loading || 'Loading...',
      success: options.success || 'Success!',
      error: options.error || 'Error!',
      style: variantStyles,
      icon: options.icon || variantStyles.icon,
    });
  },
  
  // Custom toast with action buttons
  action: (message, { action, ...options } = {}) => {
    const variant = options.variant || 'default';
    const variantStyles = getVariantStyles(variant);
    
    return toast(
      message,
      {
        ...options,
        style: variantStyles,
        icon: options.icon || variantStyles.icon,
        action: action ? {
          label: action.label,
          onClick: action.onClick,
        } : undefined,
      }
    );
  },
  
  // Persistent toast that requires user interaction
  persistent: (message, options = {}) => {
    const variant = options.variant || 'info';
    const variantStyles = getVariantStyles(variant);
    
    return toast(message, {
      ...options,
      duration: Infinity,
      style: variantStyles,
      icon: options.icon || variantStyles.icon,
      onDismiss: options.onDismiss,
    });
  }
};

// CSS to be added to your global styles
const toastCss = `
  /* These styles should be added to your global CSS file */
  
  /* Dark mode adjustments */
  .dark .custom-toast {
    --toast-bg: var(--dark-200, #171f2c);
    --toast-border: var(--dark-100, #1e2736);
    --toast-text: var(--secondary-100, #f1f5f9);
  }
  
  /* Progress bar styling */
  .custom-toast [data-sonner-toast] [data-content] span,
  .custom-toast [data-sonner-toast] [data-title] {
    font-family: 'Inter', sans-serif;
  }
  
  /* Action button styling */
  .custom-toast [data-sonner-toast] [data-button] {
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    border-radius: 0.5rem;
    transition: background-color 200ms ease;
  }
`;

export { customToast, toastCss };