/// <reference types="react-scripts" />

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.jpg' {
  const content: any;
  export default content;
}

declare module '*.jpeg' {
  const content: any;
  export default content;
}

declare module '*.gif' {
  const content: any;
  export default content;
}

declare module '*.bmp' {
  const content: any;
  export default content;
}

declare module '*.tiff' {
  const content: any;
  export default content;
}

declare module '*.webp' {
  const content: any;
  export default content;
}

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.md' {
  const content: any;
  export default content;
}

declare module '*.xml' {
  const content: any;
  export default content;
}

declare module '*.json' {
  const content: any;
  export default content;
}

declare global {
  namespace React {
    interface HTMLProps<T> extends AriaAttributes, DOMAttributes<T> {
      css?: any;
    }
  }
}
