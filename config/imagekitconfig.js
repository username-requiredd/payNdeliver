// config/imagekit-config.js
import ImageKit from "imagekit-javascript";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT,
  authenticationEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/api/imagekit-auth`,
});

export default imagekit;