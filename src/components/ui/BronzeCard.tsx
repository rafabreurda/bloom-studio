import { cn } from "@/lib/utils";

interface BronzeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'premium' | 'gold';
}

export function BronzeCard({ children, className, variant = 'default', ...props }: BronzeCardProps) {
  const variants = {
    default: 'bg-card border-border',
    premium: 'card-premium',
    gold: 'card-gold',
  };

  return (
    <div className={cn(
      'rounded-2xl md:rounded-3xl shadow-card border p-4 md:p-6',
      variants[variant],
      className
    )} {...props}>
      {children}
    </div>
  );
}
