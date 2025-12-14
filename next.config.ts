import type { NextConfig } from "next";

const {i18n}=require("./next-i18next.config");

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