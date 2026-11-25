import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface AnimatedArrowProps {
  className?: string;
  /** Which way the arrow points and slides. Defaults to right. */
  direction?: 'left' | 'right';
}

const SLIDE = {
  right: {
    out: 'group-hover:translate-x-full group-focus-visible:translate-x-full',
    in: '-translate-x-full group-hover:translate-x-0 group-focus-visible:translate-x-0',
  },
  left: {
    out: 'group-hover:-translate-x-full group-focus-visible:-translate-x-full',
    in: 'translate-x-full group-hover:translate-x-0 group-focus-visible:translate-x-0',
  },
};

/**
 * Arrow that "slides through" when its parent `.group` is hovered:
 * the current arrow exits in its pointing direction while a new one enters from the opposite side.
 * Place it inside an element with the `group` class.
 */
export const AnimatedArrow: React.FC<AnimatedArrowProps> = ({ className = 'w-3.5 h-3.5', direction = 'right' }) => {
  const Icon = direction === 'left' ? ArrowLeft : ArrowRight;
  const slide = SLIDE[direction];
  return (
    <span aria-hidden="true" className={`relative inline-flex shrink-0 overflow-hidden align-middle ${className}`}>
      <Icon
        strokeWidth={2.5}
        className={`absolute inset-0 w-full h-full transition-transform duration-300 ease-out ${slide.out}`}
      />
      <Icon
        strokeWidth={2.5}
        className={`absolute inset-0 w-full h-full transition-transform duration-300 ease-out ${slide.in}`}
      />
    </span>
  );
};
