import React from 'react';
import type { SVGProps } from 'react';
import { content } from '@/icons';
import type { IAvailableIcons } from '@/icons';
import Typography from '@/components/Typography/Typography';

export interface IIconProps {
  svgProps?: SVGProps<SVGSVGElement>;
  icon: IAvailableIcons;
  size?: number;
  height?: number;
  color?: string;
  viewBox?: string;
  className?: string;
  text?: string;
  classes?: string;
}

export function Icon(props: IIconProps) {
  const {
    icon,
    size = 24,
    color = '#fff',
    height,
    viewBox,
    className,
    classes,
    svgProps = {},
    text,
    ...rest
  } = props;

  const Component = content[icon] as React.FC<React.SVGProps<SVGSVGElement>>;
  if (!Component) {
    return null;
  }

  return (
    <div className={`flex flex-col items-center ${classes}`}>
      <Component
        width={size}
        className={className}
        height={height || size}
        color={color}
        {...(viewBox ? { viewBox } : {})}
        {...svgProps}
        {...rest}
        fill="none"
      />
      {text && (
        <div className="mt-4px 2xl:mt-0px">
          <Typography type="BodyS" color="text-grey_4">
            {text}
          </Typography>
        </div>
      )}
    </div>
  );
}

export default Icon;
