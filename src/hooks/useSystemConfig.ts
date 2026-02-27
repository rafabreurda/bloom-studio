import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SystemConfig } from '@/types';
import { defaultConfig } from '@/data/mockData';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const SUPABASE_URL = "https://iphluakvvklyvymwhfxh.supabase.co";

export function useSystemConfig() {
  const [config, setConfig] = useState<SystemConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const { currentAdmin } = useAuth();

  // Load config from Supabase filtered by current user
  useEffect(() => {
    if (!currentAdmin) return;

    const loadConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('system_config')
          .select('*')
          .eq('owner_id', currentAdmin.id);

        if (error) throw error;

        if (data && data.length > 0) {
          const configMap: Record<string, any> = {};
          data.forEach(row => {
            configMap[row.key] = row.value;
          });

          setConfig({
            ...defaultConfig,
            name: (configMap['studio_name'] as string) || defaultConfig.name,
            logo: (configMap['studio_logo'] as string) || defaultConfig.logo,
            backgroundPhoto: (configMap['studio_background'] as string) || defaultConfig.backgroundPhoto,
            pixKey: (configMap['pix_key'] as string) || defaultConfig.pixKey,
            payLink: (configMap['pay_link'] as string) || defaultConfig.payLink,
            clientTags: (configMap['client_tags'] as any[]) || defaultConfig.clientTags,
            whatsappTemplates: (configMap['whatsapp_templates'] as any[]) || defaultConfig.whatsappTemplates,
            serviceTypes: (configMap['service_types'] as any[]) || defaultConfig.serviceTypes,
          });
        } else {
          // No config for this user — start fresh with defaults
          setConfig(defaultConfig);
        }
      } catch (error) {
        console.error('Error loading config:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Reset to defaults before loading to avoid stale data from previous user
    setConfig(defaultConfig);
    setIsLoading(true);
    loadConfig();
  }, [currentAdmin?.id]);

  // Save a single config key to Supabase with owner_id
  const saveConfigKey = async (key: string, value: any) => {
    if (!currentAdmin) return;
    try {
      // Try to update first
      const { data: existing } = await supabase
        .from('system_config')
        .select('id')
        .eq('key', key)
        .eq('owner_id', currentAdmin.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('system_config')
          .update({ value, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('system_config')
          .insert({ key, value, owner_id: currentAdmin.id });
        if (error) throw error;
      }
    } catch (error) {
      console.error(`Error saving config key ${key}:`, error);
    }
  };

  // Upload logo to Supabase Storage (scoped by user id)
  const uploadLogo = async (file: File): Promise<string | null> => {
    if (!currentAdmin) return null;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentAdmin.id}/logo.${fileExt}`;

      await supabase.storage.from('studio-assets').remove([fileName]);

      const { error: uploadError } = await supabase.storage
        .from('studio-assets')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/studio-assets/${fileName}`;
      return publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Erro ao enviar logo');
      return null;
    }
  };

  // Upload background to Supabase Storage (scoped by user id)
  const uploadBackground = async (file: File): Promise<string | null> => {
    if (!currentAdmin) return null;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentAdmin.id}/background.${fileExt}`;

      await supabase.storage.from('studio-assets').remove([fileName]);

      const { error: uploadError } = await supabase.storage
        .from('studio-assets')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/studio-assets/${fileName}`;
      return publicUrl;
    } catch (error) {
      console.error('Error uploading background:', error);
      toast.error('Erro ao enviar foto de fundo');
      return null;
    }
  };

  // Update config and persist to Supabase
  const updateConfig = useCallback(async (newConfig: SystemConfig) => {
    const oldConfig = config;
    setConfig(newConfig);

    if (newConfig.name !== oldConfig.name) {
      await saveConfigKey('studio_name', newConfig.name);
    }
    if (newConfig.logo !== oldConfig.logo) {
      await saveConfigKey('studio_logo', newConfig.logo);
    }
    if (newConfig.backgroundPhoto !== oldConfig.backgroundPhoto) {
      await saveConfigKey('studio_background', newConfig.backgroundPhoto);
    }
    if (newConfig.pixKey !== oldConfig.pixKey) {
      await saveConfigKey('pix_key', newConfig.pixKey);
    }
    if (newConfig.payLink !== oldConfig.payLink) {
      await saveConfigKey('pay_link', newConfig.payLink);
    }
    if (newConfig.clientTags !== oldConfig.clientTags) {
      await saveConfigKey('client_tags', newConfig.clientTags);
    }
    if (newConfig.whatsappTemplates !== oldConfig.whatsappTemplates) {
      await saveConfigKey('whatsapp_templates', newConfig.whatsappTemplates);
    }
    if (newConfig.serviceTypes !== oldConfig.serviceTypes) {
      await saveConfigKey('service_types', newConfig.serviceTypes);
    }
  }, [config, currentAdmin]);

  return {
    config,
    isLoading,
    updateConfig,
    uploadLogo,
    uploadBackground,
  };
}
