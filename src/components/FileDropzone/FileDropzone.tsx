'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Ref,
} from 'react';
import classNames from 'classnames';
import ProgressBar from '@/components/ProgressBar/ProgressBar';
import { mergeRefs } from '@/utils/mergeRefs';

export type FileUploadStatus = 'uploading' | 'success' | 'error';

export interface FileUploadItem {
  id: string;
  file: File;
  progress?: number;
  status?: FileUploadStatus;
  errorMessage?: string;
}

export interface FileDropzoneProps {
  files: FileUploadItem[];
  onFilesAdd: (files: File[]) => void;
  onFileRemove?: (id: string) => void;
  onFileRetry?: (id: string) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  showPreview?: boolean;
  disabled?: boolean;
  hint?: string;
  className?: string;
  ref?: Ref<HTMLInputElement>;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function UploadCloudIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-grey_2"
      aria-hidden="true"
    >
      <path
        d="M8 16L12 12L16 16M12 12V22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 17.576C21.4 16.8 22.333 15.297 22.333 13.6c0-2.541-2.06-4.6-4.6-4.6-.324 0-.641.033-.948.097a7 7 0 0 0-13.572 2.17 5.5 5.5 0 0 0 2.12 10.733"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GenericFileIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-grey_3"
      aria-hidden="true"
    >
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M14 2v6h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RemoveIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
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

function RetryIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M12 2v4h-4M2 12v-4h4M2.5 6A5 5 0 0 1 11 4.5M11.5 8A5 5 0 0 1 3 9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FileThumbnail({
  file,
  showPreview,
}: {
  file: File;
  showPreview: boolean;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!showPreview || !file.type.startsWith('image/')) {
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file, showPreview]);

  if (previewUrl) {
    return (
      <img
        src={previewUrl}
        alt=""
        className="w-[40px] h-[40px] rounded-8px object-cover flex-shrink-0"
      />
    );
  }

  return (
    <div className="w-[40px] h-[40px] rounded-8px bg-black_2 flex items-center justify-center flex-shrink-0">
      <GenericFileIcon />
    </div>
  );
}

export default function FileDropzone({
  files,
  onFilesAdd,
  onFileRemove,
  onFileRetry,
  accept,
  multiple = true,
  maxFiles,
  maxSize,
  showPreview = true,
  disabled = false,
  hint,
  className,
  ref,
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const atLimit = useMemo(
    () => Boolean(maxFiles && files.length >= maxFiles),
    [files.length, maxFiles],
  );

  const processFiles = useCallback(
    (incoming: File[]) => {
      setLocalError(null);

      let filtered = incoming;
      const rejected: string[] = [];

      if (maxSize) {
        filtered = filtered.filter((f) => {
          if (f.size <= maxSize) return true;
          rejected.push(`${f.name} exceeds ${formatFileSize(maxSize)}`);
          return false;
        });
      }

      if (maxFiles) {
        const remaining = maxFiles - files.length;
        if (remaining <= 0) {
          rejected.push(`At most ${maxFiles} file${maxFiles === 1 ? '' : 's'} allowed`);
          filtered = [];
        } else if (filtered.length > remaining) {
          rejected.push(`Only ${remaining} more file${remaining === 1 ? '' : 's'} allowed`);
          filtered = filtered.slice(0, remaining);
        }
      }

      if (rejected.length > 0) {
        setLocalError(rejected[0]);
      }

      if (filtered.length > 0) {
        onFilesAdd(filtered);
      }
    },
    [files.length, maxFiles, maxSize, onFilesAdd],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled && !atLimit) setIsDragOver(true);
    },
    [disabled, atLimit],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled || atLimit) return;
      processFiles(Array.from(e.dataTransfer.files));
    },
    [disabled, atLimit, processFiles],
  );

  const handleClick = useCallback(() => {
    if (!disabled && !atLimit) inputRef.current?.click();
  }, [disabled, atLimit]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        processFiles(Array.from(e.target.files));
        e.target.value = '';
      }
    },
    [processFiles],
  );

  return (
    <div className={classNames('flex flex-col gap-12px', className)}>
      <div
        role="button"
        tabIndex={disabled || atLimit ? -1 : 0}
        aria-disabled={disabled || atLimit || undefined}
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
          'border-2 border-dashed rounded-16px p-32px flex flex-col items-center justify-center gap-12px transition-colors duration-200 outline-none',
          {
            'border-black_3 cursor-pointer hover:border-grey_2': !isDragOver && !disabled && !atLimit,
            'border-pr_purple bg-pr_purple/5': isDragOver,
            'opacity-50 cursor-not-allowed border-black_3': disabled || atLimit,
          },
        )}
      >
        <UploadCloudIcon />
        <div className="flex flex-col items-center gap-2px">
          <span className="text-14 text-grey_4 font-manrope font-semibold">
            {atLimit ? 'File limit reached' : 'Drag & drop files here'}
          </span>
          {!atLimit && (
            <span className="text-12 text-grey_2 font-manrope">or click to browse</span>
          )}
        </div>
        {hint && (
          <span className="text-12 text-grey_1 font-manrope">{hint}</span>
        )}
      </div>

      <input
        ref={mergeRefs(inputRef, ref)}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {localError && (
        <div
          role="alert"
          className="text-12 font-manrope text-error px-4px"
        >
          {localError}
        </div>
      )}

      {files.length > 0 && (
        <ul className="flex flex-col gap-8px">
          {files.map((item) => {
            const { id, file, progress = 0, status, errorMessage } = item;
            const isUploading = status === 'uploading';
            const isError = status === 'error';

            return (
              <li
                key={id}
                className={classNames(
                  'flex items-center gap-12px rounded-8px bg-black_2 px-12px py-10px border border-solid',
                  {
                    'border-black_3': !isError,
                    'border-error': isError,
                  },
                )}
              >
                <FileThumbnail file={file} showPreview={showPreview} />
                <div className="flex-1 min-w-0 flex flex-col gap-4px">
                  <div className="flex items-baseline gap-8px">
                    <span className="text-14 text-white_4 font-manrope truncate">
                      {file.name}
                    </span>
                    <span className="text-12 text-grey_2 font-manrope flex-shrink-0">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                  {isUploading && (
                    <ProgressBar value={progress} size="sm" color="purple" />
                  )}
                  {isError && (
                    <span className="text-12 font-manrope text-error">
                      {errorMessage ?? 'Upload failed'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4px flex-shrink-0">
                  {isError && onFileRetry && (
                    <button
                      type="button"
                      aria-label={`Retry upload of ${file.name}`}
                      onClick={() => onFileRetry(id)}
                      className="text-grey_4 hover:text-white_4 cursor-pointer p-4px"
                    >
                      <RetryIcon />
                    </button>
                  )}
                  {onFileRemove && (
                    <button
                      type="button"
                      aria-label={`Remove ${file.name}`}
                      onClick={() => onFileRemove(id)}
                      className="text-grey_4 hover:text-error cursor-pointer p-4px"
                      disabled={isUploading}
                    >
                      <RemoveIcon />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
