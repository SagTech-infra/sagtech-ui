/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  type InputHTMLAttributes,
  type DetailedHTMLProps,
  useMemo,
  useEffect,
} from 'react';
import classNames from 'classnames';
import { Icon } from '@/components/Icon/Icon';
import attachmentConsts from './attachment.const';
import Typography from '@/components/Typography/Typography';

interface AttachmentTypes
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  state?: 'active' | 'default' | 'disabled';
  accept?: '.png, .jpg, .pdf, .gif';
  isError?: boolean;
  onUpload?: (files: Array<File> | undefined) => void;
  multiple?: boolean;
  errorMessage?: string;
  getFiles?: (files: Array<File>) => void;
  clearField?: boolean;
  title?: string;
}

export function Attachment({
  state = 'default',
  accept = '.png, .jpg, .pdf, .gif',
  isError = false,
  onUpload,
  multiple = true,
  clearField,
  errorMessage,
  getFiles,
  title = 'Attach file',
  ...rest
}: AttachmentTypes) {
  const [hover, setHover] = useState(false);
  const [files, setFiles] = useState<Array<File> | null>(null);

  const mouseHandlerOver = (): void => {
    setHover(true);
  };

  const mouseHandlerLeave = (): void => {
    setHover(false);
  };

  const nameStyles = classNames({
    [attachmentConsts.attacmentNameBasic]: true,
    [attachmentConsts.erroAndDefAttachName]: state === 'default' || isError,
    [attachmentConsts.activeAttachmentName]: state === 'active' || (state === 'default' && hover),
    [attachmentConsts.disabledAttachName]: state === 'disabled',
  });

  const variantStyle = classNames({
    [attachmentConsts.attacmentVariantBasic]: true,
    [attachmentConsts.defaultAttachmentVariants]: true,
  });

  const iconColors = useMemo(
    () => `
    ${hover && state === 'default' ? '#F8F8F8' : ''}
    ${state !== 'active' && state !== 'disabled' && !hover ? '#B5B5B9' : ''}
    ${state === 'active' ? '#F8F8F8' : ''}
    ${state === 'disabled' ? '#83838A' : ''}
    `,
    [state, hover],
  );

  const handleFileChange = (e: React.ChangeEvent) => {
    const input = e.target as HTMLInputElement;

    if (input.files) {
      const filesArr = Array.from(input.files);

      if (onUpload) {
        onUpload(filesArr);
      }

      setFiles(filesArr);
    }
  };

  const handleClear = (name: string) => {
    if (files) {
      const newFiles = files.filter((f) => f.name !== name);
      setFiles(newFiles);
      if (getFiles) {
        getFiles(newFiles);
      }
    }
  };

  useEffect(() => {
    if (clearField) {
      setFiles(null);
    }
  }, [clearField]);

  return (
    <div className="flex flex-col">
      <label htmlFor="input-file" className="flex flex-col">
        <div
          className="pointer inline-flex cursor-pointer items-center gap-12px"
          onMouseOver={state === 'default' ? mouseHandlerOver : undefined}
          onMouseLeave={state === 'default' ? mouseHandlerLeave : undefined}
        >
          <Icon icon="attach" size={24} color={iconColors} />
          <input
            id="input-file"
            onChange={(e) => handleFileChange(e)}
            multiple={multiple}
            className="hidden"
            accept={accept}
            {...rest}
          />
          <div>
            <p data-tid="attach-name" className={nameStyles}>
              {title}
            </p>
            <p data-tid="attach-variant" className={variantStyle}>
              <span
                data-tid="attach-variant-span"
                className={isError && errorMessage === 'type' ? 'text-error' : ''}
              >
                (PDF, PNG, JPG, GIF;{' '}
              </span>
              <span
                data-tid="attach-variant-span"
                className={isError && errorMessage === 'size' ? 'text-error' : ''}
              >
                max. 10mb)
              </span>

              {isError && errorMessage === 'quantity' && (
                <>
                  <br />
                  <span data-tid="attach-variant-span" className={isError ? 'text-error' : ''}>
                    Should not be more than 5 files
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </label>
      {files &&
        files.map((file: File) => (
          <div className="pointer inline-flex items-center gap-12px" key={file.name}>
            <Icon icon="attach" size={24} color="#F8F8F8" />
            <div className="flex flex-col">
              <Typography tag="h4" color="text-white_4">
                {file.name}
              </Typography>
              <p data-tid="attach-variant" className={variantStyle}>
                <span data-tid="attach-variant-span">({file.type};</span>
                {Math.round(file.size / 1024 / 1024)}
                mb)
              </p>
            </div>
            <button type="button" onClick={() => handleClear(file.name)}>
              <Icon
                icon="chevrondown"
                size={20}
                color="currentColor"
                className="text-grey_4 hover:text-white_4"
              />
            </button>
          </div>
        ))}
    </div>
  );
}

export default Attachment;
