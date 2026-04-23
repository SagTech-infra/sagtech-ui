const buttonConst = {
  basicStyles:
    'leading-24 flex justify-center items-center gap-8px font-bold rounded-[16px] cursor-pointer disabled:cursor-not-allowed',
  primaryButton: 'bg-pr_purple box-border border-animation',
  primaryButtonTextColor: 'text-white',
  primaryButtonNewColor: 'text-pr_purple',
  tabButtonBase:
    'leading-24 flex justify-center items-center gap-8px text-14  px-16px py-7px rounded-[50px] cursor-pointer disabled:cursor-not-allowed transition-all duration-800',
  tabButtonDefault:
    'text-grey_4  border-[1px] border-solid border-grey_4 rounded-[50px] transition-all duration-800',
  tabButtonActive: 'bg-pr_purple border-[1px] border-solid border-pr_purple text-white_4',
  tabButtonDisabled:
    'disabled:border-[1px] disabled:border-solid disabled:border-grey_2 disabled:bg-none disabled:text-grey_2',
  smallSize: 'py-4px px-16px text-14 rounded-[50px]',
  largeSize: 'py-16px px-40px leading-24',
  hoverAnimation: 'hover:shadow-3xl hover:bg-pr_purple/85 active:bg-pr_purple/70 transition-colors',
  primaryDisabledStyles: 'disabled:bg-[#545259] disabled:text-grey_2',
  secondaryDisabledStyles: 'disabled:border-grey_2 disabled:text-grey_2',
  loadingPrimary: 'bg-[#545259] text-grey_2 cursor-not-allowed',
  loadingSecondary: ' border-[2px] border-solid border-grey_2 text-grey_2 cursor-not-allowed',
  secondaryButton: 'border-[2px] border-solid border-white bg-none  text-white',
  tabButtonHover:
    'hover:border-white_4 hover:text-white_4 hover:bg-white/5 hover:transition-all hover:duration-800',
  secondaryAnimation: 'hover:drop-shadow-3xl hover:bg-white/10 active:bg-white/20 transition-colors',
  dangerButton: 'bg-error text-white',
  dangerAnimation: 'hover:bg-error/85 hover:shadow-[0_0_16px_0_rgba(153,45,45,0.32)] active:bg-error/70 transition-colors',
  dangerDisabledStyles: 'disabled:bg-[#545259] disabled:text-grey_2',
  loadingDanger: 'bg-[#545259] text-grey_2 cursor-not-allowed',
  tabButtonWhiteBase:
    'leading-24 flex justify-center items-center gap-8px text-14 px-16px py-7px rounded-[50px] cursor-pointer disabled:cursor-not-allowed transition-all duration-800',
  tabButtonWhiteHover: 'tabButtonWhite hover:border-white hover:bg-white hover:text-pr_purple',
};

export default buttonConst;
