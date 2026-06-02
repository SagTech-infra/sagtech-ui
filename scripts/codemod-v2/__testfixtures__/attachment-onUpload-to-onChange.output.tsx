import { Attachment } from '@sagtech-infra/ui';
import { OtherUploader } from './OtherUploader';

export function Example({ onFiles }: { onFiles: (f: File[] | undefined) => void }) {
  return (
    <>
      {/* Target: onUpload on <Attachment> becomes onChange (identical signature) */}
      <Attachment onChange={onFiles} title="Attach" />
      {/* Scoping guard: onUpload on a different component must NOT change */}
      <OtherUploader onUpload={onFiles} />
    </>
  );
}
