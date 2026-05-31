const H2 = ({ children, className = "" }) => {
  return (
    <h2
      className={`text-2xl font-bold text-slate-900 dark:text-white leading-tight ${className}`}
    >
      {children}
    </h2>
  );
};

export default H2;

