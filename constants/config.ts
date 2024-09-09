export const backend_url = "http://localhost:4000";
export const backend_url_prod = "http://161.132.38.235:4000";
export const backend_url_dev = "http://localhost:4000";

// type Environment = "development" | "production" | "staging";

// interface Config {
//   apiUrl: string;
//   debug: boolean;
// }

// export const config: Record<Environment, Config> = {
//   development: {
//     apiUrl: "http://localhost:3000/api",
//     debug: true,
//   },
//   production: {
//     apiUrl: "https://api.myapp.com",
//     debug: false,
//   },
//   staging: {
//     apiUrl: "https://staging.api.myapp.com",
//     debug: true,
//   },
// };

// const getEnvironment = (): Environment => {
//   if (process.env.BACKEND_URL === "production") {
//     return "production";
//   } else if (process.env.BACKEND_URL === "staging") {
//     return "staging";
//   } else {
//     return "development";
//   }
// };

// const environment = getEnvironment();
// const { apiUrl, debug } = config[environment];
