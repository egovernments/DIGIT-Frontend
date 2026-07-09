import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, TextInput } from "@egovernments/digit-ui-components";

const SUPPORTED_MIME_TYPES = ["image/png", "image/jpeg"];
const SUPPORTED_EXTENSIONS = [".png", ".jpg", ".jpeg"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const CANVAS_HEIGHT = 160;
const CANVAS_SCALE = 2; // draw at 2x for print-quality signatures

/**
 * Reusable signature capture block: mandatory printed-name field plus a
 * draw-on-canvas / upload-image toggle. Reports its state up through
 * onStateChange; the parent extracts the final image via the provided
 * getSignatureFile() so upload to filestore stays in the parent's control.
 */
const SignatureCapture = ({ onStateChange }) => {
  const { t } = useTranslation();

  const [printedName, setPrintedName] = useState("");
  const [method, setMethod] = useState("DRAW"); // DRAW | UPLOAD
  const [hasDrawn, setHasDrawn] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState(null);
  const [fileError, setFileError] = useState(null);

  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef(null);
  const hasDrawnRef = useRef(false);
  const uploadedFileRef = useRef(null);
  const methodRef = useRef("DRAW");

  useEffect(() => {
    hasDrawnRef.current = hasDrawn;
  }, [hasDrawn]);
  useEffect(() => {
    uploadedFileRef.current = uploadedFile;
  }, [uploadedFile]);
  useEffect(() => {
    methodRef.current = method;
  }, [method]);

  // Resolves the signature image as a File, regardless of method
  const getSignatureFile = useCallback(async () => {
    if (methodRef.current === "UPLOAD") {
      return uploadedFileRef.current || null;
    }
    if (!hasDrawnRef.current || !canvasRef.current) return null;
    return new Promise((resolve) => {
      canvasRef.current.toBlob((blob) => {
        resolve(blob ? new File([blob], "signature.png", { type: "image/png" }) : null);
      }, "image/png");
    });
  }, []);

  // Push current state up whenever anything relevant changes
  useEffect(() => {
    onStateChange?.({
      printedName,
      method,
      hasSignature: method === "DRAW" ? hasDrawn : !!uploadedFile,
      getSignatureFile,
    });
  }, [printedName, method, hasDrawn, uploadedFile, getSignatureFile, onStateChange]);

  // ---- Drawing canvas ----
  const setupCanvas = useCallback((canvas) => {
    if (!canvas) return;
    canvasRef.current = canvas;
    const width = canvas.parentElement ? canvas.parentElement.clientWidth : 600;
    canvas.width = width * CANVAS_SCALE;
    canvas.height = CANVAS_HEIGHT * CANVAS_SCALE;
    canvas.style.width = "100%";
    canvas.style.height = `${CANVAS_HEIGHT}px`;
    const ctx = canvas.getContext("2d");
    ctx.scale(CANVAS_SCALE, CANVAS_SCALE);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0B0C0C";
  }, []);

  const getPoint = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const source = event.touches ? event.touches[0] : event;
    return { x: source.clientX - rect.left, y: source.clientY - rect.top };
  };

  const startDrawing = (event) => {
    event.preventDefault();
    isDrawingRef.current = true;
    lastPointRef.current = getPoint(event);
  };

  const draw = (event) => {
    if (!isDrawingRef.current || !canvasRef.current) return;
    event.preventDefault();
    const point = getPoint(event);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPointRef.current = point;
    if (!hasDrawnRef.current) setHasDrawn(true);
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  // ---- Upload ----
  const handleFileSelect = (event) => {
    setFileError(null);
    const file = event.target.files && event.target.files[0];
    event.target.value = ""; // allow re-selecting the same file
    if (!file) return;

    const extension = `.${(file.name.split(".").pop() || "").toLowerCase()}`;
    if (!SUPPORTED_MIME_TYPES.includes(file.type) || !SUPPORTED_EXTENSIONS.includes(extension)) {
      setFileError(t("HCM_AM_SIGNATURE_UNSUPPORTED_FORMAT"));
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError(t("HCM_AM_SIGNATURE_FILE_TOO_LARGE"));
      return;
    }
    if (uploadPreviewUrl) URL.revokeObjectURL(uploadPreviewUrl);
    setUploadedFile(file);
    setUploadPreviewUrl(URL.createObjectURL(file));
  };

  const removeUploadedFile = () => {
    if (uploadPreviewUrl) URL.revokeObjectURL(uploadPreviewUrl);
    setUploadedFile(null);
    setUploadPreviewUrl(null);
    setFileError(null);
  };

  useEffect(() => () => {
    if (uploadPreviewUrl) URL.revokeObjectURL(uploadPreviewUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const methodButtonStyle = (isActive) => ({
    padding: "0.4rem 1rem",
    border: `1px solid ${isActive ? "#0B4B66" : "#D6D5D4"}`,
    backgroundColor: isActive ? "#0B4B66" : "#FFFFFF",
    color: isActive ? "#FFFFFF" : "#0B0C0C",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: 600,
  });

  return (
    <div>
      <div className="comment-label">
        {t("HCM_AM_SIGNATURE_PRINTED_NAME")}
        <span style={{ color: "red", marginLeft: "4px" }}>*</span>
      </div>
      <TextInput
        type="text"
        value={printedName}
        onChange={(e) => setPrintedName(e.target.value)}
        placeholder={t("HCM_AM_SIGNATURE_PRINTED_NAME_PLACEHOLDER")}
      />

      <div className="comment-label" style={{ marginTop: "1rem" }}>
        {t("HCM_AM_SIGNATURE")}
        <span style={{ color: "red", marginLeft: "4px" }}>*</span>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <button type="button" style={methodButtonStyle(method === "DRAW")} onClick={() => setMethod("DRAW")}>
          {t("HCM_AM_SIGNATURE_DRAW")}
        </button>
        <button type="button" style={methodButtonStyle(method === "UPLOAD")} onClick={() => setMethod("UPLOAD")}>
          {t("HCM_AM_SIGNATURE_UPLOAD")}
        </button>
      </div>

      {method === "DRAW" && (
        <div>
          <div style={{ border: "1px dashed #B1B4B6", borderRadius: "4px", backgroundColor: "#FAFAFA" }}>
            <canvas
              ref={setupCanvas}
              style={{ touchAction: "none", display: "block", cursor: "crosshair" }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
          <div style={{ marginTop: "0.5rem" }}>
            <Button
              type="button"
              size="small"
              variation="secondary"
              label={t("HCM_AM_SIGNATURE_CLEAR")}
              title={t("HCM_AM_SIGNATURE_CLEAR")}
              onClick={clearCanvas}
              isDisabled={!hasDrawn}
            />
          </div>
        </div>
      )}

      {method === "UPLOAD" && (
        <div>
          {!uploadedFile ? (
            <label
              style={{
                display: "inline-block",
                padding: "0.5rem 1rem",
                border: "1px solid #0B4B66",
                borderRadius: "4px",
                color: "#0B4B66",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {t("HCM_AM_SIGNATURE_CHOOSE_FILE")}
              <input type="file" accept=".png,.jpg,.jpeg,image/png,image/jpeg" style={{ display: "none" }} onChange={handleFileSelect} />
            </label>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <img
                src={uploadPreviewUrl}
                alt={t("HCM_AM_SIGNATURE")}
                style={{ maxHeight: "80px", maxWidth: "240px", border: "1px solid #D6D5D4", borderRadius: "4px", backgroundColor: "#FFFFFF" }}
              />
              <span style={{ wordBreak: "break-all" }}>{uploadedFile.name}</span>
              <Button
                type="button"
                size="small"
                variation="secondary"
                label={t("HCM_AM_SIGNATURE_REMOVE")}
                title={t("HCM_AM_SIGNATURE_REMOVE")}
                onClick={removeUploadedFile}
              />
            </div>
          )}
          <div style={{ marginTop: "0.25rem", fontSize: "12px", color: "#505A5F" }}>{t("HCM_AM_SIGNATURE_UPLOAD_HINT")}</div>
          {fileError && <div style={{ marginTop: "0.25rem", color: "#B91900", fontWeight: 600 }}>{fileError}</div>}
        </div>
      )}
    </div>
  );
};

export default SignatureCapture;