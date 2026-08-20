/**
 * useScrollReveal.js
 * A lightweight custom hook that uses IntersectionObserver to apply an `is-visible` class 
 * to elements as they scroll into view. Provides native, dependency-free scroll animations.
 */
import { useEffect, useRef } from 'react';

export function useScrollReveal({ threshold = 0.1, rootMargin = '0px 0px -50px 0px' } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    // Respect user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // If they prefer reduced motion, immediately mark it as visible
      if (ref.current) {
        ref.current.classList.add('is-visible');
      }
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Unobserve after revealing to prevent repeating the animation
        observer.unobserve(entry.target);
      }
    }, { threshold, rootMargin });

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin]);

  return ref;
}

/**
 * useStaggeredReveal.js
 * Similar to useScrollReveal, but attaches observers to multiple children 
 * of a parent container, adding staggered delays if needed.
 */
export function useStaggeredReveal(selector = '.reveal-item', { threshold = 0.1 } = {}) {
  const parentRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const elements = parentRef.current ? parentRef.current.querySelectorAll(selector) : [];
    
    if (prefersReducedMotion) {
      elements.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold });

    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, [selector, threshold]);

  return parentRef;
}
