import React, { useState } from 'react';

const SiteSettings = () => {
  const [settings, setSettings] = useState({
    siteName: "Coin Collector",
    themeColor: "#166534",
    enableNotifications: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const saveSettings = () => {
    console.log("✅ Settings saved successfully!");
    // এখানে চাইলে backend এ POST/PUT করে settings save করতে পারো
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: '20px', color: '#1f2937' }}>⚙️ Site Settings</h2>

      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', maxWidth: '500px' }}>
        <label style={{ display: 'block', marginBottom: '15px' }}>
          Site Name: 
          <input 
            type="text" 
            name="siteName" 
            value={settings.siteName} 
            onChange={handleChange} 
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: '15px' }}>
          Theme Color: 
          <input 
            type="color" 
            name="themeColor" 
            value={settings.themeColor} 
            onChange={handleChange} 
            style={{ marginLeft: '10px' }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: '15px' }}>
          <input 
            type="checkbox" 
            name="enableNotifications" 
            checked={settings.enableNotifications} 
            onChange={handleChange} 
          /> Enable Notifications
        </label>

        <button 
          onClick={saveSettings} 
          style={{ backgroundColor: '#166534', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SiteSettings;
