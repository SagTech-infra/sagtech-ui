'use client';

import { useState } from 'react';
import Typography from '@/components/Typography/Typography';
import FaqList from './FaqList';

type Props = {
  faqList: Array<{ title: string; description: string }>;
  isVisibleTitle?: boolean;
  titleClassName?: string;
  descriptionClassName?: string;
  isCareersPage?: boolean;
  renderDescription?: (description: string) => React.ReactNode;
};

export default function FaqDropdown({
  faqList,
  isVisibleTitle = true,
  titleClassName = '',
  descriptionClassName = '',
  isCareersPage = false,
  renderDescription,
}: Props) {
  const [activeTab, setActiveTab] = useState<null | string>(null);

  const handleSelectTab = (tab: string) => {
    if (tab === activeTab) {
      setActiveTab(null);
      return;
    }

    setActiveTab(tab);
  };

  return (
    <div className="flex xl:flex-row flex-col justify-between gap-24px whitespace-pre-line">
      {isVisibleTitle && (
        <Typography
          tag="h2"
          color="text-white_4"
          className={`xl:w-[420px] w-full ${isCareersPage ? '3xl:!flex-1 3xl:w-auto' : ''}`}
        >
          frequently asked questions
        </Typography>
      )}
      <FaqList
        activeItem={activeTab || ''}
        faqList={faqList}
        onSelect={handleSelectTab}
        titleClassName={titleClassName}
        descriptionClassName={descriptionClassName}
        isCareersPage={isCareersPage}
        renderDescription={renderDescription}
      />
    </div>
  );
}
