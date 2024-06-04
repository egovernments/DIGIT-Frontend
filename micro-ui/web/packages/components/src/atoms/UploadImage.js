import React, { useState, useEffect, useRef, Fragment } from "react";
import { SVG } from "./SVG";
import Webcam from "react-webcam";
import Button from "./Button";
import ErrorMessage from "./ErrorMessage";

const UploadImage = ({
  multiple,
  userType,
  onSubmit,
  fileData,
  onFileDelete,
  previews,
  uploadedFilesCount,
  handleFileClick,
}) => {
  const [openUploadSlide, setOpenUploadSlide] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const webRef = useRef(null);
  let imgData = "";
  const [isMobileView, setIsMobileView] = React.useState(
    window.innerWidth <= 480
  );
  const onResize = () => {
    if (window.innerWidth <= 480) {
      if (!isMobileView) {
        setIsMobileView(true);
      }
    } else {
      if (isMobileView) {
        setIsMobileView(false);
      }
    }
  };
  useEffect(() => {
    window.addEventListener("resize", onResize);
  
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const selectfile = (e) => {
    handleChange(e);
  };

  const closeDrawer = () => {
    setOpenUploadSlide(false);
  };

  const toggleWebcam = () => {
    setIsWebcamOpen(!isWebcamOpen);
    closeDrawer();
  };

  const toggleOpenUploadSlide = () => {
    setOpenUploadSlide(!openUploadSlide);
  };

  const captureImg = () => {
    if (webRef.current) {
      imgData = webRef.current.getScreenshot();
      const blob = dataURItoBlob(imgData);
      const fileName = generateFileName();
      const file = new File([blob], fileName, { type: "image/jpeg" });
      handleChange(file);
    }
  };

  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  function generateFileName() {
    return `image_${Date.now()}.jpg`;
  }

  const handleChange = (event) => {
    closeDrawer();
    setIsWebcamOpen(false);
    const files = event.target?.files;
    const newFiles = files ? [...files] : event;

    let newCapturedImages;
    if (multiple) {
      if (Array.isArray(newFiles)) {
        newCapturedImages = [...capturedImages, ...newFiles];
      } else {
        newCapturedImages = [...capturedImages, newFiles];
      }
    } else {
      if (Array.isArray(newFiles)) {
        newCapturedImages = [newFiles[0]];
      } else {
        newCapturedImages = [newFiles];
      }
    }
    setCapturedImages(newCapturedImages);
  };

  const handleFileDeletion = (fileToRemove) => {
    const updatedCapturedImages = capturedImages.filter(
      (file) => file !== fileToRemove
    );
    setCapturedImages(updatedCapturedImages);
    onFileDelete(fileToRemove);
  };

  useEffect(() => {
    onSubmit(capturedImages);
  }, [capturedImages,onSubmit]);

  const videoConstraints = {
    facingMode: "user",
  };

  const drawerClassName = `digit-upload-image-drawer ${
    isMobileView ? "mobile-view" : ""
  } ${openUploadSlide && isMobileView ? "open" : "close"}`;

  return (
    <React.Fragment>
      <div className="digit-image-uploader" onClick={toggleOpenUploadSlide}>
        {
          <SVG.CameraEnhance
            fill="#C84C0E"
            width={"40px"}
            height={"40px"}
            className="upload-image-camera"
          />
        }
        <div className="upload-image-label">{"Click to add photo"}</div>
      </div>
      <div className="digit-img-container">
        {previews.map((preview, index) => {
          return (
            <Fragment key={`preview-${index}`}>
              <div
                className={`preview-container ${
                  uploadedFilesCount > 1 ? " multiple" : ""
                } ${preview?.error ? "error" : ""}`}
                onClick={() => {
                  handleFileClick(index, preview?.file);
                }}
              >
                <img src={previews[index]?.preview} alt={`Preview ${index}`} />

                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileDeletion(fileData[index]);
                  }}
                  className={`digit-uploader-close-icon ${
                    preview?.error ? "error" : ""
                  }`}
                >
                  <SVG.Close
                    fill="#FFFFFF"
                    width={"16px"}
                    height={"16px"}
                    className={`uploader-close ${
                      preview?.error ? "error" : ""
                    }`}
                  />
                </span>
                {preview?.error && (
                  <ErrorMessage
                    message={preview?.error}
                    truncateMessage={true}
                    maxLength={256}
                    className="digit-tag-error-message"
                    wrapperClassName="digit-tag-error"
                    showIcon={true}
                  />
                )}
              </div>
            </Fragment>
          );
        })}
      </div>
      {openUploadSlide && (
        <>
          <div
            style={{
              opacity: "60%",
            }}
            className="image-background"
            onClick={
              isMobileView
                ? (e) => {
                    e.stopPropagation();
                    closeDrawer();
                  }
                : null
            }
          ></div>
          <div
            style={{
              bottom: userType === "citizen" ? "2.5rem" : "0",
            }}
            className={`digit-upload-image-drawer ${
              isMobileView ? "mobile-view" : ""
            }`}
          >
            {!isMobileView && (
              <div className="capture-heading" style={{ display: "flex" }}>
                {"Choose an option to upload"}
              </div>
            )}
            {!isMobileView && (
              <div className="capture-close">
                <SVG.Close
                  onClick={toggleOpenUploadSlide}
                  width={"32px"}
                  height={"32px"}
                  fill={"#0B4B66"}
                ></SVG.Close>
              </div>
            )}

            <div className="image-upload-options" style={{ display: "flex" }}>
              <div className="upload-options" style={{ display: "flex" }}>
                <label
                  onClick={() => toggleWebcam()}
                  style={{ cursor: "pointer" }}
                >
                  <SVG.CameraEnhance
                    fill="#C84C0E"
                    width={"40px"}
                    height={"40px"}
                  />
                </label>
                <label
                  onClick={() => toggleWebcam()}
                  className={"upload-options-label"}
                >
                  Camera
                </label>
              </div>
              <div className="upload-options" style={{ display: "flex" }}>
                <label for="file" style={{ cursor: "pointer" }}>
                  <SVG.PermMedia
                    fill="#C84C0E"
                    width={"40px"}
                    height={"40px"}
                  />
                </label>
                <label for="file" className={"upload-options-label"}>
                  My Files
                </label>
                <input
                  type="file"
                  id="file"
                  accept="image/*, .png, .jpeg, .jpg"
                  onChange={selectfile}
                  style={{ display: "none" }}
                  multiple={multiple}
                />
              </div>
            </div>
          </div>
        </>
      )}
      {isWebcamOpen && (
        <>
          <div
            style={{
              opacity: "60%",
            }}
            className="image-background"
          ></div>
          <div
            className="webcam-container"
            style={{ display: "flex", height: "100%", width: "100%" }}
          >
            <div className="capture-heading" style={{ display: "flex" }}>
              {"Capture"}
              <SVG.Close
                onClick={toggleWebcam}
                width={"32px"}
                height={"32px"}
                fill={"#0B4B66"}
              ></SVG.Close>
            </div>
            <div className="video-stream" style={{ height: "100%" }}>
              <Webcam
                audio={false}
                imageSmoothing={true}
                videoConstraints={videoConstraints}
                screenshotFormat="image/jpeg"
                ref={webRef}
                width={"100%"}
                height={"100%"}
              />
            </div>
            <div
              style={{
                display: "flex",
              }}
              className="cancel-capture-button-wrap"
            >
              {isMobileView ? (
                <>
                  <Button
                    onClick={captureImg}
                    variation={"primary"}
                    size={isMobileView ? "medium" : "large"}
                    label={"Capture"}
                    icon={"CameraEnhance"}
                  ></Button>
                  <Button
                    onClick={toggleWebcam}
                    variation={"secondary"}
                    size={isMobileView ? "medium" : "large"}
                    label={"Cancel"}
                  ></Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={toggleWebcam}
                    variation={"secondary"}
                    size={isMobileView ? "medium" : "large"}
                    label={"Cancel"}
                  ></Button>
                  <Button
                    onClick={captureImg}
                    variation={"primary"}
                    size={isMobileView ? "medium" : "large"}
                    label={"Capture"}
                    icon={"CameraEnhance"}
                  ></Button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </React.Fragment>
  );
};

export default UploadImage;
