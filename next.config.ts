import type { NextConfig } from "next";
import i18nConfig from "./next-i18next.config";

const { i18n } = i18nConfig;

const nextConfig: NextConfig = {
  // eslint: {
  //   //temp option
  //   ignoreDuringBuilds: true,
  // },
  i18n,
  typescript: {
    //temp option
    ignoreBuildErrors: true,
  },

  /* config options here */
  // reactStrictMode: true,
};

export default nextConfig;


// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//   output: "export",
  
//   images: {
//     unoptimized: true,
//   },
  
//   eslint: {
    
//     ignoreDuringBuilds: true,
//   },

// };

// export default nextConfig;