// 2023-03-06 20:00:00

// 账号

export const ACCOUNT_SERVER = "http://101.43.225.156:30000";

// export const ACCOUNT_CLIENT = "http://localhost:3000";

export const ACCOUNT_CLIENT = "http://account.aakstart.cn";

// 翻译

export const TRANSLATE_SERVER = "http://101.43.225.156:30005";

export const TRANSLATE_CLIENT = "http://localhost:3005";

// export const TRANSLATE_CLIENT = "http://translate.aakstart.cn";

export const APPS = [
  {
    name: "账号",
    favicon: ACCOUNT_CLIENT + "/favicon.ico",
    url: ACCOUNT_CLIENT,
  },

  {
    name: "翻译",
    favicon: TRANSLATE_CLIENT + "/favicon.ico",
    url: TRANSLATE_CLIENT,
  },
];
