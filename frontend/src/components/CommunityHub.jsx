import React, { useEffect, useState } from 'react';
import { MessageSquare, UserCheck, Users, ShoppingBag, Send, Plus } from 'lucide-react';
import {
  getPosts, createPost, addReply,
  requestConsultation,
  getFarmers,
  getListings, createListing,
} from '../api/api';

const TABS = [
  { key: 'forum', label: 'Discussion Forum', icon: MessageSquare },
  { key: 'expert', label: 'Expert Advice', icon: UserCheck },
  { key: 'local', label: 'Local Connections', icon: Users },
  { key: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
];

export default function CommunityHub() {
  const [tab, setTab] = useState('forum');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Farmer Connect</h1>
        <p className="text-gray-500">Ask questions, get expert help, find nearby farmers, and trade produce.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm border border-gray-100 w-fit">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t.key ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'forum' && <ForumTab />}
      {tab === 'expert' && <ExpertTab />}
      {tab === 'local' && <LocalTab />}
      {tab === 'marketplace' && <MarketplaceTab />}
    </div>
  );
}

// ---------------- Discussion Forum ----------------
function ForumTab() {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ author: '', title: '', message: '' });
  const [replyText, setReplyText] = useState({});

  const load = () => getPosts().then(setPosts).catch(() => setPosts([]));
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.author || !form.title || !form.message) return;
    await createPost(form);
    setForm({ author: '', title: '', message: '' });
    setShowForm(false);
    load();
  };

  const handleReply = async (id) => {
    const message = replyText[id];
    if (!message) return;
    await addReply(id, { author: 'You', message });
    setReplyText({ ...replyText, [id]: '' });
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">Recent Questions</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6 space-y-3">
          <input placeholder="Your name" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5" />
          <input placeholder="Question title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5" />
          <textarea placeholder="Describe your question..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 h-24" />
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-xl text-sm">
            Post Question
          </button>
        </form>
      )}

      <div className="space-y-4">
        {posts.length === 0 && <p className="text-gray-400 text-sm">No discussions yet. Be the first to ask!</p>}
        {posts.map((p) => (
          <div key={p._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-800">{p.title}</h3>
            <p className="text-xs text-gray-400 mb-2">by {p.author}</p>
            <p className="text-sm text-gray-600 mb-3">{p.message}</p>

            {p.replies?.length > 0 && (
              <div className="border-t border-gray-100 pt-3 space-y-2 mb-3">
                {p.replies.map((r, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-xs font-medium text-gray-700">{r.author}</p>
                    <p className="text-sm text-gray-600">{r.message}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                placeholder="Write a reply..."
                value={replyText[p._id] || ''}
                onChange={(e) => setReplyText({ ...replyText, [p._id]: e.target.value })}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
              />
              <button onClick={() => handleReply(p._id)} className="text-emerald-600 hover:text-emerald-700">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- Expert Advice ----------------
function ExpertTab() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', cropConcern: '', description: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.cropConcern || !form.description) {
      return setError('Please fill in all required fields.');
    }
    setError('');
    await requestConsultation(form);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center max-w-lg mx-auto">
        <UserCheck className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
        <h3 className="font-bold text-gray-800 mb-1">Request Submitted</h3>
        <p className="text-sm text-gray-500">An agricultural expert will contact you within 24-48 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-lg space-y-4">
      <h2 className="text-lg font-bold text-gray-800">Request Expert Consultation</h2>
      <input placeholder="Full name" value={form.name} onChange={update('name')} className="w-full border border-gray-200 rounded-xl px-4 py-2.5" />
      <input placeholder="Phone number" value={form.phone} onChange={update('phone')} className="w-full border border-gray-200 rounded-xl px-4 py-2.5" />
      <input placeholder="Email (optional)" value={form.email} onChange={update('email')} className="w-full border border-gray-200 rounded-xl px-4 py-2.5" />
      <input placeholder="Crop concern (e.g. Rice - Blast disease)" value={form.cropConcern} onChange={update('cropConcern')} className="w-full border border-gray-200 rounded-xl px-4 py-2.5" />
      <textarea placeholder="Describe your issue in detail..." value={form.description} onChange={update('description')} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 h-24" />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl">
        Submit Request
      </button>
    </form>
  );
}

// ---------------- Local Connections ----------------
function LocalTab() {
  const [farmers, setFarmers] = useState([]);
  const [district, setDistrict] = useState('');

  const load = () => getFarmers(district ? { district } : {}).then(setFarmers).catch(() => setFarmers([]));
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  return (
    <div>
      <div className="flex gap-2 mb-6 max-w-md">
        <input placeholder="Filter by district..." value={district} onChange={(e) => setDistrict(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5" />
        <button onClick={load} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 rounded-xl text-sm">
          Search
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {farmers.length === 0 && <p className="text-gray-400 text-sm col-span-full">No farmer profiles found nearby yet.</p>}
        {farmers.map((f) => (
          <div key={f._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-800">{f.name}</h3>
            <p className="text-xs text-gray-400 mb-2">{f.village}, {f.district}, {f.state}</p>
            <p className="text-sm text-gray-600 mb-2">Crops: {f.primaryCrops?.join(', ') || 'N/A'}</p>
            {f.groupName && <p className="text-xs text-emerald-700 bg-emerald-50 inline-block px-2 py-1 rounded-lg mb-2">{f.groupName}</p>}
            <p className="text-xs text-gray-400">Contact: {f.contact}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- Marketplace ----------------
function MarketplaceTab() {
  const [listings, setListings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    sellerName: '', contact: '', category: 'Seeds', title: '', description: '', price: '', unit: 'kg', location: '',
  });

  const load = () => getListings().then(setListings).catch(() => setListings([]));
  useEffect(() => { load(); }, []);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.sellerName || !form.contact || !form.title || !form.price || !form.location) return;
    await createListing({ ...form, price: Number(form.price) });
    setShowForm(false);
    setForm({ sellerName: '', contact: '', category: 'Seeds', title: '', description: '', price: '', unit: 'kg', location: '' });
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">Buy & Sell</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl">
          <Plus className="w-4 h-4" /> List an Item
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6 grid sm:grid-cols-2 gap-3">
          <input placeholder="Your name" value={form.sellerName} onChange={update('sellerName')} className="border border-gray-200 rounded-xl px-4 py-2.5" />
          <input placeholder="Contact number" value={form.contact} onChange={update('contact')} className="border border-gray-200 rounded-xl px-4 py-2.5" />
          <select value={form.category} onChange={update('category')} className="border border-gray-200 rounded-xl px-4 py-2.5">
            {['Seeds', 'Equipment', 'Produce', 'Fertilizer', 'Other'].map((c) => <option key={c}>{c}</option>)}
          </select>
          <input placeholder="Item title" value={form.title} onChange={update('title')} className="border border-gray-200 rounded-xl px-4 py-2.5" />
          <input type="number" placeholder="Price (₹)" value={form.price} onChange={update('price')} className="border border-gray-200 rounded-xl px-4 py-2.5" />
          <input placeholder="Unit (e.g. kg, acre, item)" value={form.unit} onChange={update('unit')} className="border border-gray-200 rounded-xl px-4 py-2.5" />
          <input placeholder="Location" value={form.location} onChange={update('location')} className="border border-gray-200 rounded-xl px-4 py-2.5" />
          <textarea placeholder="Description" value={form.description} onChange={update('description')} className="sm:col-span-2 border border-gray-200 rounded-xl px-4 py-2.5 h-20" />
          <button type="submit" className="sm:col-span-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl">
            Publish Listing
          </button>
        </form>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.length === 0 && <p className="text-gray-400 text-sm col-span-full">No listings yet.</p>}
        {listings.map((l) => (
          <div key={l._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">{l.category}</span>
            <h3 className="font-bold text-gray-800 mt-2">{l.title}</h3>
            <p className="text-sm text-gray-500 mb-2">{l.description}</p>
            <p className="font-bold text-gray-800">₹{l.price} <span className="text-xs font-normal text-gray-400">/ {l.unit}</span></p>
            <p className="text-xs text-gray-400 mt-1">{l.location} · {l.sellerName} · {l.contact}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
