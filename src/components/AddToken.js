import React, { useState } from "react";
import DropboxChooser from "react-dropbox-chooser";

const AddToken = ({ handleAddToken }) => {
  const [error, setError] = useState(undefined);

  const validateProcess = async (url) => {
    try {
      await isValidImg(url);
      const validationError = handleAddToken(url);
      setError(validationError);
    } catch {
      setError("Please, enter a valid image URL");
    }
  };

  const isValidImg = (url) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(true);
      image.onerror = () => reject(false);
      image.src = url;
    });
  };

  const handleFiles = (files) => {
    files.forEach((file) =>
      validateProcess(file.link.replace("dl=0", "raw=1"))
    );
  };

  const handleAddTokenSubmit = (e) => {
    e.preventDefault();
    const tokenUrl = e.target.elements.tokenUrl.value.trim();
    validateProcess(tokenUrl);
    e.target.reset();
  };

  return (
    <div className="container-fluid" id="links-instructions">
      <div className="row">
        <div className="col-md-6">
          <div className="instructions">
            <p>
              <strong>How does it work? Paste, customise, print!</strong>
            </p>
            <ol>
              <li>
                <strong>Paste</strong> an image URL in the scroll and press{" "}
                <strong>Add Token</strong>
              </li>
              <li>
                ...or <strong>upload</strong> images directly from Dropbox
              </li>
              <li>
                <strong>Customise</strong> your token choosing the shape, size,
                quantity, paper mini, etc.
              </li>
              <li>
                Press <strong>Print</strong> and save to PDF or send it directly
                to the printer!
              </li>
            </ol>
            <p>
              <strong>...You can add as many creatures as you want!</strong>
            </p>
            <p>
              Don't forget to check the changelog at the bottom of the page; I
              constantly update and optimise the Paper Tokens Generator!
            </p>
          </div>
        </div>

        <div id="add-token-container" className="col-md-6">
          <div id="add-link-container">
            <p>Insert a link to a creature image to begin!</p>
            <form
              autoComplete="off"
              id="tokens-form"
              onSubmit={handleAddTokenSubmit}
            >
              <input
                placeholder="Paste the Image URL"
                className="url-input"
                type="text"
                name="tokenUrl"
                label="Image URL"
              />
              <button className="btn btn-primary btn-lg">Add Token</button>
            </form>
            {error && <p className="error">{error}</p>}
          </div>
          <DropboxChooser
            appKey="ki5u4q9h7qgzlkr"
            success={handleFiles}
            multiselect={true}
            extensions={[".jpg", ".jpeg", ".png"]}
          >
            <div className="dropbox-button">
              Upload images from Dropbox&nbsp;
              <i className="fab fa-dropbox"></i>
            </div>
          </DropboxChooser>
        </div>
      </div>
    </div>
  );
};

export { AddToken };
