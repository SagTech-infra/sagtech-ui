import CardWrapper from '@/components/CardWrapper/CardWrapper';
import Typography from '@/components/Typography/Typography';

interface ResultProps {
  title?: string;
  info?: string;
  classes?: string;
}

export default function ResultPill({ title = 'Some txt', info, classes }: ResultProps) {
  return (
    <CardWrapper
      stoke="1"
      rounded="24"
      className={`flex flex-col gap-8px px-32px py-24px sm:px-40px sm:py-32px ${
        classes !== undefined ? classes : ''
      }`}
    >
      <Typography text={title} tag="h2" color="text-pr_purple" />
      <Typography text={info} tag="h4" color="text-current" />
    </CardWrapper>
  );
}
