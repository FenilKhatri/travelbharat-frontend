import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiEdit2, FiTrash2, FiEye, FiClock, FiAlertCircle } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import http from '../../../lib/axios';
import PageLoader from '../../../components/ui/PageLoader';

const MyBlogs = () => {
  const [activeTab, setActiveTab] = useState('published');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['myBlogs'],
    queryFn: () => http.get('/blogs/user/my-blogs')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => http.post(`/blogs/${id}/request-delete`),
    onSuccess: () => {
      toast.success("Delete request submitted");
      queryClient.invalidateQueries(['myBlogs']);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to submit request");
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 bg-[#050B14]">
        <PageLoader fullScreen={false} message="Loading blogs..." size="md" />
      </div>
    );
  }

  const blogs = data?.data?.blogs || [];
  
  const published = blogs.filter(b => b.status === 'published');
  const pending = blogs.filter(b => b.status === 'pending');
  const drafts = blogs.filter(b => b.status === 'draft');
  const rejected = blogs.filter(b => b.status === 'rejected');

  const getActiveList = () => {
    switch(activeTab) {
      case 'published': return published;
      case 'pending': return pending;
      case 'drafts': return drafts;
      case 'rejected': return rejected;
      default: return [];
    }
  };

  const activeList = getActiveList();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050B14] pt-24 pb-12 px-4 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black">My Blogs</h1>
          <Link to="/user/write-blog" className="bg-[#E85D04] px-6 py-2 rounded-xl font-bold hover:bg-[#D05203] transition">Write a Blog</Link>
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {['published', 'pending', 'drafts', 'rejected'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm capitalize whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-[#E85D04] text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
            >
              {tab} ({
                tab === 'published' ? published.length :
                tab === 'pending' ? pending.length :
                tab === 'drafts' ? drafts.length :
                rejected.length
              })
            </button>
          ))}
        </div>

        {activeList.length === 0 ? (
          <div className="bg-[#0c1018] rounded-3xl p-12 text-center border border-white/5">
            <h3 className="text-xl font-bold mb-2">No blogs found</h3>
            <p className="text-white/50">You don't have any {activeTab} blogs yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeList.map(blog => (
              <div key={blog._id} className="bg-[#0c1018] rounded-3xl border border-white/5 overflow-hidden flex flex-col group">
                <div className="h-48 relative overflow-hidden">
                  <img src={blog.images?.thumbnail || blog.images?.hero || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={blog.title} />
                  {blog.editRequest && (
                    <span className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
                      <FiClock /> Edit Pending
                    </span>
                  )}
                  {blog.deleteRequest && (
                    <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
                      <FiTrash2 /> Delete Pending
                    </span>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold mb-2 line-clamp-2">{blog.title}</h3>
                  <p className="text-white/50 text-sm mb-4 line-clamp-2">{blog.excerpt || "No excerpt available."}</p>
                  
                  {blog.status === 'rejected' && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
                      <p className="text-red-400 text-xs font-bold flex items-center gap-1 mb-1"><FiAlertCircle /> Rejection Reason:</p>
                      <p className="text-white/70 text-xs">{blog.rejectionReason}</p>
                    </div>
                  )}

                  <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-white/50 text-xs flex items-center gap-1"><FiEye /> {blog.views}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/blogs/${blog.slug}`} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white transition"><FiEye size={14}/></Link>
                      <button onClick={() => navigate(`/user/edit-blog/${blog._id}`)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-[#E85D04] text-white/70 hover:text-white transition"><FiEdit2 size={14}/></button>
                      <button 
                        onClick={() => {
                          if (window.confirm("Are you sure you want to request deletion for this blog?")) {
                            deleteMutation.mutate(blog._id);
                          }
                        }}
                        disabled={deleteMutation.isPending || blog.deleteRequest}
                        className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-red-500 text-white/70 hover:text-white transition disabled:opacity-50"
                      ><FiTrash2 size={14}/></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBlogs;
