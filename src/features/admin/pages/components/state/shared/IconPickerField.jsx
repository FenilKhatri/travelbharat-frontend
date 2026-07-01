import React from 'react';
import { FormInput } from '../../../../components/form';

const IconPickerField = ({ value, onChange, placeholder = "Icon (e.g. FiStar)" }) => {
  return (
    <div>
      <FormInput 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        list="icon-options"
      />
      <datalist id="icon-options">
        <option value="FiInfo" />
        <option value="FiStar" />
        <option value="FiMap" />
        <option value="FiHeart" />
        <option value="FiClock" />
        <option value="FiCheckCircle" />
        <option value="FiNavigation" />
        <option value="FiSun" />
        <option value="FiCamera" />
        <option value="FiAward" />
      </datalist>
    </div>
  );
};

export default IconPickerField;
