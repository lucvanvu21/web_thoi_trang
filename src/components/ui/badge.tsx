import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        success: 'border-transparent bg-green-200 text-green-700 shadow hover:bg-green-200/80',
        primary: 'border-transparent bg-blue-200 text-blue-600 hover:bg-blue-200/80',
        warning: 'border-transparent bg-yellow-100 text-yellow-700 hover:bg-yellow-200/80',
        error: 'border-transparent bg-red-200 text-red-600 shadow hover:bg-red-200/80',
        default: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
