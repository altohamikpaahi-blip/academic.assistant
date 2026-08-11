/// <reference types="vite/client" />

declare module '*?url' {
  const src: string;
  export default src;
}

declare module 'mammoth/mammoth.browser' {
  export function extractRawText(input: { arrayBuffer: ArrayBuffer }): Promise<{ value: string }>;
}
