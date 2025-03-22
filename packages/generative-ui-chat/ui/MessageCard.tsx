// ui/message-card.tsx
"use client";

import React from "react";
import { Button, Link, Tooltip, Image } from "@heroui/react";

import { useClipboard } from "@heroui/use-clipboard";
import { Icon } from "@iconify/react";

import { cn } from "../lib/utils";

export type MessageCardProps = React.HTMLAttributes<HTMLDivElement> & {
  avatar?: string;
  showAvatar?: boolean;
  showAvatarOnRight?: boolean;
  showFeedback?: boolean;
  message?: React.ReactNode;
  currentAttempt?: number;
  status?: "success" | "failed";
  attempts?: number;
  messageClassName?: string;
  onAttemptChange?: (attempt: number) => void;
  onMessageCopy?: (content: string | string[]) => void;
  onFeedback?: (feedback: "like" | "dislike") => void;
  onAttemptFeedback?: (feedback: "like" | "dislike" | "same") => void;
};

const MessageCard = React.forwardRef<HTMLDivElement, MessageCardProps>(
  (
    {
      avatar,
      showAvatar,
      showAvatarOnRight,
      message,
      showFeedback,
      attempts = 1,
      currentAttempt = 1,
      status,
      onMessageCopy,
      onAttemptChange,
      onFeedback,
      onAttemptFeedback,
      className,
      messageClassName,
      ...props
    },
    ref,
  ) => {
    const [feedback, setFeedback] = React.useState<"like" | "dislike">();
    const [attemptFeedback, setAttemptFeedback] = React.useState<"like" | "dislike" | "same">();

    const messageRef = React.useRef<HTMLDivElement>(null);

    const { copied, copy } = useClipboard();

    const failedMessageClassName =
      status === "failed" ? "bg-danger-100/50 border border-danger-100 text-foreground" : "";
    const failedMessage = (
      <p>
        Something went wrong, if the issue persists please contact us through our help center
        at&nbsp;
        <Link href="mailto:support@acmeai.com" size="sm">
          support@acmeai.com
        </Link>
      </p>
    );

    const hasFailed = status === "failed";

    const handleCopy = React.useCallback(() => {
      let stringValue = "";

      if (typeof message === "string") {
        stringValue = message;
      } else if (Array.isArray(message)) {
        message.forEach((child) => {
          const childString =
            typeof child === "string" ? child : child?.props?.children?.toString();

          if (childString) {
            stringValue += childString + "\n";
          }
        });
      }

      const valueToCopy = stringValue || messageRef.current?.textContent || "";

      copy(valueToCopy);

      onMessageCopy?.(valueToCopy);
    }, [copy, message, onMessageCopy]);

    const handleFeedback = React.useCallback(
      (liked: boolean) => {
        setFeedback(liked ? "like" : "dislike");

        onFeedback?.(liked ? "like" : "dislike");
      },
      [onFeedback],
    );

    const handleAttemptFeedback = React.useCallback(
      (feedback: "like" | "dislike" | "same") => {
        setAttemptFeedback(feedback);

        onAttemptFeedback?.(feedback);
      },
      [onAttemptFeedback],
    );

    return (
      <div {...props} ref={ref} className={cn("flex gap-3", className)}>
        {showAvatar && !showAvatarOnRight ?
          <Image
            className="bg-background dark:bg-background text-foreground dark:text-foreground"
            radius="full"
            src={avatar || "/material-symbols-person.svg"}
            height={40}
            width={40}
            style={{ minWidth: '40px', minHeight: '40px' }}
            aria-label="avatar"
          /> : <div style={{ minWidth: '40px', minHeight: '40px' }}></div>
        }
        <div className="flex flex-col gap-4">
          <div
            className={cn(
              "relative w-full rounded-medium bg-content2 px-4 py-3 text-default-600",
              failedMessageClassName,
              messageClassName,
            )}
          >
            <div ref={messageRef} className={"pr-20 text-small"}>
              {hasFailed ? failedMessage : message}
            </div>
            {showFeedback && !hasFailed && (
              <div className="absolute right-2 top-2 flex rounded-full bg-content2 shadow-small">
                <Button isIconOnly radius="full" size="sm" variant="light" onPress={handleCopy}>
                  {copied ? (
                    <Icon className="text-lg text-default-600" icon="gravity-ui:check" />
                  ) : (
                    <Icon className="text-lg text-default-600" icon="gravity-ui:copy" />
                  )}
                </Button>
                <Button
                  isIconOnly
                  radius="full"
                  size="sm"
                  variant="light"
                  onPress={() => handleFeedback(true)}
                >
                  {feedback === "like" ? (
                    <Icon className="text-lg text-default-600" icon="gravity-ui:thumbs-up-fill" />
                  ) : (
                    <Icon className="text-lg text-default-600" icon="gravity-ui:thumbs-up" />
                  )}
                </Button>
                <Button
                  isIconOnly
                  radius="full"
                  size="sm"
                  variant="light"
                  onPress={() => handleFeedback(false)}
                >
                  {feedback === "dislike" ? (
                    <Icon className="text-lg text-default-600" icon="gravity-ui:thumbs-down-fill" />
                  ) : (
                    <Icon className="text-lg text-default-600" icon="gravity-ui:thumbs-down" />
                  )}
                </Button>
              </div>
            )}
            {attempts > 1 && !hasFailed && (
              <div className="flex w-full items-center justify-end">
                <Button
                  onClick={() => onAttemptChange?.(currentAttempt > 1 ? currentAttempt - 1 : 1)}
                >
                  <Icon
                    className="cursor-pointer text-default-400 hover:text-default-500"
                    icon="gravity-ui:circle-arrow-left"
                  />
                </Button>
                <Button
                  onClick={() =>
                    onAttemptChange?.(currentAttempt < attempts ? currentAttempt + 1 : attempts)
                  }
                >
                  <Icon
                    className="cursor-pointer text-default-400 hover:text-default-500"
                    icon="gravity-ui:circle-arrow-right"
                  />
                </Button>
                <p className="px-1 text-tiny font-medium text-default-500">
                  {currentAttempt}/{attempts}
                </p>
              </div>
            )}
          </div>
          {showFeedback && attempts > 1 && (
            <div className="flex items-center justify-between rounded-medium border-small border-default-100 px-4 py-3 shadow-small">
              <p className="text-small text-default-600">Was this response better or worse?</p>
              <div className="flex gap-1">
                <Tooltip content="Better">
                  <Button
                    isIconOnly
                    radius="full"
                    size="sm"
                    variant="light"
                    onPress={() => handleAttemptFeedback("like")}
                  >
                    {attemptFeedback === "like" ? (
                      <Icon className="text-lg text-primary" icon="gravity-ui:thumbs-up-fill" />
                    ) : (
                      <Icon className="text-lg text-default-600" icon="gravity-ui:thumbs-up" />
                    )}
                  </Button>
                </Tooltip>
                <Tooltip content="Worse">
                  <Button
                    isIconOnly
                    radius="full"
                    size="sm"
                    variant="light"
                    onPress={() => handleAttemptFeedback("dislike")}
                  >
                    {attemptFeedback === "dislike" ? (
                      <Icon
                        className="text-lg text-default-600"
                        icon="gravity-ui:thumbs-down-fill"
                      />
                    ) : (
                      <Icon className="text-lg text-default-600" icon="gravity-ui:thumbs-down" />
                    )}
                  </Button>
                </Tooltip>
                <Tooltip content="Same">
                  <Button
                    isIconOnly
                    radius="full"
                    size="sm"
                    variant="light"
                    onPress={() => handleAttemptFeedback("same")}
                  >
                    {attemptFeedback === "same" ? (
                      <Icon className="text-lg text-danger" icon="gravity-ui:face-sad" />
                    ) : (
                      <Icon className="text-lg text-default-600" icon="gravity-ui:face-sad" />
                    )}
                  </Button>
                </Tooltip>
              </div>
            </div>
          )}
        </div>
        {showAvatarOnRight ?
          <Image
            className="bg-background dark:bg-background text-foreground dark:text-foreground"
            radius="full"
            src={avatar || "/material-symbols-person.svg"}
            height={40}
            width={40}
            style={{ minWidth: '40px', minHeight: '40px' }}
            aria-label="avatar"
          /> : <div style={{ minWidth: '40px', minHeight: '40px' }}></div>
        }
      </div>
    );
  },
);

export default MessageCard;

MessageCard.displayName = "MessageCard";
