import PageLoader from "../../../../components/ui/PageLoader";

const DestinationSelector = ({ placesLoading, allPlaces, updateTripData }) => {
  return (
    <div className="bg-[#050505] pt-20 min-h-screen font-sans text-white pb-32 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl md:text-5xl font-black mb-4">Where do you want to go?</h1>
      <p className="text-white/60 mb-8 text-center max-w-lg">Select a destination to start planning your perfect trip.</p>

      {placesLoading ? (
        <PageLoader fullScreen={false} message="Loading destinations..." />
      ) : (
        <div className="w-full max-w-md bg-[#0A0F1A] border border-white/10 rounded-2xl p-4 shadow-2xl">
          <div className="max-h-96 overflow-y-auto custom-scrollbar pr-2 space-y-2">
            {allPlaces.map((p) => (
              <button
                key={p._id}
                onClick={() => updateTripData({ destinationId: p._id, destination: p, name: `Trip to ${p.name}` })}
                className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 text-left"
              >
                <img src={p.images?.thumbnail || p.images?.hero} className="w-12 h-12 rounded-lg object-cover bg-white/10" alt="" />
                <div>
                  <h4 className="font-bold">{p.name}</h4>
                  <p className="text-xs text-white/50">{p.cityId?.name}, {p.stateId?.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationSelector;
