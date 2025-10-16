export default () => {
  const APP_PORT = process.env.APP_PORT_DEV || 3000;
  const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET_DEV;
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET_DEV;

  // Los nombres exportados seran tomados por ConfigService en lugar de los nombres de las variables de entorno en .env
  return {
    APP_PORT,
    JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET,
  };
};
