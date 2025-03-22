// generative-ui-chat/components/common/file-upload.tsx

'use client';
import React, { useState, useRef } from 'react';
import { Button } from "@heroui/react";
import { Icon } from '@iconify/react/dist/iconify.js';

interface FileUploadProps {
    onFileUpload: (file: File) => void;
    acceptedFileTypes?: string;
    maxFileSizeMB?: number;
}


export const FileUpload: React.FC<FileUploadProps> = ({
    onFileUpload,
    acceptedFileTypes = '*',
    maxFileSizeMB = 5
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length) {
            validateAndUploadFile(files[0]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files?.length) {
            validateAndUploadFile(files[0]);
        }
    };

    const validateAndUploadFile = (file: File) => {
        setErrorMessage(null);

        if (!file.type.match(acceptedFileTypes)) {
            setErrorMessage('Invalid file type. Please upload a supported file.');
            return;
        }

        if (file.size > maxFileSizeMB * 1024 * 1024) {
            setErrorMessage(`File size exceeds ${maxFileSizeMB}MB limit.`);
            return;
        }

        onFileUpload(file);
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    return (
        <div
            className={`p-6 border-2 border-dashed rounded-xl text-center ${isDragging ? 'border-primary bg-primary-100' : 'border-gray-300'
                }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInput}
                accept={acceptedFileTypes}
                className="hidden"
            />
            <Icon className="mx-auto mb-4 text-4xl text-gray-400" icon={"material-symbols:upload"} />
            <p className="mb-2 text-sm text-gray-600">
                Drag and drop your file here, or
            </p>
            <Button
                color="primary"
                variant="flat"
                onClick={openFileDialog}
            >
                Choose File
            </Button>
            {errorMessage && (
                <p className="mt-2 text-sm text-danger">{errorMessage}</p>
            )}
            <p className="mt-2 text-xs text-gray-500">
                Max file size: {maxFileSizeMB}MB
            </p>
        </div>
    );
};

export const FileUploadExample = () => {
    const FileUploadExampleProps = {
        onFileUpload: (file: File) => {
            console.log('File uploaded:', file);
        },
        acceptedFileTypes: 'image/*',
        maxFileSizeMB: 5
    }

    return <FileUpload
        onFileUpload={FileUploadExampleProps.onFileUpload}
        acceptedFileTypes={FileUploadExampleProps.acceptedFileTypes}
        maxFileSizeMB={FileUploadExampleProps.maxFileSizeMB}
    />;
}