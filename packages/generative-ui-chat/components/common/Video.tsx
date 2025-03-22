// generative-ui-chat/components/common/video.tsx
'use client';
import React from 'react'
import { SpinnerIcon } from '../../ui/icons'


type VideoProps = {
  isLoading: boolean,
  src: string
}


export const Video = ({
  isLoading,
  src,
  ...props }:
  VideoProps &
  React.JSX.IntrinsicAttributes &
  React.ClassAttributes<HTMLDivElement> &
  React.HTMLAttributes<HTMLDivElement>) => <div className="flex flex-col gap-2" {...props}>
    <video
      className="rounded-xl w-1/2 md:h-[568px]"
      src={src}
      controls
    />
    <div
      className={`flex flex-row gap-2 items-center ${isLoading ? 'opacity-100' : 'opacity-0'}`}
    >
      <SpinnerIcon />
      <div className="text-zinc-500 text-sm">Analyzing video...</div>
    </div>
  </div>





export const VideoExample = () => {
  return <Video isLoading={true} src={"/videos/books.mp4"} />;
}

