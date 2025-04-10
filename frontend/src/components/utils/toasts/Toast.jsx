// Toast.jsx - The main toast component
import { useState, useEffect, createContext, useContext } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// Create context for toast management
const ToastContext = createContext(null);

// Toast positions
const POSITIONS = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

// Toast variants
const VARIANTS = {
  success: {
    icon: CheckCircle2,
    baseStyle: 'bg-accent-100 border-accent-500 text-accent-800 dark:bg-accent-900 dark:border-accent-600 dark:text-accent-100',
    progressBarColor: 'bg-accent-500 dark:bg-accent-400'
  },
  error: {
    icon: AlertCircle,
    baseStyle: 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900 dark:border-red-600 dark:text-red-100',
    progressBarColor: 'bg-red-500 dark:bg-red-400'
  },
  info: {
    icon: Info,
    baseStyle: 'bg-primary-100 border-primary-500 text-primary-800 dark:bg-primary-900 dark:border-primary-600 dark:text-primary-100',
    progressBarColor: 'bg-primary-500 dark:bg-primary-400'
  },
  warning: {
    icon: AlertTriangle,
    baseStyle: 'bg-amber-100 border-amber-500 text-amber-800 dark:bg-amber-900 dark:border-amber-600 dark:text-amber-100',
    progressBarColor: 'bg-amber-500 dark:bg-amber-400'
  },
  default: {
    icon: Info,
    baseStyle: 'bg-secondary-100 border-secondary-400 text-secondary-800 dark:bg-secondary-800 dark:border-secondary-600 dark:text-secondary-100',
    progressBarColor: 'bg-secondary-500 dark:bg-secondary-400'
  }
};

export const ToastProvider = ({ children, defaultPosition = 'top-center' }) => {
  const [toasts, setToasts] = useState([]);

  // Add a new toast
  const addToast = (message, options = {}) => {
    const id = Date.now().toString();
    const toast = {
      id,
      message,
      variant: options.variant || 'default',
      duration: options.duration || 5000, // Default 5 seconds
      position: options.position || defaultPosition,
      onClose: options.onClose,
      title: options.title,
      action: options.action,
    };
    
    setToasts((prevToasts) => [...prevToasts, toast]);
    return id;
  };

  // Remove a toast
  const removeToast = (id) => {
    const toast = toasts.find(t => t.id === id);
    if (toast && toast.onClose) {
      toast.onClose();
    }
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  // Helper functions for common toast types
  const success = (message, options = {}) => addToast(message, { ...options, variant: 'success' });
  const error = (message, options = {}) => addToast(message, { ...options, variant: 'error' });
  const info = (message, options = {}) => addToast(message, { ...options, variant: 'info' });
  const warning = (message, options = {}) => addToast(message, { ...options, variant: 'warning' });

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Hook to use the toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Individual Toast component
const Toast = ({ toast, onClose }) => {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const variant = VARIANTS[toast.variant] || VARIANTS.default;
  const Icon = variant.icon;
  
  useEffect(() => {
    if (!toast.duration || isPaused) return;
    
    const startTime = Date.now();
    const endTime = startTime + toast.duration;
    
    const progressInterval = setInterval(() => {
      const now = Date.now();
      if (now >= endTime) {
        clearInterval(progressInterval);
        onClose();
        return;
      }
      
      const remaining = endTime - now;
      const percentage = (remaining / toast.duration) * 100;
      setProgress(percentage);
    }, 16);
    
    return () => clearInterval(progressInterval);
  }, [toast.duration, isPaused, onClose]);
  
  return (
    <div 
      className={`relative overflow-hidden card border-l-4 mb-3 shadow-soft min-w-64 max-w-md transform transition-all duration-500 ease-in-out ${variant.baseStyle}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex justify-between items-start gap-3 p-4">
        <div className="flex items-start gap-3">
          <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            {toast.title && (
              <h4 className="font-medium text-base mb-1">{toast.title}</h4>
            )}
            <div className="text-sm">{typeof toast.message === 'string' ? toast.message : null}</div>
            {typeof toast.message !== 'string' && toast.message}
            
            {toast.action && (
              <div className="mt-2">
                {toast.action}
              </div>
            )}
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-100 focus-ring rounded-full"
          aria-label="Close toast"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Progress bar */}
      {toast.duration > 0 && (
        <div className="h-1 w-full bg-secondary-200 dark:bg-secondary-700">
          <div 
            className={`h-full ${variant.progressBarColor} transition-all duration-300 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

// Container for all toasts
const ToastContainer = ({ toasts, removeToast }) => {
  // Group toasts by position
  const groupedToasts = toasts.reduce((acc, toast) => {
    const position = toast.position || 'top-right';
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(toast);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(groupedToasts).map(([position, positionToasts]) => (
        <div 
          key={position}
          className={`fixed z-50 flex flex-col ${POSITIONS[position] || POSITIONS['top-right']}`}
          style={{ maxHeight: '100vh', overflowY: 'auto', maxWidth: '100vw' }}
        >
          {positionToasts.map((toast) => (
            <Toast 
              key={toast.id} 
              toast={toast} 
              onClose={() => removeToast(toast.id)} 
            />
          ))}
        </div>
      ))}
    </>
  );
};

// Animation variants with fade and slide (to be used with CSS transitions in Tailwind)
export const toastAnimations = {
  enter: {
    'top-right': 'animate-in fade-in slide-in-from-right',
    'top-left': 'animate-in fade-in slide-in-from-left',
    'bottom-right': 'animate-in fade-in slide-in-from-right',
    'bottom-left': 'animate-in fade-in slide-in-from-left',
    'top-center': 'animate-in fade-in slide-in-from-top',
    'bottom-center': 'animate-in fade-in slide-in-from-bottom',
  },
  exit: {
    'top-right': 'animate-out fade-out slide-out-to-right',
    'top-left': 'animate-out fade-out slide-out-to-left',
    'bottom-right': 'animate-out fade-out slide-out-to-right',
    'bottom-left': 'animate-out fade-out slide-out-to-left',
    'top-center': 'animate-out fade-out slide-out-to-top',
    'bottom-center': 'animate-out fade-out slide-out-to-bottom',
  },
};