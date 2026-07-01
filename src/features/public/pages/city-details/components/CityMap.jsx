const CityMap = ({ city }) => {
  if (!city.mapCoordinates?.lat || !city.mapCoordinates?.lng) return null;

  return (
    <section className="h-[450px] w-full border-b border-white/5">
      <iframe
        title={`${city.name} Map`}
        width="100%"
        height="100%"
        style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) grayscale(80%) contrast(120%)" }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://maps.google.com/maps?q=${city.mapCoordinates.lat},${city.mapCoordinates.lng}&hl=en&z=13&output=embed`}
      />
    </section>
  );
};

export default CityMap;
