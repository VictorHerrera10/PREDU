import React, { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { Tag } from "primereact/tag";
import styled from "styled-components";

const NotasAcademicas = () => {
    const toast = useRef(null);
    const fileUploadRef = useRef(null);
    const [totalSize, setTotalSize] = useState(0);

    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });
        setTotalSize(_totalSize);
    };

    const onTemplateUpload = (e) => {
        let _totalSize = 0;
        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });
        setTotalSize(_totalSize);
        toast.current.show({ severity: "success", summary: "Archivo subido", detail: "Certificado recibido correctamente" });
    };

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 10000;
        const formatedValue = fileUploadRef?.current?.formatSize(totalSize) || "0 B";

        return (
            <div className={className} style={{ display: "flex", alignItems: "center" }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue} / 1 MB</span>
                    <ProgressBar value={value} showValue={false} style={{ width: "10rem", height: "12px" }} />
                </div>
            </div>
        );
    };

    const itemTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: "40%" }}>
                    <i className="pi pi-file-pdf" style={{ fontSize: "2rem", marginRight: "1rem" }}></i>
                    <span className="flex flex-column text-left">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="info" className="px-3 py-2" />
                <Button
                    type="button"
                    icon="pi pi-times"
                    className="p-button-outlined p-button-rounded p-button-danger ml-auto"
                    onClick={() => onTemplateRemove(file, props.onRemove)}
                />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-file-pdf mt-3 p-5" style={{ fontSize: "5em", borderRadius: "50%", backgroundColor: "#f4f4f4", color: "#888" }} />
                <span style={{ fontSize: "1.2em", color: "#888" }} className="my-5">
                    Arrastra o selecciona tu certificado de notas
                </span>
            </div>
        );
    };

    const chooseOptions = { icon: "pi pi-upload", iconOnly: true, className: "custom-choose-btn p-button-rounded p-button-outlined" };
    const uploadOptions = { icon: "pi pi-cloud-upload", iconOnly: true, className: "custom-upload-btn p-button-success p-button-rounded p-button-outlined" };
    const cancelOptions = { icon: "pi pi-times", iconOnly: true, className: "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined" };

    return (
        <NotasContainer>
            <Toast ref={toast} />
            <h2>Sube tu Certificado de Notas</h2>
            <p>Este archivo será procesado automáticamente para extraer tus calificaciones cuando el sistema esté listo.</p>

            <FileUpload
                ref={fileUploadRef}
                name="certificado"
                url="/api/futuro-upload" // solo mock por ahora
                accept="application/pdf,image/*"
                maxFileSize={1000000}
                multiple
                customUpload
                uploadHandler={onTemplateUpload}
                onSelect={onTemplateSelect}
                onError={onTemplateClear}
                onClear={onTemplateClear}
                headerTemplate={headerTemplate}
                itemTemplate={itemTemplate}
                emptyTemplate={emptyTemplate}
                chooseOptions={chooseOptions}
                uploadOptions={uploadOptions}
                cancelOptions={cancelOptions}
            />
        </NotasContainer>
    );
};

const NotasContainer = styled.div`
    padding: 2rem;
    max-width: 800px;
    margin: auto;
`;

export default NotasAcademicas;
