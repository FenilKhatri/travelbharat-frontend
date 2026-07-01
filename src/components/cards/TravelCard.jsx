import { Link } from "react-router-dom";
import {
  FiMapPin,
  FiCompass,
  FiCalendar,
  FiStar,
  FiArrowRight} from "react-icons/fi";
import { FaMapMarkerAlt } from "react-icons/fa";
import TravelBadge from "../ui/TravelBadge";
const TravelCard = ({ data, type, stateSlug, citySlug, index = 0 }) => {
  const image =
    data.images?.thumbnail?.url ||
    data.images?.hero?.url ||
    data.heroImage?.url;
  const name = data.name || "";
  const description = data.tagline || data.description || data.overview || "";
  let url = "#";
  switch (type) {
    case "state":
      url = `/states/${data.slug}`;
      break;
    case "city":
      url = `/states/${stateSlug}/cities/${data.slug}`;
      break;
    case "place":
      url = `/states/${stateSlug}/cities/${citySlug}/places/${data.slug}`;
      break;
    case "festival":
      url = `/festivals/${data.slug}`;
      break;
    default:
      url = "#";
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.55,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94]}}
      className="group h-[380px] sm:h-[430px]"
    >
      <Link
        to={url}
        aria-label={name}
        className=" relative flex flex-col h-full overflow-hidden rounded-[28px] bg-surface border border-border-theme shadow-lg shadow-slate-300/20 dark:shadow-black/40 hover:-translate-y-2 hover:border-orange-500/40 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 "
      >
        <div className="relative h-[72%] overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface-elevated">
              <FiMapPin
                size={58}
                className="text-slate-400 dark:text-slate-500"
              />
            </div>
          )}
          <div className=" absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-black/10 group-hover:from-black/80 group-hover:via-black/15 transition-all duration-500 " />
          <div className=" absolute inset-x-0 top-0 h-28 bg-linear-to-b from-black/40 to-transparent" />
          <div className="absolute left-5 top-5 z-20">
            {data.primaryBadge || data.badge ? (
              <TravelBadge badgeName={data.primaryBadge || data.badge?.name} />
            ) : (
              <div className="flex gap-2">
                {(type === "state" || type === "city") &&
                  data.totalPlaces > 0 && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-xl ">
                      <FiCompass className="text-orange-400" size={12} />
                      {data.totalPlaces}{" "}
                      {data.totalPlaces === 1 ? "Place" : "Places"}
                    </span>
                  )}
                {type === "place" && data.category?.name && (
                  <span className="rounded-full border border-white/15 bg-black/45 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-xl ">
                    {data.category.name}
                  </span>
                )}
                {type === "festival" && data.month && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-xl ">
                    <FiCalendar className="text-orange-400" size={12} />
                    {data.month}
                  </span>
                )}
                {type === "festival" && data.month && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-xl ">
                    {data.category.name}
                  </span>
                )}
                {type === "festival" && data.month && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-xl">
                    <FiCalendar size={12} className="text-orange-400" />
                    {data.month}
                  </span>
                )}
              </div>
            )}
          </div>
          {/* Rating Badge */}
          {type === "place" && data.rating > 0 && (
            <div className="absolute right-5 top-5 z-20">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-4 py-2 backdrop-blur-xl text-white">
                <FiStar className="fill-orange-400 text-orange-400" size={13} />
                <span className="font-bold text-xs">
                  {data.rating.toFixed(1)}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-between p-6 bg-surface transition-colors duration-500">
          <div>
            {/* Festival Location */}
            {type === "festival" && data.stateIds?.[0]?.name && (
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-accent mb-3">
                <FaMapMarkerAlt size={12} />
                {data.stateIds[0].name}
              </p>
            )}
            <h3 className="text-2xl font-extrabold text-primary line-clamp-1 transition-colors duration-300 group-hover:text-accent">
              {name}
            </h3>
            {description && (
              <p className="mt-3 line-clamp-2 text-sm leading-7 text-secondary transition-colors duration-300">
                {description}
              </p>
            )}
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted">
                {(type === "state" || type === "city") &&
                  data.totalPlaces > 0 && (
                    <>
                      <FiCompass className="text-orange-500" />
                      <span>
                        {data.totalPlaces}{" "}
                        {data.totalPlaces === 1
                          ? "Destination"
                          : "Destinations"}
                      </span>
                    </>
                  )}
                {type === "place" && data.category?.name && (
                  <>
                    <FiMapPin className="text-orange-500" />
                    <span>{data.category.name}</span>
                  </>
                )}
                {type === "festival" && data.month && (
                  <>
                    <FiCalendar className="text-orange-500" />
                    <span>{data.month}</span>
                  </>
                )}
              </div>
              {/* Right */}
              <div className="flex items-center gap-2 text-accent font-semibold translate-x-1 group-hover:translate-x-2 transition-transform duration-300">
                <span className="text-sm">Explore</span>
                <FiArrowRight />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
export default TravelCard;