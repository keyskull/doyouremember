


import React from "react"

import { motion } from 'framer-motion'
// import { useTheme } from 'next-themes'
import { Button, Card, CardFooter, cn, Textarea, Input, ScrollShadow, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Skeleton } from "@heroui/react"
import { Icon } from '@iconify/react';



type ImmersiveStyleLayoutProps = {
    sectionComponent?: React.ReactNode,
    chatboxComponent?: React.ReactNode
}



export const ImmersiveStyleLayout = ({
    sectionComponent = <Skeleton className="rounded-lg" />,
    chatboxComponent = <Skeleton className="rounded-lg" />
}: ImmersiveStyleLayoutProps) => {
    // const { theme } = useTheme();
    const isDark = true;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
        >
            <div className="flex flex-row h-full w-full">
                <Card
                    className="flex flex-col w-2/6 bg-default-800/60 dark:bg-default-800/50 rounded-l-lg justify-start items-start p-4 gap-4 max-md:hidden"
                    isBlurred
                    radius="none">
                    <div className="flex w-full justify-end">
                        <Icon
                            icon={"material-symbols:flip"}
                            className="cursor-pointer"
                            width={20}
                            height={20}
                            color="white" />
                    </div>
                    <Input
                        classNames={{
                            base: "w-full h-10",
                            mainWrapper: "h-full",
                            input: "text-small",
                            inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                        }}
                        placeholder="Type to search..."
                        size="sm"
                        startContent={<Icon icon="material-symbols:search" height={18} width={18} />}
                        type="search"
                    />

                    <h4 className="text-white font-bold">Section</h4>
                    <ScrollShadow className="flex flex-col object-cover scrollbar-thin scroll-smooth">
                        {sectionComponent}
                    </ScrollShadow>
                </Card>
                <Card
                    className={`w-full max-md:w-full h-full backdrop-blur-sm ${isDark ? 'bg-black' : 'bg-white'} bg-default-600/60 dark:bg-default-600/50 rounded-r-lg max-md:rounded-lg`}
                    isBlurred
                    radius="none">
                    {/* <CardHeader className='bg-slate-200 justify-between'>
                        <h4>Your AI Chatbox</h4>
                        <div className='flex gap-2'>
                            <button
                                style={{ height: '15px', width: '15px' }}
                                className={cn('rounded-full', isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600')}
                            />
                            <button
                                style={{ height: '15px', width: '15px' }}
                                className={cn('rounded-full', isDark ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600')}
                            />
                        </div>
                    </CardHeader> */}
                    <div className="p-4">
                        <Dropdown >
                            <DropdownTrigger>
                                <a
                                    className="text-white font-bold cursor-pointer">
                                    {"With your Models >"}
                                </a>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Example with disabled actions">
                                <DropdownItem key="ChatGPT-4.0">ChatGPT-4.0</DropdownItem>
                                <DropdownItem key="ChatGPT-4o">ChatGPT-4o</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>

                    </div>
                    <ScrollShadow className="flex flex-col object-cover scrollbar-thin scroll-smooth">
                        {chatboxComponent}

                    </ScrollShadow>
                    <CardFooter className="justify-center before:bg-white/10 overflow-hidden py-1 absolute bottom-1 ml-1 z-10">
                        <Textarea
                            tabIndex={0}
                            aria-label="Prompt"
                            placeholder="Send a message."
                            className="relative w-full bg-transparent placeholder:text-zinc-900 px-4 focus-within:outline-none sm:text-sm"
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
        </motion.div>
    )


}