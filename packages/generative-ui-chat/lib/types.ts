// lib/types.ts

import React from "react"


export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
  sharePath?: string
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
    error: string
  }
>

export interface Session {
  user: {
    id: string
    email: string
  }
}


export type Message = {
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
  content: string
  id?: string
  name?: string
  display?: {
    name: string
    props: Record<string, any>
  }
}


export type AIState = {
  chatId: string
  interactions?: string[]
  messages: Message[]
}

export type UIComponent = {
  id: string
  display: React.ReactNode
  spinner?: React.ReactNode
  attachments?: React.ReactNode
}

export type UIState = UIComponent[]


export type ComponentApi = {
  version: string
  setUIState: React.Dispatch<React.SetStateAction<UIState>>
  setAIState: React.Dispatch<React.SetStateAction<AIState>>
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  submitUserMessage: (message: string) => Promise<Message>
  confirmPurchase: (symbol: any, price: any, value: any) => void
}