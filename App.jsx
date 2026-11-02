import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // Load initial data from LocalStorage
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('crud_users_data')
    return savedUsers ? JSON.parse(savedUsers) : [
      { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', role: 'Developer' },
      { id: 2, name: 'Priya Patel', email: 'priya@example.com', role: 'Designer' }
    ]
  })

  const [formData, setFormData] = useState({ name: '', email: '', role: '' })
  const [editId, setEditId] = useState(null)

  // Sync with LocalStorage whenever users state changes
  useEffect(() => {
    localStorage.setItem('crud_users_data', JSON.stringify(users))
  }, [users])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Create or Update Handler
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim() || !formData.role.trim()) {
      alert('Please fill in all fields!')
      return
    }

    if (editId !== null) {
      // Update existing record
      const updatedUsers = users.map((user) =>
        user.id === editId ? { ...user, ...formData } : user
      )
      setUsers(updatedUsers)
      setEditId(null)
    } else {
      // Create new record
      const newUser = {
        id: Date.now(),
        ...formData
      }
      setUsers([...users, newUser])
    }

    // Reset Form
    setFormData({ name: '', email: '', role: '' })
  }

  // Populate form for Editing
  const handleEdit = (user) => {
    setEditId(user.id)
    setFormData({ name: user.name, email: user.email, role: user.role })
  }

  // Delete Record
  const handleDelete = (id) => {
    const filteredUsers = users.filter((user) => user.id !== id)
    setUsers(filteredUsers)
    if (editId === id) {
      setEditId(null)
      setFormData({ name: '', email: '', role: '' })
    }
  }

  const handleCancelEdit = () => {
    setEditId(null)
    setFormData({ name: '', email: '', role: '' })
  }

  return (
    <div className="container">
      <div className="crud-wrapper">
        <div className="header">
          <span className="badge">Project No: 3</span>
          <h1>CRUD with LocalStorage</h1>
          <p className="subtitle">Create, Read, Update & Delete Records in Table</p>
        </div>

        {/* Form Section */}
        <form className="crud-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter Full Name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Enter Email Address"
            value={formData.email}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="role"
            placeholder="Enter Role (e.g., Developer)"
            value={formData.role}
            onChange={handleInputChange}
          />
          <div className="form-buttons">
            <button type="submit" className={`btn ${editId ? 'btn-update' : 'btn-add'}`}>
              {editId ? 'Update Data' : '+ Add Data'}
            </button>
            {editId && (
              <button type="button" className="btn btn-cancel" onClick={handleCancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Table Section */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-row">
                    No records found. Add a new record above!
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td className="fw-bold">{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="role-tag">{user.role}</span>
                    </td>
                    <td className="action-cells">
                      <button
                        className="btn-action edit"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-action delete"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default App
