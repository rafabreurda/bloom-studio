import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SystemConfig } from '@/types';
import { defaultConfig } from '@/data/mockData';
import { toast } from 'sonner';

const SUPABASE_URL = "https://iphluakvvklyvymwhfxh.supabase.co";

export function useSystemConfig() {
  const [config, setConfig] = useState<SystemConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);

  // Load config from Supabase
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('system_config')
          .select('*');

        if (error) throw error;

        if (data && data.length > 0) {
          const configMap: Record<string, any> = {};
          data.forEach(row => {
            configMap[row.key] = row.value;
          });

          setConfig(prev => ({
            ...prev,
            name: (configMap['studio_name'] as string) || prev.name,
            logo: (configMap['studio_logo'] as string) || prev.logo,
            backgroundPhoto: (configMap['studio_background'] as string) || prev.backgroundPhoto,
            pixKey: (configMap['pix_key'] as string) || prev.pixKey,
            payLink: (configMap['pay_link'] as string) || prev.payLink,
            clientTags: (configMap['client_tags'] as any[]) || prev.clientTags,
            whatsappTemplates: (configMap['whatsapp_templates'] as any[]) || prev.whatsappTemplates,
            serviceTypes: (configMap['service_types'] as any[]) || prev.serviceTypes,
          }));
        }
      } catch (error) {
        console.error('Error loading config:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Save a single config key to Supabase
  const saveConfigKey = async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from('system_config')
        .upsert(
          { key, value },
          { onConflict: 'key' }
        );

      if (error) throw error;
    } catch (error) {
      console.error(`Error saving config key ${key}:`, error);
    }
  };

  // Upload logo to Supabase Storage
  const uploadLogo = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo.${fileExt}`;

      // Remove old logo if exists
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

  // Upload background to Supabase Storage
  const uploadBackground = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `background.${fileExt}`;

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

    // Persist changed fields
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
  }, [config]);

  return {
    config,
    isLoading,
    updateConfig,
    uploadLogo,
    uploadBackground,
  };
}
