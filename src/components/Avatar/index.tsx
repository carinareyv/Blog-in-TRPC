import React from 'react';
import Image from 'next/image';


type AvatarProps = {
    src: string;
    alt: string;
}

const Avatar = ({src, alt}: AvatarProps) => {
  return (
    <Image src={src} alt={alt} fill className="rounded-full"/>
  )
}

export default Avatar