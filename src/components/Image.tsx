"use client";

import { IKImage } from "imagekitio-next";
import NextImage from "next/image";

type ImageType = {
  path: string;
  w?: number;
  h?: number;
  alt: string;
  className?: string;
  tr?: boolean;
};

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

const Image = ({ path, w, h, alt, className, tr }: ImageType) => {
  const isExternalUrl = /^https?:\/\//.test(path);

  // Full URLs hosted on the ImageKit endpoint render through IKImage.
  // Any other external URL (e.g. FreeAPI media from randomuser.me,
  // themealdb.com) and plain local asset paths render with next/image.
  const isImageKitUrl =
    isExternalUrl &&
    !!urlEndpoint &&
    new URL(path).host === new URL(urlEndpoint).host;

  if (isImageKitUrl || (!isExternalUrl && path.startsWith("/") && urlEndpoint)) {
    return (
      <IKImage
        urlEndpoint={urlEndpoint}
        path={path}
        {...(tr
          ? { transformation: [{ width: `${w}`, height: `${h}` }] }
          : { width: w, height: h })}
        alt={alt}
        className={className}
      />
    );
  }

  return (
    <NextImage
      src={isExternalUrl ? path : `/${path}`}
      width={w ?? 500}
      height={h ?? 500}
      alt={alt}
      className={`${
        tr ? "object-cover w-full h-full" : "max-w-full h-auto"
      } ${className ?? ""}`}
    />
  );
};

export default Image;
