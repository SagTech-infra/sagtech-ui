export const calculateQuarters = (dateString: string | number | Date) => {
  let inf;
  const date = new Date(dateString);
  const monthNumber = date.getMonth() + 1;
  const year = date.getFullYear();
  if (monthNumber >= 1 && monthNumber <= 3) {
    inf = 'Q1';
  }
  if (monthNumber >= 4 && monthNumber <= 6) {
    inf = 'Q2';
  }
  if (monthNumber >= 7 && monthNumber <= 9) {
    inf = 'Q3';
  }
  if (monthNumber >= 10 && monthNumber <= 12) {
    inf = 'Q4';
  }
  return `${inf} ${year}`;
};

export const formatDate = (dateString: string | number | Date) => {
  const date = new Date(dateString);
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();
  return `${month}, ${year}`;
};

export const getCompanyAge = (): number => {
  const foundingYear = 2022;
  const currentYear = new Date().getFullYear();
  return currentYear - foundingYear;
};
