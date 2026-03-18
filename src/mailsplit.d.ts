declare module "mailsplit" {
  import { Transform } from "stream";

  export class Splitter extends Transform {
    on(event: "data", listener: (data: SplitterData) => void): this;
    on(event: "end", listener: () => void): this;
    on(event: "error", listener: (err: Error) => void): this;
  }

  export interface SplitterData {
    type: "node" | "body" | "data";
    contentType?: string;
    value?: Buffer;
    getDecoder?: () => NodeJS.ReadWriteStream;
  }
}
