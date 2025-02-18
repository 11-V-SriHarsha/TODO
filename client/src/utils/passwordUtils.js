export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];
  if (password.length < minLength) errors.push(`At least ${minLength} characters`);
  if (!hasUpperCase) errors.push('One uppercase letter');
  if (!hasLowerCase) errors.push('One lowercase letter');
  if (!hasNumbers) errors.push('One number');
  if (!hasSpecialChar) errors.push('One special character');

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const generatePassword = () => {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowercase = 'abcdefghijkmnpqrstuvwxyz';
  const numbers = '23456789';
  const special = '!@#$%^&*()_+';

  const getRandomChar = (str) => str.charAt(Math.floor(Math.random() * str.length));

  let password = 
    getRandomChar(uppercase) +
    getRandomChar(lowercase) +
    getRandomChar(numbers) +
    getRandomChar(special);

  const remainingLength = 8;
  const allChars = uppercase + lowercase + numbers + special;
  
  for (let i = password.length; i < remainingLength; i++) {
    password += getRandomChar(allChars);
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};
