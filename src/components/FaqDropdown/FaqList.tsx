'use client';

import { motion } from 'framer-motion';
import Typography from '@/components/Typography/Typography';
import CardWrapper from '@/components/CardWrapper/CardWrapper';

function ChevrondownIcon({
  width = 24,
  height = 24,
  color,
}: {
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white_4"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke={color || 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type Props = {
  activeItem: string;
  faqList: Array<{ title: string; description: string }>;
  onSelect: (target: string) => void;
  titleClassName?: string;
  descriptionClassName?: string;
  isCareersPage?: boolean;
  titleTag?: 'h3' | 'h4';
  renderDescription?: (description: string) => React.ReactNode;
};

export default function FaqList({
  activeItem,
  faqList,
  onSelect,
  titleClassName = '',
  descriptionClassName = '',
  isCareersPage = false,
  titleTag = 'h4',
  renderDescription,
}: Props) {
  const defaultRenderDescription = (description: string) => description;

  const resolvedRenderDescription = renderDescription || defaultRenderDescription;

  return (
    <CardWrapper stoke="1" className={`max-w-1128px ${isCareersPage ? '3xl:flex-1' : ''}`}>
      <ul className="flex flex-col sm:py-12px py-[8px] sm:px-24px px-12px">
        {faqList.map(({ title, description }) => (
          <li
            key={title}
            className="h-min flex flex-col py-8px justify-start border-b-1 last:border-[transparent] border-solid border-b-[#2F1E5E]"
          >
            <button
              type="button"
              aria-label="set tab"
              onClick={() => onSelect(title)}
              className="flex items-center justify-between xl:h-72px my-8px"
            >
              <Typography
                tag={titleTag}
                color="text-white_4"
                className={`sm:!text-[24px] sm:leading-[48px] 2xl:!text-24px text-left ${titleClassName}`}
                text={title}
              />
              <motion.div
                initial={{ rotateX: 0 }}
                animate={{
                  rotateX: activeItem === title ? 180 : 0,
                }}
                transition={{ duration: 0.15 }}
                style={{ perspective: 1000 }}
              >
                <ChevrondownIcon width={24} height={24} color="#B5B5B9" />
              </motion.div>
            </button>
            <motion.div
              initial={{ height: 0 }}
              animate={{
                height: activeItem === title ? 'auto' : 0,
              }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <Typography
                type="BodyL"
                className={`xl:pt-[0px] sm:pt-8px pt-16px ${descriptionClassName}`}
                color="text-white_4"
              >
                {resolvedRenderDescription(description)}
              </Typography>
            </motion.div>
          </li>
        ))}
      </ul>
    </CardWrapper>
  );
}
