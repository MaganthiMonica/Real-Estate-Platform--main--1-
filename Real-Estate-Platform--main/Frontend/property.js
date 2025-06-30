import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PropertyForm.css';

const API_URL = 'http://localhost:5000';
const API_KEY = '12345-secret-key';

export default function PropertyForm() {
  const [form, setForm] = useState({
    title: '', size: '', price: '', handoverDate: '', projectId: ''
  });
  const [projects, setProjects] = useState([]);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/api/projects`, {
      headers: { 'x-api-key': API_KEY }
    }).then(res => setProjects(res.data));
  }, []);

  useEffect(() => {
    const { title, size, price, handoverDate, projectId } = form;
    const future = new Date(handoverDate) > new Date();
    setIsValid(title && size > 0 && price > 0 && future && projectId);
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/properties`, form, {
        headers: { 'x-api-key': API_KEY }
      });
      alert(' Property saved');
      setForm({ title: '', size: '', price: '', handoverDate: '', projectId: '' });
    } catch (err) {
      alert(' Failed to save property');
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Property</h2>
      <form onSubmit={handleSubmit}>
        <select name="projectId" value={form.projectId} onChange={handleChange} required>
          <option value="">Select Project</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="size" type="number" placeholder="Size (sq. ft.)" value={form.size} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="handoverDate" type="date" value={form.handoverDate} onChange={handleChange} required />
        <button type="submit" disabled={!isValid}>Save</button>
      </form>

      <div className="preview-card">
        <h3>Live Preview</h3>
        <p><strong>Project:</strong> {projects.find(p => p.id === form.projectId)?.name || '-'}</p>
        <p><strong>Title:</strong> {form.title}</p>
        <p><strong>Size:</strong> {form.size} sq. ft.</p>
        <p><strong>Price:</strong> ${form.price}</p>
        <p><strong>Handover Date:</strong> {form.handoverDate && new Date(form.handoverDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>
    </div>
  );
}
