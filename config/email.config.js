module.exports = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, // ex : s.mef2703@gmail.com
    pass: process.env.EMAIL_PASS, // mot de passe d’application (ex: mfrg they ftde ctds)
  },
};
