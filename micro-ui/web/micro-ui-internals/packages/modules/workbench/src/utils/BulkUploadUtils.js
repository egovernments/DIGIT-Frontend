export const onConfirm = (
    file,
    SchemaDefinitions,
    ajv,
    t,
    setShowBulkUploadModal,
    fileValidator,
    onSubmitBulk,
    setProgress
) => {
    const validate = ajv.compile(SchemaDefinitions);

    if (file && file.type === 'application/json') {
        const reader = new FileReader();

        reader.onload = (event) => {
            const jsonContent = JSON.parse(event.target.result);
            var validationError = false;
            jsonContent.forEach((data) => {
                const valid = validate(data);
                if (!valid) {
                    validationError = true;
                    fileValidator(validate.errors[0]?.message);
                    setProgress(0);
                    return;
                }
            });
            if (!validationError) {
                // Call onSubmitBulk with setProgress
                onSubmitBulk(jsonContent, setProgress);
            }
        };

        reader.readAsText(file);
    } else {
        fileValidator(t('WBH_ERROR_FILE_NOT_SUPPORTED'));
        setProgress(0);
    }

    setShowBulkUploadModal(false);
};