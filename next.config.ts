/** @type {import('next').NextConfig} */
module.exports = {
    images: {
      unoptimized: true,
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'res.google.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com', // Ảnh Google
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'avatars.githubusercontent.com', // Ảnh GitHub
          port: '',
          pathname: '/**',
        },
      ],
    },
    webpack: (config) => {
      // Bỏ qua các ảnh từ leaflet/dist/images/*.png (tránh dùng sharp)
      config.module.rules.push({
        test: /leaflet\/dist\/images\/.*\.png$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/media/[name].[hash][ext]',
        },
      });
  
      return config;
    },
  };