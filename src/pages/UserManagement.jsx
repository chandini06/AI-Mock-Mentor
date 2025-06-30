import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserManagement.css';
import {
  Ban,
  RotateCcw,
  Trash2,
  ArrowLeft,
} from 'lucide-react';

function UserManagement() {
  const navigate = useNavigate();

  const getStoredUsers = () => {
    const saved = localStorage.getItem('userList');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Alice', email: 'alice@example.com', role: 'user', blocked: false },
      { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user', blocked: false },
      { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'admin', blocked: false },
    ];
  };

  const [users, setUsers] = useState(getStoredUsers);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' });

  useEffect(() => {
    localStorage.setItem('userList', JSON.stringify(users));
  }, [users]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      alert('Name and Email are required!');
      return;
    }

    const newUserData = {
      id: Date.now(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      blocked: false,
    };

    setUsers([...users, newUserData]);
    setNewUser({ name: '', email: '', role: 'user' });
  };

  const deleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const toggleBlock = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, blocked: !user.blocked } : user
      )
    );
  };

  const resetPassword = (id) => {
    alert(`Password reset link sent to user ID ${id}`);
  };

  const changeRole = (id, newRole) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, role: newRole } : user
      )
    );
  };

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <h2>User Management</h2>
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </div>

      {/* Create User Form */}
      <form className="create-user-form" onSubmit={handleCreateUser}>
        <h3>Create New User</h3>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newUser.name}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleInputChange}
        />
        <select name="role" value={newUser.role} onChange={handleInputChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Add User</button>
      </form>

      {/* User Table */}
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => changeRole(user.id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>{user.blocked ? 'Blocked' : 'Active'}</td>
              <td className="action-buttons">
                <button
                  title={user.blocked ? 'Unblock User' : 'Block User'}
                  onClick={() => toggleBlock(user.id)}
                >
                  <Ban size={18} />
                </button>
                <button
                  title="Reset Password"
                  onClick={() => resetPassword(user.id)}
                >
                  <RotateCcw size={18} />
                </button>
                <button
                  title="Delete User"
                  onClick={() => deleteUser(user.id)}
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
