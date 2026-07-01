import React from 'react';
import { FormGallery } from '../../../../components/form';

const GalleryModule = ({ form, set, uploadMultipleImages, uploadingImage }) => {
  return (
    <FormGallery 
      images={form.gallery}
      onChange={(newGallery) => set("gallery", newGallery)}
      onUpload={async (e) => {
        const urls = await uploadMultipleImages(e.target.files, "gallery");
        const newImages = urls.map(url => ({ url, category: "landscape", priority: 0 }));
        set("gallery", [...form.gallery, ...newImages]);
      }}
      uploading={uploadingImage === "gallery"}
    />
  );
};

export default GalleryModule;
