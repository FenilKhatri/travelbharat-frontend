import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiEdit2, FiCamera, FiMapPin, FiMail, FiPhone, FiCalendar, FiUser, FiGlobe, FiAward, FiNavigation, FiActivity, FiMap } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import http from '../../../lib/axios';
import { Link } from 'react-router-dom';

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

  // FETCH ALL DATA FOR DASHBOARD
  const { data: authData, isLoading: authLoading } = useQuery({ queryKey: ['userProfile'], queryFn: () => http.get('/auth/me') });
  const { data: tripsData } = useQuery({ queryKey: ['userTrips'], queryFn: () => http.get('/trips') });
  const { data: likesData } = useQuery({ queryKey: ['userLikes'], queryFn: () => http.get('/likes') });
  const { data: blogsData } = useQuery({ queryKey: ['userSavedBlogs'], queryFn: () => http.get('/blogs/user/saved') });

  const user = authData?.data?.user || authData?.user || {};
  const trips = tripsData?.data?.trips || tripsData?.trips || [];
  const likes = likesData?.data?.likes || likesData?.likes || [];
  const savedBlogs = blogsData?.data?.blogs || blogsData?.blogs || [];

  const [form, setForm] = useState({
    name: user.name || '', phone: user.phone || '', bio: user.bio || '',
    city: user.city || '', state: user.state || '', country: user.country || '',
    gender: user.gender || '', dob: user.dob ? user.dob.split('T')[0] : '',
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(form);
  };

  // AGGREGATED DATA LOGIC
  const { timeline, stats } = useMemo(() => {
    // 1. Exact Stats Calculation
    const tripStates = trips.map(t => t.places?.[0]?.stateId?.name).filter(Boolean);
    const visitedStates = Array.from(new Set(tripStates)).length;
    
    const tripCities = trips.map(t => t.places?.[0]?.cityId?.name).filter(Boolean);
    const visitedCities = Array.from(new Set(tripCities)).length;

    const statsObj = { states: visitedStates, cities: visitedCities, trips: trips.length, stories: savedBlogs.length };

    // 2. Exact Timeline from backend dates
    let activities = [];
    trips.slice(0,3).forEach(t => activities.push({ type: 'trip', action: 'Planned Trip', item: t.name, date: t.createdAt }));
    likes.slice(0,3).forEach(l => activities.push({ type: 'like', action: 'Liked', item: 'A destination', date: l.createdAt }));
    savedBlogs.slice(0,3).forEach(b => activities.push({ type: 'blog', action: 'Saved Story', item: b.title, date: b.createdAt }));
    
    activities = activities.sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,6);

    return { timeline: activities, stats: statsObj };
  }, [trips, likes, savedBlogs]);

  if (authLoading) return <div className="min-h-screen bg-[#020817] flex justify-center items-center"><div className="animate-spin w-12 h-12 border-4 border-[#FF7A00] border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-[100vh] bg-[#020817] text-white selection:bg-[#FF7A00] selection:text-white pb-24 overflow-x-hidden font-sans">
      
      {/* 1. HERO PROFILE SECTION */}
      <section className="relative w-full h-[250px] md:h-[300px] mb-24 mt-16">
        <div className="absolute inset-0 z-0">
           <img src="https://images.unsplash.com/photo-1506461883276-594a12b11ac3?auto=format&fit=crop&q=80" className="w-full h-full object-cover opacity-80" alt="Cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-[#020817]/60 to-transparent" />
        </div>
        
        <div className="absolute -bottom-24 left-0 w-full z-10 px-4">
           <div className="max-w-[1400px] mx-auto">
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.08)] rounded-[24px] p-6 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center md:items-start gap-8">
                 
                 <div className="relative group shrink-0 -mt-20 md:-mt-24">
                    <img src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=FF7A00&color=fff`} alt={user.name} className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#020817] object-cover bg-black shadow-2xl transition-transform duration-500 group-hover:scale-105" />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-4 border-transparent">
                      <FiCamera size={28} />
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                 </div>

                 <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
                       <h1 className="text-4xl md:text-5xl font-black tracking-tight">{user.name}</h1>
                       <span className="bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/30 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1">
                          <FiAward /> Verified
                       </span>
                    </div>
                    <p className="text-[#FFB347] font-semibold text-lg mb-4">@{user.username || user.name.toLowerCase().replace(/\s/g, '')} • Joined {new Date(user.createdAt || Date.now()).getFullYear()}</p>
                    <p className="text-white/60 max-w-2xl leading-relaxed text-sm md:text-base">
                       {user.bio || "An avid explorer looking for the next great adventure across India's beautiful landscapes."}
                    </p>
                 </div>

                 <div className="shrink-0 flex flex-col items-center md:items-end w-full md:w-auto mt-4 md:mt-0">
                    {!isEditing ? (
                      <button onClick={() => { setForm({ ...user, dob: user.dob ? user.dob.split('T')[0] : '' }); setIsEditing(true); }} className="w-full md:w-auto px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                        <FiEdit2 size={16} /> Edit Profile
                      </button>
                    ) : (
                      <button onClick={() => setIsEditing(false)} className="w-full md:w-auto px-8 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-xl font-bold transition-all">
                        Cancel Edit
                      </button>
                    )}
                 </div>

              </motion.div>
           </div>
        </div>
      </section>

      {/* EDIT FORM (Conditionally rendered) */}
      <AnimatePresence>
        {isEditing && (
          <motion.section initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="max-w-[1400px] mx-auto px-4 mb-16 overflow-hidden">
             <form onSubmit={handleSubmit} className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.08)] rounded-[24px] p-8 shadow-xl mt-4">
                <h3 className="text-2xl font-black mb-6 text-[#FF7A00]">Update Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Full Name</label>
                    <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 bg-[#020817]/50 border border-white/10 rounded-xl focus:outline-none focus:border-[#FF7A00] transition-colors text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Phone</label>
                    <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-3 bg-[#020817]/50 border border-white/10 rounded-xl focus:outline-none focus:border-[#FF7A00] transition-colors text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">City</label>
                    <input value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full px-4 py-3 bg-[#020817]/50 border border-white/10 rounded-xl focus:outline-none focus:border-[#FF7A00] transition-colors text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">State</label>
                    <input value={form.state} onChange={e => setForm({...form, state: e.target.value})} className="w-full px-4 py-3 bg-[#020817]/50 border border-white/10 rounded-xl focus:outline-none focus:border-[#FF7A00] transition-colors text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Country</label>
                    <input value={form.country} onChange={e => setForm({...form, country: e.target.value})} className="w-full px-4 py-3 bg-[#020817]/50 border border-white/10 rounded-xl focus:outline-none focus:border-[#FF7A00] transition-colors text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Gender</label>
                    <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} className="w-full px-4 py-3 bg-[#020817]/50 border border-white/10 rounded-xl focus:outline-none focus:border-[#FF7A00] transition-colors text-white capitalize">
                       <option value="" className="bg-[#020817]">Prefer not to say</option>
                       <option value="male" className="bg-[#020817]">Male</option>
                       <option value="female" className="bg-[#020817]">Female</option>
                       <option value="other" className="bg-[#020817]">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Date of Birth</label>
                    <input type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} className="w-full px-4 py-3 bg-[#020817]/50 border border-white/10 rounded-xl focus:outline-none focus:border-[#FF7A00] transition-colors text-white [color-scheme:dark]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Bio</label>
                    <textarea rows={1} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} className="w-full px-4 py-3 bg-[#020817]/50 border border-white/10 rounded-xl focus:outline-none focus:border-[#FF7A00] transition-colors text-white" />
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button type="submit" disabled={updateMutation.isLoading} className="px-8 py-3 bg-[#FF7A00] hover:bg-[#FFB347] hover:text-[#020817] text-white font-black rounded-xl transition-colors shadow-[0_10px_20px_rgba(255,122,0,0.3)] disabled:opacity-50">
                    Save Changes
                  </button>
                </div>
             </form>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 xl:grid-cols-12 gap-8 py-10">
        
        {/* LEFT COLUMN: Main Content (8 cols) */}
        <div className="xl:col-span-8 space-y-12">
           
           {/* 2. TRAVEL STATS ROW */}
           <section>
              <Reveal>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'States Explored', value: stats.states, icon: FiMapPin, color: 'text-blue-400' },
                      { label: 'Cities Visited', value: stats.cities, icon: FiGlobe, color: 'text-emerald-400' },
                      { label: 'Trips Completed', value: stats.trips, icon: FiNavigation, color: 'text-purple-400' },
                      { label: 'Travel Stories', value: stats.stories, icon: FiEdit2, color: 'text-pink-400' },
                    ].map((stat, i) => (
                      <motion.div whileHover={{ y: -5 }} key={i} className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.08)] rounded-[24px] p-6 flex flex-col items-center justify-center text-center shadow-lg">
                         <stat.icon className={`mb-3 ${stat.color}`} size={28} />
                         <span className="text-4xl font-black mb-1">{stat.value}</span>
                         <span className="text-white/50 text-xs font-bold uppercase tracking-widest">{stat.label}</span>
                      </motion.div>
                    ))}
                 </div>
              </Reveal>
           </section>

           {/* 5. RECENT TRIPS */}
           <section>
              <Reveal>
                 <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl md:text-3xl font-black">Recent Trips</h2>
                    <Link to="/user/trips" className="text-[#FF7A00] font-bold text-sm uppercase tracking-widest hover:underline">View All</Link>
                 </div>
                 {trips.length === 0 ? (
                    <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-[24px] p-10 text-center">
                       <p className="text-white/50">No trips planned yet.</p>
                       <Link to="/places" className="inline-block mt-4 text-[#FF7A00] font-bold border border-[#FF7A00]/30 px-6 py-2 rounded-full">Explore Destinations</Link>
                    </div>
                 ) : (
                    <div className="flex overflow-x-auto gap-6 pb-6 hide-scrollbar snap-x">
                       {trips.slice(0, 4).map((trip) => (
                          <motion.div whileHover={{ scale: 1.02 }} key={trip._id} className="shrink-0 snap-center w-[280px] sm:w-[320px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] rounded-[24px] overflow-hidden group cursor-pointer">
                             <div className="h-40 overflow-hidden relative">
                                <img src={trip.places?.[0]?.placeId?.images?.thumbnail || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" alt="trip cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#020817] to-transparent opacity-80" />
                                <span className={`absolute top-4 left-4 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${trip.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                                  {trip.status}
                                </span>
                             </div>
                             <div className="p-6">
                                <h3 className="text-xl font-black mb-2 line-clamp-1 group-hover:text-[#FF7A00] transition-colors">{trip.name}</h3>
                                <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
                                   <FiCalendar /> {new Date(trip.startDate).toLocaleDateString()}
                                </div>
                                <Link to={`/user/trips/${trip._id}`} className="block w-full text-center py-2 bg-white/5 hover:bg-[#FF7A00] hover:text-white border border-white/10 hover:border-[#FF7A00] rounded-xl font-bold transition-colors text-sm">
                                   View Itinerary
                                </Link>
                             </div>
                          </motion.div>
                       ))}
                    </div>
                 )}
              </Reveal>
           </section>

        </div>

        {/* RIGHT COLUMN: Sidebar Content (4 cols) */}
        <div className="xl:col-span-4 space-y-8">
           
           {/* 9. PERSONAL INFO */}
           <Reveal delay={0.1}>
              <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.08)] rounded-[24px] p-8">
                 <h3 className="text-lg font-black uppercase tracking-widest text-white/50 mb-6 flex items-center gap-2"><FiUser /> Personal Info</h3>
                 <div className="space-y-5">
                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0"><FiMail className="text-[#FF7A00]" /></div>
                       <div className="min-w-0">
                          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Email</p>
                          <p className="font-medium text-sm truncate">{user.email}</p>
                       </div>
                    </div>
                    {user.phone && (
                      <div className="flex items-start gap-4">
                         <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0"><FiPhone className="text-[#FF7A00]" /></div>
                         <div>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Phone</p>
                            <p className="font-medium text-sm">{user.phone}</p>
                         </div>
                      </div>
                    )}
                    {(user.city || user.state || user.country) && (
                      <div className="flex items-start gap-4">
                         <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0"><FiMapPin className="text-[#FF7A00]" /></div>
                         <div>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Location</p>
                            <p className="font-medium text-sm">{[user.city, user.state, user.country].filter(Boolean).join(', ')}</p>
                         </div>
                      </div>
                    )}
                    {user.gender && (
                      <div className="flex items-start gap-4">
                         <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0"><FiUser className="text-[#FF7A00]" /></div>
                         <div>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Gender</p>
                            <p className="font-medium text-sm capitalize">{user.gender}</p>
                         </div>
                      </div>
                    )}
                    {user.dob && (
                      <div className="flex items-start gap-4">
                         <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0"><FiCalendar className="text-[#FF7A00]" /></div>
                         <div>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Birthday</p>
                            <p className="font-medium text-sm">{new Date(user.dob).toLocaleDateString()}</p>
                         </div>
                      </div>
                    )}
                 </div>
              </div>
           </Reveal>



           {/* 3. ACTIVITY TIMELINE */}
           <Reveal delay={0.3}>
              <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.08)] rounded-[24px] p-8">
                 <h3 className="text-lg font-black uppercase tracking-widest text-white/50 mb-8 flex items-center gap-2"><FiActivity /> Recent Activity</h3>
                 
                 <div className="relative border-l-2 border-white/10 ml-4 space-y-8 pb-4">
                    {timeline.length > 0 ? timeline.map((act, i) => (
                       <div key={i} className="relative pl-8 group cursor-default">
                          <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-[#020817] border-[4px] border-[#FF7A00] group-hover:scale-125 transition-transform" />
                          <div>
                             <p className="text-xs font-bold text-[#FFB347] uppercase tracking-widest mb-1">
                               {new Date(act.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                             </p>
                             <p className="text-sm text-white/80">
                               <strong className="text-white">{act.action}</strong> {act.item}
                             </p>
                          </div>
                       </div>
                    )) : (
                       <div className="relative pl-8">
                          <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-[#020817] border-[4px] border-white/20" />
                          <p className="text-white/50 text-sm">No recent activity found in your account.</p>
                       </div>
                    )}
                 </div>
              </div>
           </Reveal>

        </div>
      </div>
    </div>
  );
};

const FiCheck = (props) => <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}><polyline points="20 6 9 17 4 12"></polyline></svg>;

export default Profile;
