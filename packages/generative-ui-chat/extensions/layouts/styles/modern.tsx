


'use client';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Card, CardBody, CardHeader, ScrollShadow, Skeleton, Textarea, CardFooter, cn } from "@heroui/react";
import React, { useCallback, useEffect, useState } from 'react';





type ModernStyleLayoutProps = {
    children: React.ReactNode,
    chatbarContent: React.ReactNode,
    isChatbarOpen: boolean,
    toggleChatbar: () => void,
    onChatbarWidthChange: (width: number) => void,
    chatbarWidth: number,
}


const MIN_WIDTH = 320; // Minimum width of the sidebar
const MAX_WIDTH = 600; // Maximum width of the sidebar
const MOBILE_BREAKPOINT = 768; // Mobile breakpoint in pixels


export const ModernStyleLayout = ({
    children = <Skeleton className='w-full h-full' />,
    chatbarContent = <Skeleton className='w-full h-full' />,
    isChatbarOpen = true,
    toggleChatbar = () => { },
    onChatbarWidthChange = () => { },
    chatbarWidth = 200,
}: ModernStyleLayoutProps) => {

    const [isDragging, setIsDragging] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const startResize = useCallback((e: React.MouseEvent) => {
        if (!isMobile) {
            setIsDragging(true);
            document.body.style.userSelect = 'none';
            document.body.style.cursor = 'ew-resize';
        }
    }, [isMobile]);

    const stopResize = useCallback(() => {
        setIsDragging(false);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
    }, []);

    const resize = useCallback((e: MouseEvent) => {
        if (isDragging && isChatbarOpen && !isMobile) {
            e.preventDefault();
            const newWidth = window.innerWidth - e.clientX;
            if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
                onChatbarWidthChange(newWidth);
            }
        }
    }, [isDragging, isChatbarOpen, isMobile, onChatbarWidthChange]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            resize(e);
        };

        const handleMouseUp = () => {
            stopResize();
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, resize, stopResize]);





    return <div className="flex flex-row h-full w-full rounded-lg border-2 border-dashed">
        <ScrollShadow className='h-full w-full overflow-y-scroll scrollbar-thin rounded-l-lg'>
            {children}
        </ScrollShadow>
        {!isMobile && (
            <div
                className="self-center w-1.5 cursor-ew-resize bg-gray-300 hover:bg-gray-400"
                style={{ height: '100%' }}
                onMouseDown={startResize}
            />
        )}
        <div className='bg-tansparent'>
            <Button
                className={`${isMobile ? 'absolute bottom-4 right-4' : 'absolute right-0 top-1/2 transform -translate-y-1/2 rotate-90'} z-40`}
                onClick={toggleChatbar}
            >
                {isChatbarOpen ? 'Close Chat' : 'Open Chat'}
            </Button>
            <div
                className={`h-full z-30 ${isMobile ? 'w-full' : ''}`}
                style={{ width: isMobile ? '100%' : `${chatbarWidth}px` }}
            >
                <Card className="h-full rounded-r-lg" radius='none'>
                    <CardHeader>
                        <h4>Your AI Chatbox</h4>
                    </CardHeader>
                    <CardBody className='p-0'>
                        {chatbarContent}
                    </CardBody>
                    <CardFooter className="p-1">
                        <Textarea
                            tabIndex={0}
                            aria-label="Prompt"
                            placeholder="Send a message."
                            className="relative w-full bg-transparent placeholder:text-zinc-900 focus-within:outline-none sm:text-sm"
                            autoFocus
                            spellCheck="true"
                            autoComplete="off"
                            autoCorrect="off"
                            name="message"
                            minRows={1}
                            disabled
                            endContent={
                                <div className="right-4 top-[13px] sm:right-4">
                                    <Button
                                        isIconOnly
                                        color={"primary"}
                                        isDisabled={true}
                                        radius="lg"
                                        size="sm"
                                        variant="solid"
                                    >
                                        <Icon
                                            className={cn(
                                                "[&>path]:stroke-[2px]",
                                                "text-primary-foreground",
                                            )}
                                            icon="solar:arrow-up-linear"
                                            width={20}
                                        />
                                        <span className="sr-only">Send message</span>
                                    </Button>
                                </div>
                            }
                        />
                    </CardFooter>
                </Card>
            </div>
        </div>
    </div>

}