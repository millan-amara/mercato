import React from "react";
import '../assets/upload.css';

const ImageUpload = ({ selectedImages, onSelectFile, deleteHandler }) => {

    

  return (
    <section className="section">
      <label className="label">
        + Add Images 
        <br />
        <span className="text-sm">(optional)</span>
        <span className="span">up to 6 images</span>
        <input
          className="input" 
          type="file"
          id="images"
          name="images"
          onChange={onSelectFile}
          multiple
          accept="image/png, image/jpeg, image/jpg, image/webp"
        />
      </label>
      <br />

      <input className="input" type="file" multiple />

      {selectedImages.length > 0 &&
        (selectedImages.length > 6 ? (
          <p className="error">
            You can't upload more than 6 images! <br />
            <span>
              please delete <b> {selectedImages.length - 6} </b> of them{" "}
            </span>
          </p>
        ) : (
          <p
            className="upload-btn"
            onClick={() => {
              console.log(selectedImages);
            }}
          >
            UPLOAD {selectedImages.length} IMAGE
            {selectedImages.length === 1 ? "" : "S"}
          </p>
        ))}

      <div className="images">
        {selectedImages &&
          selectedImages.map((image, index) => {
            return (
              <div key={image.name} className="image">
                <img src={URL.createObjectURL(image)} height="200" alt="upload" className="img" />
                <span onClick={() => deleteHandler(image)}>
                  delete image
                </span>
                <p>{index + 1}</p>
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default ImageUpload;