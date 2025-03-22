// lib/interface.tsx


export interface ChatboxComponent<P> extends React.ReactElement<P> {

    name: string
    description: string
    examplePrompt: string


  }