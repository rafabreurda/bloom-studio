import { useState } from 'react';
import { Check, ChevronsUpDown, Search, Star, User, Users, UserPlus, Contact, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Client, Partnership } from '@/types';

interface PhoneContact {
  name: string;
  phone: string;
}

interface ClientSearchComboboxProps {
  clients: Client[];
  partnerships: Partnership[];
  value: string;
  onSelect: (data: {
    name: string;
    phone: string;
    isVIP: boolean;
    source: 'client' | 'partnership' | 'manual';
  }) => void;
}

// Cache contacts across component mounts
let cachedPhoneContacts: PhoneContact[] | null = null;

export function ClientSearchCombobox({
  clients,
  partnerships,
  value,
  onSelect,
}: ClientSearchComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [phoneContacts, setPhoneContacts] = useState<PhoneContact[]>(cachedPhoneContacts || []);
  const [contactsLoaded, setContactsLoaded] = useState(cachedPhoneContacts !== null);
  const [loadingContacts, setLoadingContacts] = useState(false);

  const supportsContactPicker = 'contacts' in navigator && 'ContactsManager' in window;

  const loadPhoneContacts = async () => {
    if (loadingContacts) return;
    setLoadingContacts(true);
    try {
      const props = ['name', 'tel'];
      const opts = { multiple: true };
      // @ts-ignore - Contact Picker API
      const contacts = await navigator.contacts.select(props, opts);
      if (contacts && contacts.length > 0) {
        const mapped: PhoneContact[] = contacts
          .filter((c: any) => c.name?.[0] || c.tel?.[0])
          .map((c: any) => ({
            name: c.name?.[0] || '',
            phone: (c.tel?.[0] || '').replace(/\D/g, ''),
          }));
        cachedPhoneContacts = mapped;
        setPhoneContacts(mapped);
        setContactsLoaded(true);
      }
    } catch (err) {
      console.log('Contact picker cancelled or not supported');
    } finally {
      setLoadingContacts(false);
    }
  };

  // Filter out phone contacts that already exist as clients
  const existingPhones = new Set(clients.map(c => c.phone.replace(/\D/g, '')));
  const existingNames = new Set(clients.map(c => c.name.toLowerCase()));

  const filteredPhoneContacts = phoneContacts.filter(pc => {
    if (existingPhones.has(pc.phone) || existingNames.has(pc.name.toLowerCase())) return false;
    if (!searchValue) return false;
    return pc.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      pc.phone.includes(searchValue);
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    client.phone.includes(searchValue)
  );

  const filteredPartnerships = partnerships.filter(partnership =>
    partnership.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    partnership.contact.includes(searchValue)
  );

  const handleSelectClient = (client: Client) => {
    onSelect({ name: client.name, phone: client.phone, isVIP: client.isVIP, source: 'client' });
    setOpen(false);
    setSearchValue('');
  };

  const handleSelectPartnership = (partnership: Partnership) => {
    onSelect({ name: partnership.name, phone: partnership.contact, isVIP: false, source: 'partnership' });
    setOpen(false);
    setSearchValue('');
  };

  const handleSelectPhoneContact = (contact: PhoneContact) => {
    onSelect({ name: contact.name, phone: contact.phone, isVIP: false, source: 'manual' });
    setOpen(false);
    setSearchValue('');
  };

  const handleUseAsManual = () => {
    if (searchValue.trim()) {
      onSelect({ name: searchValue.trim(), phone: '', isVIP: false, source: 'manual' });
      setOpen(false);
      setSearchValue('');
    }
  };

  const noResults = filteredClients.length === 0 && filteredPartnerships.length === 0 && filteredPhoneContacts.length === 0;

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between input-bronze h-auto min-h-[48px] font-bold"
          >
            {value ? (
              <span className="truncate">{value}</span>
            ) : (
              <span className="text-muted-foreground flex items-center gap-2">
                <Search size={16} />
                Buscar cliente...
              </span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0 z-[200]"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Digite nome ou telefone..."
              value={searchValue}
              onValueChange={setSearchValue}
              autoFocus
            />
            <CommandList className="max-h-[300px]">
              {/* Load contacts prompt */}
              {supportsContactPicker && !contactsLoaded && (
                <div className="p-2">
                  <button
                    type="button"
                    onClick={loadPhoneContacts}
                    disabled={loadingContacts}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-accent/50 hover:bg-accent text-sm font-medium transition-colors"
                  >
                    <Smartphone size={16} className="text-primary" />
                    {loadingContacts ? 'Carregando...' : 'Carregar contatos da agenda'}
                  </button>
                </div>
              )}

              {contactsLoaded && !searchValue.trim() && filteredClients.length === 0 && (
                <div className="py-3 text-center text-sm text-muted-foreground">
                  Digite para buscar na agenda e clientes...
                </div>
              )}

              {noResults && searchValue.trim() !== '' && (
                <div className="py-3 text-center text-sm text-muted-foreground">
                  Nenhum contato encontrado
                </div>
              )}

              {filteredClients.length > 0 && (
                <CommandGroup heading="Clientes cadastrados">
                  {filteredClients.slice(0, 5).map(client => (
                    <CommandItem
                      key={client.id}
                      value={client.id}
                      onSelect={() => handleSelectClient(client)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <User size={14} className="text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{client.name}</span>
                          {client.isVIP && <Star size={12} className="text-primary fill-primary shrink-0" />}
                        </div>
                        <span className="text-xs text-muted-foreground">{client.phone}</span>
                      </div>
                      {value === client.name && <Check size={14} className="shrink-0 text-primary" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {filteredPhoneContacts.length > 0 && (
                <>
                  {filteredClients.length > 0 && <CommandSeparator />}
                  <CommandGroup heading="📱 Agenda do telefone">
                    {filteredPhoneContacts.slice(0, 8).map((contact, idx) => (
                      <CommandItem
                        key={`phone-${idx}`}
                        value={`phone-${idx}`}
                        onSelect={() => handleSelectPhoneContact(contact)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Smartphone size={14} className="text-emerald-500" />
                        <div className="flex-1 min-w-0">
                          <span className="font-medium truncate block">{contact.name || contact.phone}</span>
                          {contact.phone && <span className="text-xs text-muted-foreground">{contact.phone}</span>}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}

              {filteredPartnerships.length > 0 && (
                <>
                  {(filteredClients.length > 0 || filteredPhoneContacts.length > 0) && <CommandSeparator />}
                  <CommandGroup heading="Parcerias">
                    {filteredPartnerships.slice(0, 5).map(partnership => (
                      <CommandItem
                        key={partnership.id}
                        value={partnership.id}
                        onSelect={() => handleSelectPartnership(partnership)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Users size={14} className="text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <span className="font-medium truncate block">{partnership.name}</span>
                          <span className="text-xs text-muted-foreground">{partnership.contact}</span>
                        </div>
                        {value === partnership.name && <Check size={14} className="shrink-0 text-primary" />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}

              {searchValue.trim() && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      value="manual"
                      onSelect={handleUseAsManual}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <UserPlus size={14} className="text-muted-foreground" />
                      <span>
                        Usar "<strong>{searchValue}</strong>" como cliente avulso
                      </span>
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
