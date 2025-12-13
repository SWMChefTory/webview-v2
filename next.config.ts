import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // eslint: {
  //   //temp option
  //   ignoreDuringBuilds: true,
  // },
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