import React from 'react';

const AdminHeader = () => {
  return (
    <header style={{ background: '#fff', padding: '15px 20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2>Overview</h2>
      <div>
        <span>Logged in as: <strong>Admin User</strong></span>
        <button style={{ marginLeft: '15px' }}>Logout</button>
      </div>
    </header>
  );
};

export default AdminHeader;
