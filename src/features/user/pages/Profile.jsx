import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FiEdit2, FiCamera, FiMapPin, FiMail, FiPhone, FiCalendar, FiUser,
  FiGlobe, FiAward, FiNavigation, FiActivity, FiBookmark, FiShare2,
  FiMap, FiCheckCircle, FiClock, FiStar
} from 'react-icons/fi';
import { AnimatePresence, motion } from "framer-motion";
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import http from '../../../lib/axios';
import CustomDropdown from '../../../components/ui/CustomDropdown';
import PageLoader from '../../../components/ui/PageLoader';

const Reveal = ({ children, delay = 0, y = 20 }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.5, delay, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

const Profile = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // FETCH ALL DATA FOR DASHBOARD
  const { data: authData, isLoading: authLoading } = useQuery({ queryKey: ['userProfile'], queryFn: () => http.get('/auth/me') });
  const { data: tripsData } = useQuery({ queryKey: ['userTrips'], queryFn: () => http.get('/trips') });
  const { data: blogsData } = useQuery({ queryKey: ['userSavedBlogs'], queryFn: () => http.get('/blogs/user/saved') });
  const { data: statsData } = useQuery({ queryKey: ['userDashboardStats'], queryFn: () => http.get('/stats/user-dashboard') });

  const user = authData?.data?.user || authData?.user || {};
  const trips = tripsData?.data?.trips || tripsData?.trips || [];
  const savedBlogs = blogsData?.data?.blogs || blogsData?.blogs || [];

  const dashboardStats = statsData?.data?.stats || {
    statesExplored: 0, citiesVisited: 0, destinationsExplored: 0,
    tripsCompleted: 0, totalTrips: 0, savedBlogs: 0, travelStories: 0, avgRating: 0
  };
  const badges = statsData?.data?.badges || [];
  const timeline = statsData?.data?.timeline || [];

  const [form, setForm] = useState({
    name: user.name || '', phone: user.phone || '', bio: user.bio || '',
    city: user.city || '', state: user.state || '', country: user.country || '',
    gender: user.gender || '', dob: user.dob ? user.dob.split('T')[0] : ''});

  const updateMutation = useMutation({
    mutationFn: (payload) => http.put('/auth/profile', payload),
    onSuccess: (res) => {
      toast.success('Profile updated successfully!');
      queryClient.setQueryData(['userProfile'], { user: res.data?.user || res.user });
      setIsEditing(false);
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed to update profile')
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await http.post('/upload/single', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const profileImage = res.data?.image?.url || res.data?.data?.image?.url || res.image?.url;
      updateMutation.mutate({ profileImage });
    } catch (err) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await http.post('/upload/single', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const coverImage = res.data?.image?.url || res.data?.data?.image?.url || res.image?.url;
      updateMutation.mutate({ coverImage });
    } catch (err) {
      toast.error('Cover upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(form);
  };

  if (authLoading) return <div className="min-h-screen bg-[#07090f]"><PageLoader fullScreen={false} message="Loading profile..." size="md" /></div>;

  const upcomingTrips = trips.filter(t => t.status === 'upcoming' || t.status === 'draft');
  const ongoingTrips = trips.filter(t => t.status === 'ongoing');

  const shareBlog = (blog) => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        url: window.location.origin + '/blogs/' + blog.slug
      }).catch(console.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#edf2ff] font-sans pb-24 overflow-x-hidden selection:bg-[#E85D04] selection:text-white">

      {/*  PROFILE HEADER HERO  */}
      <section className="relative w-full mb-28 md:mb-40 pt-16">
        <div className="absolute inset-0 z-0 h-[300px] md:h-[400px] group/cover">
          <img src={user.coverImage || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80"} className="w-full h-full object-cover opacity-60" alt="Cover" />
          <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/60 to-transparent" />
          <label className="absolute top-6 right-6 flex items-center justify-center bg-black/60 hover:bg-black/80 text-white rounded-xl px-4 py-2 opacity-0 group-hover/cover:opacity-100 transition-opacity cursor-pointer z-20 gap-2 font-bold text-xs uppercase tracking-widest backdrop-blur-md border border-white/10">
            <FiCamera size={16} /> Change Cover
            <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} disabled={uploading} />
          </label>
        </div>

        <div className="relative z-10 max-w-[1600px] w-full mx-auto px-4 pt-[150px] md:pt-[250px]">
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#0c1018]/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-8">

            {/* Profile Avatar */}
            <div className="relative group shrink-0 -mt-24 md:-mt-32">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-[6px] border-[#0c1018] overflow-hidden shadow-2xl bg-black relative">
                <img src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=E85D04&color=fff&size=200`} alt={user.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-[6px] border-transparent m-auto w-32 h-32 md:w-48 md:h-48 z-20">
                <FiCamera size={32} />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left pt-2 md:pt-4">
              <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">{user.name}</h1>
                <span className="bg-[#E85D04]/20 text-[#E85D04] border border-[#E85D04]/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_15px_rgba(232,93,4,0.3)]">
                  <FiAward /> Verified Explorer
                </span>
              </div>
              <p className="text-[#E85D04] font-bold text-sm mb-4 uppercase tracking-widest">
                @{user.username || user.name.toLowerCase().replace(/\s/g, '')} • Member since {new Date(user.createdAt || Date.now()).getFullYear()}
              </p>
              <p className="text-white/70 max-w-2xl leading-relaxed text-sm md:text-base font-light mb-4">
                {user.bio || "An avid explorer looking for the next great adventure across India's beautiful landscapes."}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-2 text-white/50 text-sm font-bold uppercase tracking-wider">
                <FiMapPin className="text-[#E85D04]" /> {user.city || 'Somewhere'}, {user.state || 'India'}
              </div>
            </div>

            {/* Actions */}
            <div className="shrink-0 flex flex-col sm:flex-row md:flex-col lg:flex-row items-center gap-3 w-full md:w-auto pt-4 md:pt-4">
              {!isEditing ? (
                <button onClick={() => { setForm({ ...user, dob: user.dob ? user.dob.split('T')[0] : '' }); setIsEditing(true); }} className="w-full sm:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm">
                  <FiEdit2 size={16} /> Edit Profile
                </button>
              ) : (
                <button onClick={() => setIsEditing(false)} className="w-full sm:w-auto px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-xl font-bold transition-all text-sm">
                  Cancel Edit
                </button>
              )}
              <button onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: user.name + "'s Profile",
                    url: window.location.href
                  }).catch(console.error);
                }
              }} className="w-full sm:w-auto px-6 py-3 bg-[#E85D04] hover:bg-[#D05203] border border-[#E85D04] text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(232,93,4,0.3)] text-sm">
                <FiShare2 size={16} /> Share Profile
              </button>
            </div>
          </motion.div>
        </div>

        {/*  HERO STATS ROW  */}
        <div className="relative z-10 max-w-[1600px] w-full mx-auto px-4 mt-8">
          <Reveal delay={0.2}>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'States Explored', value: dashboardStats.statesExplored, icon: FiMapPin, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { label: 'Cities Visited', value: dashboardStats.citiesVisited, icon: FiGlobe, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { label: 'Trips Completed', value: dashboardStats.tripsCompleted, icon: FiNavigation, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                { label: 'Saved Blogs', value: dashboardStats.savedBlogs, icon: FiBookmark, color: 'text-pink-400', bg: 'bg-pink-500/10' },
              ].map((stat, i) => (
                <div key={i} className={`bg-[#0c1018]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-xl hover:-translate-y-1 transition-transform`}>
                  <div className={`w-12 h-12 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                    <stat.icon size={20} />
                  </div>
                  <span className="text-3xl font-black mb-1 text-white">{stat.value}</span>
                  <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/*  EDIT FORM  */}
      <AnimatePresence>
        {isEditing && (
          <motion.section initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="max-w-[1600px] w-full mx-auto px-4 mb-16 overflow-hidden">
            <form onSubmit={handleSubmit} className="bg-[#0c1018] border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl">
              <h3 className="text-2xl font-black mb-8 text-[#E85D04]">Update Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Full Name</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-5 py-4 bg-[#050505] border border-white/10 rounded-xl focus:outline-none focus:border-[#E85D04] transition-colors text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Phone</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-5 py-4 bg-[#050505] border border-white/10 rounded-xl focus:outline-none focus:border-[#E85D04] transition-colors text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">City</label>
                  <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full px-5 py-4 bg-[#050505] border border-white/10 rounded-xl focus:outline-none focus:border-[#E85D04] transition-colors text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">State</label>
                  <input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className="w-full px-5 py-4 bg-[#050505] border border-white/10 rounded-xl focus:outline-none focus:border-[#E85D04] transition-colors text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Country</label>
                  <input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} className="w-full px-5 py-4 bg-[#050505] border border-white/10 rounded-xl focus:outline-none focus:border-[#E85D04] transition-colors text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Gender</label>
                  <CustomDropdown
                    value={form.gender}
                    onChange={(val) => setForm({ ...form, gender: val })}
                    options={[
                      { value: "", label: "Prefer not to say" },
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                      { value: "other", label: "Other" }
                    ]}
                    placeholder="Prefer not to say"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Date of Birth</label>
                  <input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} className="w-full px-5 py-4 bg-[#050505] border border-white/10 rounded-xl focus:outline-none focus:border-[#E85D04] transition-colors text-white [color-scheme:dark]" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Bio</label>
                  <textarea rows={1} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="w-full px-5 py-4 bg-[#050505] border border-white/10 rounded-xl focus:outline-none focus:border-[#E85D04] transition-colors text-white resize-none" />
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button type="submit" disabled={updateMutation.isLoading} className="px-10 py-4 bg-[#E85D04] hover:bg-[#D05203] text-white font-black rounded-xl transition-colors shadow-[0_10px_20px_rgba(232,93,4,0.3)] disabled:opacity-50 text-sm uppercase tracking-widest">
                  Save Changes
                </button>
              </div>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      {/*  TABS NAVIGATION  */}
      <div className="max-w-[1600px] w-full mx-auto px-4 mb-8">
        <div className="flex overflow-x-auto hide-scrollbar gap-2 p-1.5 bg-[#0c1018] rounded-2xl border border-white/10 w-fit">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'trips', label: 'My Trips' },
            { id: 'blogs', label: 'Saved Blogs' },
            { id: 'timeline', label: 'Activity' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all shrink-0 ${activeTab === tab.id ? 'bg-[#E85D04] text-white shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/*  MAIN LAYOUT (70 / 30)  */}
      <div className="max-w-[1600px] w-full mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10 pb-20">

        {/*  LEFT MAIN CONTENT (70%)  */}
        <div className="lg:col-span-8 space-y-12">

          {/* TAB: OVERVIEW OR TRIPS */}
          {(activeTab === 'overview' || activeTab === 'trips') && (
            <Reveal>
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl md:text-3xl font-black text-white">Recent Trips</h2>
                <Link to="/user/trips" className="text-[#E85D04] font-bold text-xs uppercase tracking-widest hover:underline">View All</Link>
              </div>

              {trips.length === 0 ? (
                <div className="bg-[#0c1018] border border-white/5 rounded-[2rem] p-12 text-center shadow-xl">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-white/20"><FiMap size={32} /></div>
                  <h3 className="text-xl font-bold text-white mb-2">No trips planned yet</h3>
                  <p className="text-white/50 mb-8 max-w-sm mx-auto">Your next great adventure is waiting. Start exploring destinations and plan your itinerary.</p>
                  <Link to="/destinations" className="inline-block bg-[#E85D04] hover:bg-[#D05203] text-white font-bold px-8 py-3 rounded-full transition shadow-[0_10px_20px_rgba(232,93,4,0.3)]">Explore Destinations</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {trips.slice(0, 4).map((trip, idx) => {
                    const firstPlace = trip.places?.[0]?.placeId;
                    const cImg = trip.coverImage || firstPlace?.images?.hero || firstPlace?.images?.thumbnail || firstPlace?.images?.gallery?.[0] || "https://images.unsplash.com/photo-1506461883276-594a12b11ac3?auto=format&fit=crop&q=80";
                    return (
                      <div key={idx} className="bg-[#0c1018] rounded-3xl border border-white/5 overflow-hidden shadow-xl group hover:-translate-y-1 transition-all hover:border-white/10 flex flex-col">
                        <div className="h-48 relative overflow-hidden shrink-0">
                          <img src={cImg} onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1506461883276-594a12b11ac3?auto=format&fit=crop&q=80" }} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={trip.name} />
                          <div className="absolute inset-0 bg-linear-to-t from-[#0c1018] to-transparent" />
                          <div className="absolute top-4 left-4">
                            {trip.status === 'upcoming' && <span className="bg-blue-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-blue-400/50 flex items-center gap-1.5"><FiClock size={12} /> Upcoming</span>}
                            {trip.status === 'completed' && <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-emerald-400/50 flex items-center gap-1.5"><FiCheckCircle size={12} /> Completed</span>}
                            {trip.status === 'ongoing' && <span className="bg-[#E85D04]/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-[#E85D04]/50 flex items-center gap-1.5"><FiActivity size={12} /> Ongoing</span>}
                          </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          <h3 className="text-xl font-black text-white mb-2">{trip.name}</h3>
                          <p className="text-white/50 text-xs font-bold flex items-center gap-2 mb-6 uppercase tracking-wider">
                            <FiCalendar className="text-[#E85D04]" size={14} />
                            {trip.startDate ? new Date(trip.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Unscheduled'}
                          </p>
                          <Link to={`/user/trips/${trip._id}`} className="mt-auto block w-full text-center bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 rounded-xl transition-colors text-sm uppercase tracking-widest">
                            View Itinerary
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </Reveal>
          )}

          {/* TAB: OVERVIEW OR SAVED BLOGS */}
          {(activeTab === 'overview' || activeTab === 'blogs') && (
            <Reveal delay={0.1}>
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl md:text-3xl font-black text-white">Saved Blogs</h2>
                <Link to="/user/saved-blogs" className="text-[#E85D04] font-bold text-xs uppercase tracking-widest hover:underline">View All</Link>
              </div>

              <div className="space-y-4">
                {savedBlogs.length === 0 ? (
                  <div className="bg-[#0c1018] border border-white/5 rounded-[2rem] p-10 text-center">
                    <p className="text-white/50">No saved blogs yet.</p>
                  </div>
                ) : (
                  savedBlogs.slice(0, activeTab === 'blogs' ? 10 : 3).map((item, idx) => {
                    // Handle populate structure differences if any
                    const blog = item.entityId || item;
                    if (!blog || !blog.title) return null;

                    return (
                      <div key={idx} className="flex flex-col sm:flex-row gap-5 p-4 rounded-3xl bg-[#0c1018] border border-white/5 hover:border-white/10 hover:bg-[#111622] transition-colors group">
                        <div className="w-full sm:w-40 h-32 rounded-2xl overflow-hidden shrink-0 relative">
                          <img src={blog.images?.thumbnail || blog.images?.hero || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80"} onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80" }} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={blog.title} />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h4 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-[#E85D04] transition-colors">{blog.title}</h4>
                          <p className="text-white/50 text-xs font-medium line-clamp-2 mb-3 leading-relaxed">{blog.excerpt || "Explore the best destinations and travel tips."}</p>
                          <div className="flex items-center gap-4 text-[10px] font-bold text-white/40 uppercase tracking-widest mt-auto">
                            <span className="flex items-center gap-1.5"><FiClock className="text-[#E85D04]" /> {new Date(blog.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>
                        <div className="flex sm:flex-col items-center justify-end gap-2 shrink-0">
                          <button onClick={() => shareBlog(blog)} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors">
                            <FiShare2 size={16} />
                          </button>
                          <Link to={`/blogs/${blog.slug}`} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors">
                            <FiBookmark className="fill-[#E85D04] text-[#E85D04]" size={16} />
                          </Link>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </Reveal>
          )}

          {/* TAB: TIMELINE */}
          {(activeTab === 'timeline') && (
            <Reveal delay={0.2}>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-8">Recent Activity</h2>
              <div className="bg-[#0c1018] rounded-[2rem] border border-white/5 p-8 relative">
                <div className="absolute left-12 top-12 bottom-12 w-px bg-white/10" />
                <div className="space-y-10 relative">
                  {timeline.length === 0 ? (
                    <p className="text-white/50 text-center py-10">No recent activities.</p>
                  ) : (
                    timeline.map((act, i) => (
                      <div key={i} className="flex gap-6 relative group">
                        <div className="w-8 h-8 rounded-full bg-[#050505] border-[3px] border-[#E85D04] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(232,93,4,0.4)] z-10 group-hover:scale-125 transition-transform">
                          <div className="w-2 h-2 rounded-full bg-[#E85D04]" />
                        </div>
                        <div className="flex-1 pt-1.5">
                          <p className="text-[10px] font-bold text-[#E85D04] uppercase tracking-widest mb-1">{new Date(act.date).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                          <h4 className="text-base font-bold text-white mb-1">{act.action}</h4>
                          <p className="text-white/60 text-sm">{act.item}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Reveal>
          )}
        </div>

        {/*  RIGHT SIDEBAR (30%)  */}
        <div className="lg:col-span-4 space-y-6">

          {/* Personal Info */}
          <Reveal>
            <div className="bg-[#0c1018] rounded-[2rem] border border-white/5 p-8 shadow-xl">
              <h3 className="text-lg font-black text-white mb-6">Personal Information</h3>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 shrink-0"><FiMail size={16} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-0.5">Email</p>
                    <p className="text-sm font-medium text-white">{user.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 shrink-0"><FiPhone size={16} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-0.5">Phone</p>
                    <p className="text-sm font-medium text-white">{user.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 shrink-0"><FiMapPin size={16} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-0.5">Location</p>
                    <p className="text-sm font-medium text-white">{user.city ? `${user.city}, ${user.state}, ${user.country}` : 'N/A'}</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 shrink-0"><FiUser size={16} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-0.5">Gender</p>
                    <p className="text-sm font-medium text-white capitalize">{user.gender || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 shrink-0"><FiCalendar size={16} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-0.5">Birthday</p>
                    <p className="text-sm font-medium text-white">{user.dob ? new Date(user.dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Travel Progress */}
          <Reveal delay={0.1}>
            <div className="bg-[#0c1018] rounded-[2rem] border border-white/5 p-8 shadow-xl">
              <h3 className="text-lg font-black text-white mb-6">Travel Progress</h3>

              <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-xs font-bold text-white/70">States Explored</p>
                  <p className="text-[10px] font-black text-[#E85D04] tracking-widest">{dashboardStats.statesExplored} / 28</p>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#E85D04] rounded-full shadow-[0_0_10px_rgba(232,93,4,0.5)]" style={{ width: `${Math.min((dashboardStats.statesExplored / 28) * 100, 100)}%` }} />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-xs font-bold text-white/70">Destinations</p>
                  <p className="text-[10px] font-black text-purple-400 tracking-widest">{dashboardStats.destinationsExplored} / 500</p>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ width: `${Math.min((dashboardStats.destinationsExplored / 500) * 100, 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <p className="text-xs font-bold text-white/70">Trips Completed</p>
                  <p className="text-[10px] font-black text-emerald-400 tracking-widest">{dashboardStats.tripsCompleted} / 50</p>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${Math.min((dashboardStats.tripsCompleted / 50) * 100, 100)}%` }} />
                </div>
              </div>
            </div>
          </Reveal>

          {/* Badges */}
          <Reveal delay={0.2}>
            <div className="bg-[#0c1018] rounded-[2rem] border border-white/5 p-8 shadow-xl">
              <h3 className="text-lg font-black text-white mb-6">Travel Achievements</h3>
              <div className="grid grid-cols-3 gap-4">
                {badges.map((badge, i) => (
                  <div key={i} className="flex flex-col items-center text-center group cursor-default">
                    <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${badge.color || 'from-orange-500 to-red-600'} flex items-center justify-center text-2xl shadow-xl group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 border border-white/20 mb-3`}>
                      {badge.icon}
                    </div>
                    <p className="text-xs font-bold text-white leading-tight mb-1">{badge.name}</p>
                    <p className="text-[9px] text-white/40 leading-tight">{badge.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </div>
  );
};

export default Profile;