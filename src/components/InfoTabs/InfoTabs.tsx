'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, Fragment } from 'react';
import Typography from '@/components/Typography/Typography';
import CardWrapper from '@/components/CardWrapper/CardWrapper';
import Button from '@/components/Button/Button';
import { Icon } from '@/components/Icon/Icon';
import { useImageComponent } from '@/providers';
import type { InfoTab } from './types';

interface Props {
  title: string;
  list: InfoTab[];
  renderModal?: (props: { isOpen: boolean; toggle: () => void; role: string }) => React.ReactNode;
}

export default function InfoTabs({ title, list, renderModal }: Props) {
  const Image = useImageComponent();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState({
    title: list[0]?.title || '',
    role: list[0]?.role || '',
  });

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSelectTab = (tabTitle: string, tabRole: string) => {
    if (tabTitle !== activeTab.title) {
      setActiveTab({ title: tabTitle, role: tabRole });
    }
  };

  return (
    <div className="flex flex-col justify-between gap-40px w-full max-w-[1200px]">
      <Typography tag="h2" color="text-white_4" className="w-full">
        {title}
      </Typography>
      <div className="grid grid-cols-1 xs:grid-cols-[1fr_1fr] gap-24px w-full">
        <div className="flex flex-col gap-4 min-w-0">
          <CardWrapper stoke="1">
            <ul className="flex flex-col sm:py-12px py-[8px] sm:px-24px px-12px">
              {list.map((item) => (
                <li
                  key={item.title}
                  className="h-min flex flex-col py-8px justify-start border-b-1 last:border-[transparent] border-solid border-b-[#2F1E5E]"
                >
                  <button
                    type="button"
                    aria-label="set tab"
                    onClick={() => handleSelectTab(item.title, item.role || '')}
                    className="flex items-center  gap-8px justify-between xl:h-72px my-8px"
                  >
                    <Typography
                      tag="h4"
                      color={activeTab.title === item.title ? 'text-pr_purple' : 'text-white_4'}
                      className="sm:!text-[24px] sm:leading-[48px] 2xl:!text-24px text-left"
                      text={item.title}
                    />
                    <Image
                      src="/svg/icons/arrow-right-line.svg"
                      width={24}
                      height={24}
                      alt="arrow"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </CardWrapper>
        </div>
        <div className="mt-10px min-h-[200px] min-w-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab && (
              <motion.div
                key={activeTab.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="p-6"
              >
                {list
                  .filter((item) => item.title === activeTab.title)
                  .map((item) => (
                    <Fragment key={item.title}>
                      <div className="mb-30px">
                        <Typography type="TabInfoTitle" color="text-white_4" className="mb-10px">
                          {item.title}
                        </Typography>
                        <Typography tag="p" color="text-grey_4">
                          {item.description}
                        </Typography>
                      </div>
                      {item.buttonText && (
                        <Button
                          type="submit"
                          variant="primary"
                          buttonSize="large"
                          text={item.buttonText}
                          onClick={toggleModal}
                          classes="rounded-[50px] flex !gap-16px flex-row-reverse !py-12px pr-12px pl-24px"
                        >
                          <Icon icon="arrow" size={32} viewBox="0 0 32 32" color="#6D3EF1" />
                        </Button>
                      )}
                    </Fragment>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {renderModal?.({ isOpen: isModalOpen, toggle: toggleModal, role: activeTab.role })}
      </div>
    </div>
  );
}
