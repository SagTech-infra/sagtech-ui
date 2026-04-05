import parsePhoneNumber from 'libphonenumber-js';

export const validateEmail = (email: string) =>
  String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

export const validateLink = (value: string) => {
  const numericRegex = /^(http|https):\/\/[^\s/$.?#].[^\s]*$/i;
  return numericRegex.test(value);
};

export const validatePhone = (value: string) => {
  if (typeof value !== 'string' || value.trim() !== value) {
    return false;
  }
  try {
    const phoneNumber = parsePhoneNumber(value);
    if (phoneNumber) {
      return phoneNumber.isValid();
    }
  } catch {
    return false;
  }
  return null;
};
