import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import Typography from '@/components/Typography/Typography';
import { useImageComponent } from '@/providers';

interface StepsProps {
  stepsList: Array<{ title: string; description: string; icon?: string }>;
  isPhases?: boolean;
}

export default function Steps({ stepsList, isPhases = false }: StepsProps) {
  const Image = useImageComponent();
  const [progress, setProgress] = useState(0);
  const [listHeight, setListHeight] = useState(0);
  const [lastStepDescriptionHeight, setLastStepDescriptionHeight] = useState(0);
  const stepListLength = stepsList.length;
  const listRef = useRef<HTMLUListElement>(null);
  const lastStepDescriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const updateHeights = () => {
      if (listRef.current) {
        setListHeight(listRef.current.clientHeight);
      }
      if (lastStepDescriptionRef.current) {
        setLastStepDescriptionHeight(lastStepDescriptionRef.current.clientHeight);
      }
    };

    const timeoutId = setTimeout(updateHeights, 100);
    window.addEventListener('resize', updateHeights);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateHeights);
    };
  }, [stepsList]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((old) => (old >= 100 ? 0 : old + 0.25));
    }, 25);
    return () => clearInterval(interval);
  }, []);

  const gap = 8;
  const paddingTop = 24;

  return (
    <nav className="w-400px 2xl:w-full">
      <ul
        className={`flex flex-col relative ${
          isPhases ? 'mb-117px xs:mb-72px mds:mb-30px gap-56px xs:gap-24px' : 'gap-56px xs:gap-24px'
        }`}
        ref={listRef}
      >
        {stepsList.map(({ title, description, icon }, index) => {
          const interval = 100 / stepListLength + 2;
          const progressToActive = index * interval;
          const progressToDeactive = (index + 1) * interval;
          const isActive = progress >= progressToActive && progress < progressToDeactive;

          return (
            <li key={title} className="flex items-start gap-16px">
              <div className="z-30 min-w-[32px] min-h-[32px] w-[32px] relative flex justify-center items-center">
                <div
                  className={classNames(
                    `rounded-[5em] ${
                      icon ? 'w-[30px] h-[30px]' : 'size-24px'
                    } bg-pr_purple text-white transition-all flex justify-center will-change-transform items-center`,
                    { 'scale-150': isActive },
                  )}
                >
                  {icon ? (
                    <Image width="18" height="18" src={`/svg/icons/${icon}.svg`} alt={icon} />
                  ) : (
                    index + 1
                  )}
                </div>
              </div>
              <div className={`flex flex-col gap-[${gap}px] h-fit`}>
                <Typography
                  tag="h4"
                  className={classNames('transition-all text-[18px] text-fg-muted', {
                    'text-fg-primary scale-[1.02] translate-x-6px': isActive,
                  })}
                  text={title}
                />
                <Typography
                  className={classNames('transition-all text-[14px] text-fg-muted', {
                    'text-fg-primary scale-[1.02] translate-x-6px': isActive,
                  })}
                  type="BodyS"
                  text={description}
                  {...(index === stepListLength - 1 && { ref: lastStepDescriptionRef })}
                />
              </div>
            </li>
          );
        })}
        <div
          className="absolute flex flex-col h-full z-10 left-[14px]"
          style={{ paddingTop: `${paddingTop}px` }}
        >
          <div
            style={{
              height: `${progress}%`,
              maxHeight: `${listHeight - (lastStepDescriptionHeight || 0) - gap - paddingTop}px`,
            }}
            className="w-[4px] rounded-[5em] bg-pr_purple"
          />
        </div>
      </ul>
    </nav>
  );
}
