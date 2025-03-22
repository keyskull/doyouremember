'use client';
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Card, CardBody, CardFooter, CardHeader, cn, ScrollShadow, Skeleton, Textarea } from "@heroui/react"
// import { useTheme } from 'next-themes'














export const ClassicStyleLayout = ({
    children = <Skeleton className='w-full h-full' />,
    chatboxComponent,
}: { children: React.ReactNode, chatboxComponent?: React.ReactNode }) => {
    // const { theme } = useTheme();
    const isDark = true;

    return (
        <div className="relative w-full h-full bg-content2 text-content2-foreground rounded-lg border-2 border-dashed">
            {children}
            <Card className="absolute right-1 bottom-1  min-w-[200px] min-h-[400px]">
                <CardHeader className='bg-slate-200 justify-between'>
                    <h4>Your AI Chatbox</h4>
                    <div className='flex gap-2'>
                        <Button
                            style={{ height: '15px', width: '15px' }}
                            className={cn('rounded-full', isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600')}
                        />
                        <Button
                            style={{ height: '15px', width: '15px' }}
                            className={cn('rounded-full', isDark ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600')}
                        />
                    </div>
                </CardHeader>
                <CardBody className="p-0 h-[200px]">
                    <ScrollShadow className="scrollbar-thin scroll-smooth">
                        {chatboxComponent}
                    </ScrollShadow>
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
    )
}