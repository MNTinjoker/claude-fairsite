import React, { useState, useEffect } from 'react';
import { formatDigits } from '../utils';

interface AnimatedCounterProps {
  value: number;
  duration?: number; // duration of animation in milliseconds
  lang?: 'fa' | 'en';
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, duration = 1200, lang }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = 0;
    const endValue = value;

    if (endValue === 0) {
      setCount(0);
      return;
    }

    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function (easeOutQuad): f(t) = t * (2 - t)
      const easedProgress = progress * (2 - progress);
      
      setCount(Math.floor(easedProgress * (endValue - startValue) + startValue));
      
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [value, duration]);

  const effectiveLang = lang || (localStorage.getItem('pmp_quiz_lang') as 'fa' | 'en') || 'fa';
  return <>{formatDigits(count, effectiveLang)}</>;
};
