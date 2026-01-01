exports.createError = (errorMessage, statusCode) => {
  return { statusCode, errorMessage };
};

exports.dateToCron = (date) => {
  const d = new Date(date);

  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();

  return `${minute} ${hour} ${day} ${month} *`;
};
