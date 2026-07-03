import React from 'react';

const ContentContainer = ({ children, className = "", as: Component = "div", ...props }) => {
  return (
    <Component className={`max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 ${className}`} {...props}>
      {children}
    </Component>
  );
};


export default ContentContainer;
