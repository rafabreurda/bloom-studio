import { UserRole } from '@/types';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  return (
    <div className="absolute top-4 right-4 md:top-8 md:right-10 z-[100] hidden md:block">
      <div className="flex items-center gap-3 bg-secondary/80 backdrop-blur-md p-2 pl-4 rounded-2xl border border-primary/20 shadow-xl">
        <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">
          Acesso:
        </span>
        <select
          value={currentRole}
          onChange={(e) => onRoleChange(e.target.value as UserRole)}
          className="bg-background text-foreground text-xs font-black uppercase border-none focus:ring-0 rounded-xl px-4 py-2 cursor-pointer"
        >
          <option value="Admin Chefe">Chefe</option>
          <option value="Admin Pleno">Pleno</option>
          <option value="Admin Junior">Junior</option>
        </select>
      </div>
    </div>
  );
}
