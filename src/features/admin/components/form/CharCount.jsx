const CharCount = ({ value, max }) => {
  const len = value?.length ?? 0;
  const over = len > max;
  return (
    <p className={`text-xs mt-1 text-right font-medium ${over ? "text-red-500" : "text-slate-400"}`}>
      {len}/{max}
    </p>
  );
};

export default CharCount;
