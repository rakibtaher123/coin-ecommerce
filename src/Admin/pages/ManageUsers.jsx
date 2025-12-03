import React, { useEffect, useState } from 'react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ইউজার লোড করার ফাংশন
  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/auth/users');
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ইউজার ডিলিট
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`http://localhost:5000/auth/users/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log("🗑️ User Deleted!");
        setUsers(users.filter((u) => u._id !== id));
      } else {
        console.log("❌ Failed to delete user");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>👥 Manage Users</h2>

      {loading && <p>⏳ Loading users...</p>}
      {error && <p style={{ color: 'red' }}>❌ {error}</p>}

      {!loading && users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }} border="1" cellPadding="10">
          <thead style={{ backgroundColor: '#e5e7eb' }}>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                <td>
                  <button 
                    onClick={() => deleteUser(user._id)} 
                    style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUsers;
