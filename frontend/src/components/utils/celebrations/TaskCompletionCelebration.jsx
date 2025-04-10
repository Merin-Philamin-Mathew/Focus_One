import { useState, useEffect } from 'react';
import { CheckCircle, Trophy, Star } from 'lucide-react';
import { customToast } from '../utils/toasts/Sonner';
import confetti from '../utils/confetti';

// Create a confetti utility function
const createConfetti = () => {
  const colors = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
  
  // Create confetti elements
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';
  document.body.appendChild(container);
  
  // Generate confetti pieces
  for (let i = 0; i < 100; i++) {
    const piece = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    piece.style.position = 'absolute';
    piece.style.width = `${Math.random() * 10 + 5}px`;
    piece.style.height = `${Math.random() * 10 + 5}px`;
    piece.style.backgroundColor = color;
    piece.style.borderRadius = `${Math.random() * 5}px`;
    piece.style.opacity = `${Math.random() * 0.8 + 0.2}`;
    piece.style.top = `${Math.random() * 20 - 10}%`;
    piece.style.left = `${Math.random() * 100}%`;
    
    container.appendChild(piece);
    
    // Animate each piece
    const animDuration = Math.random() * 3 + 2;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = elapsed / animDuration;
      
      if (progress < 1) {
        piece.style.transform = `translate(${(Math.random() * 20 - 10) * progress}px, ${window.innerHeight * progress * 0.8}px) rotate(${Math.random() * 360 * progress}deg)`;
        requestAnimationFrame(animate);
      } else {
        container.removeChild(piece);
        if (container.childElementCount === 0) {
          document.body.removeChild(container);
        }
      }
    };
    
    requestAnimationFrame(animate);
  }
};

// Enhanced toast with celebration effects
const showCelebrationToast = (taskName) => {
  // Trigger confetti effect
  createConfetti();
  
  // Show custom toast with animation
  customToast(
    <div className="flex items-center">
      <div className="mr-3 rounded-full bg-primary-100 p-2 dark:bg-primary-900">
        <Trophy className="h-5 w-5 text-primary-600 dark:text-primary-400" />
      </div>
      <div>
        <h4 className="font-medium text-primary-800 dark:text-primary-200">Great job!</h4>
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          You completed: <span className="font-medium">{taskName}</span>
        </p>
      </div>
    </div>,
    {
      duration: 4000,
      className: "bg-white dark:bg-dark-200 border-l-4 border-l-primary-500 shadow-lg",
    }
  );
  
  // Play celebration sound if available
  try {
    const audio = new Audio('/sounds/celebration.mp3');
    audio.volume = 0.5;
    audio.play().catch(err => console.log('Audio playback prevented:', err));
  } catch (err) {
    console.log('Audio not supported:', err);
  }
};

// Main component to export
const TaskCompletionCelebration = {
  showCelebration: (taskName) => {
    showCelebrationToast(taskName);
  }
};

export default TaskCompletionCelebration;