import React from 'react';
import { FileUpload, Modal } from '@egovernments/digit-ui-components';

const CustomFileUploadModal = (props) => {
  const {
    isOpen,
    onClose,
    onFileSelect,
    allowedFileTypes,
    maxFileSize,
    title = "Upload File",
    multiple = false,
    className,
    style,
    ...rest
  } = props;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className={`custom-file-upload-modal ${className || ''}`}
      style={style}
    >
      <div className="modal-header" style={{ marginBottom: '1rem' }}>
        <h3>{title}</h3>
      </div>
      <div className="modal-content">
        <FileUpload
          onFileSelect={onFileSelect}
          allowedFileTypes={allowedFileTypes}
          maxFileSize={maxFileSize}
          multiple={multiple}
          {...rest}
        />
      </div>
    </Modal>
  );
};

export default CustomFileUploadModal;