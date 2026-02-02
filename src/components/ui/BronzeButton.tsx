import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface BronzeButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'gold' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export function BronzeButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className,
  type = 'button',
  disabled = false,
}: BronzeButtonProps) {
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:brightness-110 shadow-lg shadow-primary/20',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border',
    outline: 'border border-primary/50 text-primary hover:bg-primary/10',
    danger: 'bg-destructive text-destructive-foreground hover:brightness-110',
    success: 'bg-success text-success-foreground hover:brightness-110',
    gold: 'btn-gold',
    warning: 'bg-destructive text-destructive-foreground hover:brightness-110',
  };

  const sizes = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-5 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 select-none font-bold',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : 20} />}
      {children}
    </button>
  );
}
