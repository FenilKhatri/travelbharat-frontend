import React from 'react';
import PropTypes from 'prop-types';

const PageContainer = ({ children, className = "" }) => {
  return (
    <div className={`max-w-[1600px] w-full mx-auto px-4 ${className}`}>
      {children}
    </div>
  );
};

PageContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default PageContainer;
