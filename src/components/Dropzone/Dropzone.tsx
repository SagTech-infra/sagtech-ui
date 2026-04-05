'use client';

import { useState, useRef, useCallback } from 'react';
import classNames from 'classnames';

export interface DropzoneProps {
  onDrop: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSize?: number;
  disabled?: boolean;
  className?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function UploadCloudIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-grey_2"
    >
      <path
        d="M16 32L24 24L32 32"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 24V42"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M40.78 36.78C42.7307 35.7166 44.2717 34.0338 45.1597 31.9973C46.0477 29.9608 46.2323 27.6865 45.6843 25.5334C45.1363 23.3803 43.8869 21.4711 42.1333 20.1069C40.3796 18.7427 38.2217 18.0015 36 18H33.48C32.876 15.6585 31.7585 13.4847 30.2072 11.6345C28.6559 9.78432 26.7104 8.30476 24.5123 7.30384C22.3142 6.30292 19.9194 5.80588 17.5031 5.84793C15.0867 5.88997 12.7108 6.47005 10.5488 7.54661C8.38673 8.62317 6.49296 10.1692 4.00621 12.0733C1.51945 13.9774 -0.399375 16.1916 -1.70028 18.6496C-3.00118 21.1076 -3.65285 23.7514 -3.61027 26.4331C-3.5677 29.1148 -2.83206 31.7421 -1.45455 34.17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 32L24 24L32 32"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-grey_2 flex-shrink-0"
    >
      <path
        d="M9.33333 1.33333H4C3.64638 1.33333 3.30724 1.47381 3.05719 1.72386C2.80714 1.9739 2.66667 2.31304 2.66667 2.66667V13.3333C2.66667 13.687 2.80714 14.0261 3.05719 14.2761C3.30724 14.5262 3.64638 14.6667 4 14.6667H12C12.3536 14.6667 12.6928 14.5262 12.9428 14.2761C13.1929 14.0261 13.3333 13.687 13.3333 13.3333V5.33333L9.33333 1.33333Z"
        stroke="currentColor"
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.33333 1.33333V5.33333H13.3333"
        stroke="currentColor"
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RemoveIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Dropzone({
  onDrop,
  accept,
  maxFiles,
  maxSize,
  disabled = false,
  className,
}: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    (incoming: File[]) => {
      let filtered = incoming;

      if (maxSize) {
        filtered = filtered.filter((f) => f.size <= maxSize);
      }

      if (maxFiles) {
        const remaining = maxFiles - files.length;
        filtered = filtered.slice(0, Math.max(0, remaining));
      }

      if (filtered.length > 0) {
        const updated = [...files, ...filtered];
        setFiles(updated);
        onDrop(filtered);
      }
    },
    [files, maxFiles, maxSize, onDrop],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragOver(true);
    },
    [disabled],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;

      const droppedFiles = Array.from(e.dataTransfer.files);
      processFiles(droppedFiles);
    },
    [disabled, processFiles],
  );

  const handleClick = useCallback(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  }, [disabled]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const selected = Array.from(e.target.files);
        processFiles(selected);
        // Reset input so the same file can be re-selected
        e.target.value = '';
      }
    },
    [processFiles],
  );

  const handleRemove = useCallback(
    (index: number) => {
      setFiles((prev) => prev.filter((_, i) => i !== index));
    },
    [],
  );

  return (
    <div className={classNames('flex flex-col', className)}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        className={classNames(
          'border-2 border-dashed rounded-16px p-40px flex flex-col items-center justify-center gap-16px transition-colors duration-200',
          {
            'border-black_3 cursor-pointer': !isDragOver && !disabled,
            'border-pr_purple bg-pr_purple/5': isDragOver && !disabled,
            'opacity-50 cursor-not-allowed border-black_3': disabled,
          },
        )}
      >
        <UploadCloudIcon />
        <div className="flex flex-col items-center gap-4px">
          <span className="text-14 text-grey_4 font-manrope">Drag & drop files here</span>
          <span className="text-12 text-grey_2 font-manrope">or click to browse</span>
        </div>
        {accept && (
          <span className="text-10 text-grey_1 font-manrope">
            Accepted: {accept}
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={!maxFiles || maxFiles > 1}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {files.length > 0 && (
        <div className="flex flex-col mt-12px">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-8px py-8px border-b border-black_3"
            >
              <FileIcon />
              <span className="text-14 text-grey_4 font-manrope flex-1 truncate">
                {file.name}
              </span>
              <span className="text-12 text-grey_2 font-manrope flex-shrink-0">
                {formatFileSize(file.size)}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="flex-shrink-0 text-grey_2 hover:text-error transition-colors cursor-pointer p-4px"
              >
                <RemoveIcon />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
