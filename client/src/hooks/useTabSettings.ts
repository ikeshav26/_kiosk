import { useState, useEffect } from 'react';

export const defaultTabs = {
  campus: true,
  navigate: true,
  schedule: true,
  faculty: true,
  Blocks: true,
  adminstration: true,
  announcements: true,
  help: true,
  chatButton: true,
};

export type TabKey = keyof typeof defaultTabs;

export function useTabSettings() {
  const [tabs, setTabs] = useState<Record<TabKey, boolean>>(() => {
    const saved = localStorage.getItem('kiosk_tab_settings');
    return saved ? { ...defaultTabs, ...JSON.parse(saved) } : defaultTabs;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('kiosk_tab_settings');
      if (saved) setTabs({ ...defaultTabs, ...JSON.parse(saved) });
    };

    window.addEventListener('kiosk_tab_update', handleStorageChange);
    return () => window.removeEventListener('kiosk_tab_update', handleStorageChange);
  }, []);

  const toggleTab = (key: TabKey) => {
    const saved = localStorage.getItem('kiosk_tab_settings');
    const currentTabs = saved ? { ...defaultTabs, ...JSON.parse(saved) } : defaultTabs;
    const updated = { ...currentTabs, [key]: !currentTabs[key] };
    
    localStorage.setItem('kiosk_tab_settings', JSON.stringify(updated));
    window.dispatchEvent(new Event('kiosk_tab_update'));
  };

  return { tabs, toggleTab };
}
