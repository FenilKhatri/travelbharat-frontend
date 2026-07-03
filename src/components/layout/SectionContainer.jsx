import React from 'react';

const SectionContainer = ({ children, className = "", as: Component = "section", ...props }) => {
  return (
    <Component className={`py-12 md:py-16 lg:py-24 ${className}`} {...props}>
      {children}
    </Component>
  );
};


export default SectionContainer;
