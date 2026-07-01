const HeroBackground = ({ currentBanner }) => {
  return (
    <>
      <div
        className="absolute inset-0 z-0 opacity-70 dark:opacity-100 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{
          backgroundImage: `url('https://plus.unsplash.com/premium_photo-1661919589683-f11880119fb7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`}}
      />
      {/* OVERLAY - Solid on the left for text readability, fading to transparent on the right to reveal the image */}
      <div className="absolute inset-0 bg-linear-to-t from-[#f8fafc] via-[#f8fafc]/50 to-[#f8fafc]/10 dark:from-[#070A11] dark:via-[#070A11]/90 dark:to-[#070A11]/40 z-0"></div>

      {/* GLOW EFFECTS */}
      <div className="absolute top-20 left-20 w-80 h-80 bg-[#FF8F00]/15 rounded-full blur-[120px] z-0"></div>
      <div className="absolute bottom-10 right-0 w-[420px] h-[420px] bg-[#E85D04]/10 rounded-full blur-[150px] z-0"></div>

      {/* BOTTOM BLEND */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-linear-to-t from-background to-transparent z-10"></div>
    </>
  );
};

export default HeroBackground;
