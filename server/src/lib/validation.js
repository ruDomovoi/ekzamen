export const regex = {
  login: /^[a-zA-Z0-9]{6,}$/,
  password: /^.{8,}$/,
  fullName: /^[А-Яа-яЁё\s]+$/,
  phone: /^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  date: /^\d{2}\.\d{2}\.\d{4}$/
};

export function validateRegistration(data) {
  const errors = {};
  if (!regex.login.test(data.login || '')) {
    errors.login = 'Логин: латиница/цифры, минимум 6 символов.';
  }
  if (!regex.password.test(data.password || '')) {
    errors.password = 'Пароль: минимум 8 символов.';
  }
  if (!regex.fullName.test(data.fullName || '')) {
    errors.fullName = 'ФИО: только кириллица и пробелы.';
  }
  if (!regex.phone.test(data.phone || '')) {
    errors.phone = 'Телефон: 8(XXX)XXX-XX-XX.';
  }
  if (!regex.email.test(data.email || '')) {
    errors.email = 'Некорректный email.';
  }
  return errors;
}

export function validateLogin(data) {
  const errors = {};
  if (!data.login) {
    errors.login = 'Введите логин.';
  }
  if (!data.password) {
    errors.password = 'Введите пароль.';
  }
  return errors;
}

export function validateApplication(data) {
  const errors = {};
  if (!data.courseName) {
    errors.courseName = 'Выберите курс.';
  }
  if (!regex.date.test(data.startDate || '')) {
    errors.startDate = 'Дата: ДД.ММ.ГГГГ.';
  }
  if (!data.paymentMethod) {
    errors.paymentMethod = 'Выберите способ оплаты.';
  }
  return errors;
}
