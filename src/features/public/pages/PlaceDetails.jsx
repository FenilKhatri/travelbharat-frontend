import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FiMapPin, FiStar, FiClock, FiHeart, FiShare2, FiChevronLeft, FiInfo, FiMap as MapIcon, FiLoader } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import { placeService } from "../../../services/placeService";
import Button from "../../../components/ui/Button";
import ReviewSection from "../components/ReviewSection";
import { toast } from "react-toastify";

const PlaceDetails = () => {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['placeDetails', slug],
    queryFn: () => placeService.getPlaceBySlug(slug)
  });

  const place = data?.data?.place;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: place?.name,
        text: `Check out ${place?.name} on TravelBharat!`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0A1628] flex justify-center items-center">
        <FiLoader className="animate-spin text-[#E85D04]" size={48} />
      </div>
    );
  }

  if (isError || !place) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0A1628] pt-32 px-4 text-center">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Destination Not Found</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">The place you are looking for does not exist or has been removed.</p>
        <Link to="/places">
          <Button>Back to Destinations</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A1628] pb-24">
      {/* Immersive Hero */}
      <div className="relative h-[60vh] min-h-[500px] w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${place.images?.hero || place.images?.thumbnail || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=2000"}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/40 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-24 left-4 md:left-12 z-10">
          <Link to="/places" className="flex items-center gap-2 text-white bg-black/20 hover:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full transition-all">
            <FiChevronLeft size={18} /> Back
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-4 md:p-12 z-10">
          <div className="max-w-[1600px] w-full mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-[#E85D04] text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                  {place.category}
                </span>
                <span className="flex items-center text-white text-sm font-medium bg-white/20 backdrop-blur-md px-3 py-1 rounded-md">
                  <FiMapPin size={14} className="mr-1" /> {place.cityId?.name}, {place.stateId?.name}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 leading-tight">
                {place.name}
              </h1>
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-1 text-[#D4A72C] font-semibold bg-[#D4A72C]/20 px-3 py-1 rounded-md">
                  <FiStar size={16} fill="currentColor" /> 
                  <span>{place.rating || 0}</span>
                  <span className="text-white/80 font-normal text-sm ml-1">({place.reviewCount || 0} reviews)</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all"
                title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <FiHeart size={20} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
              </button>
              <button onClick={handleShare} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all cursor-pointer">
                <FiShare2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1600px] w-full mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick FiInfo Bar */}
            <div className="bg-white dark:bg-[#060D18] rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800/50 flex flex-wrap gap-6 justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <FiClock size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Timings</p>
                  <p className="font-semibold text-slate-800 dark:text-white text-sm">{place.timings || "09:00 AM - 06:00 PM"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
                  <FaRupeeSign size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Entry Fee</p>
                  <p className="font-semibold text-slate-800 dark:text-white text-sm">{typeof place.entryFee === "object" ? (place.entryFee?.indian || "Free") : (place.entryFee || "Free")}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-[#E85D04]">
                  <MapIcon size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Trip Type</p>
                  <p className="font-semibold text-slate-800 dark:text-white text-sm capitalize">{place.tripType || "Family"}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 dark:border-slate-800 flex gap-8">
              {['overview', 'gallery', 'activities', 'reviews'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-semibold uppercase tracking-wider transition-colors relative ${
                    activeTab === tab 
                      ? "text-[#E85D04]" 
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E85D04]" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white dark:bg-[#060D18] rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800/50 min-h-[400px]">
              
              {activeTab === 'overview' && (
                <div className="prose dark:prose-invert max-w-none">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <FiInfo size={24} className="text-[#E85D04]"/> About {place.name}
                  </h3>
                  <div 
                    className="text-slate-600 dark:text-slate-300 leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: place.description || `<p>Experience the beauty and heritage of ${place.name}, one of the premier destinations in ${place.stateId?.name}. This location offers a unique blend of culture, history, and natural beauty.</p>` }}
                  />
                  
                  {place.bestTimeToVisit && (
                    <div className="mt-8 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                      <h4 className="font-bold text-slate-800 dark:text-white mb-2">Best Time To Visit</h4>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">{place.bestTimeToVisit}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'gallery' && (
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Gallery</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {place.images?.gallery?.length > 0 ? (
                      place.images.gallery.map((img, i) => (
                        <div key={i} className="aspect-square rounded-xl overflow-hidden cursor-pointer">
                          <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                        </div>
                      ))
                    ) : (
                      <p className="col-span-full text-slate-500 text-center py-10">No gallery images available yet.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'activities' && (
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Things to do</h3>
                  {place.activities?.length > 0 ? (
                    <ul className="space-y-3">
                      {place.activities.map((act, i) => (
                        <li key={i} className="flex items-start gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl">
                          <div className="w-2 h-2 mt-2 rounded-full bg-[#E85D04] shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300">{act}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500">Explore the surroundings and immerse yourself in the local culture.</p>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <ReviewSection placeId={place._id} />
              )}

            </div>
          </div>
          
          {/* Right Column: Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              
              {/* Add to Trip Widget */}
              <div className="bg-white dark:bg-[#060D18] rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-800/50">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Plan Your Visit</h3>
                <p className="text-slate-500 text-sm mb-6">Add this destination to your custom itinerary.</p>
                
                <Button className="w-full mb-3" size="lg">
                  <MapIcon size={18} /> Add to Trip Planner
                </Button>
                
                <p className="text-center text-xs text-slate-400 mt-4">
                  Requires a free TravelBharat account
                </p>
              </div>

              {/* Location Widget */}
              <div className="bg-white dark:bg-[#060D18] rounded-2xl p-1 overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800/50">
                {/* Manual Visual Representation instead of Google Maps API as requested */}
                <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-6 text-center h-48 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700">
                   <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mb-3 shadow-md">
                     <FiMapPin className="text-[#E85D04]" size={24} />
                   </div>
                   <p className="font-semibold text-slate-800 dark:text-white">{place.name}</p>
                   <p className="text-sm text-slate-500">{place.cityId?.name}, {place.stateId?.name}</p>
                   <p className="text-xs text-blue-500 mt-2 hover:underline cursor-pointer">View directions</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;



