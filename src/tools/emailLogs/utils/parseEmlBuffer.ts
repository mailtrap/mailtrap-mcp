import { Readable } from "stream";
import { Splitter, SplitterData } from "mailsplit";

async function parseEmlBuffer(emlBuffer: Buffer): Promise<{
  htmlContent: string;
  textContent: string;
}> {
  let htmlContent = "";
  let textContent = "";
  let currentDecoder: NodeJS.ReadWriteStream | null = null;
  let currentType: "text/html" | "text/plain" | null = null;
  let splitterEnded = false;
  let pendingDecoders = 0;
  let resolveDone: () => void = () => {};
  let rejectDone: (err: Error) => void = () => {};

  const done = new Promise<void>((resolve, reject) => {
    resolveDone = resolve;
    rejectDone = reject;
  });

  const splitter = new Splitter();
  splitter.on("error", (err: Error) => rejectDone(err));
  splitter.on("data", (data: SplitterData) => {
    if (data.type === "node") {
      if (currentDecoder) {
        currentDecoder.end();
      }
      if (
        data.contentType === "text/html" ||
        data.contentType === "text/plain"
      ) {
        currentDecoder = data.getDecoder?.() ?? null;
        currentType = data.contentType as "text/html" | "text/plain";
        if (currentDecoder) {
          const partType = currentType;
          pendingDecoders += 1;
          const chunks: Buffer[] = [];
          currentDecoder.on("error", (err: Error) => rejectDone(err));
          currentDecoder.on("data", (c: Buffer) => chunks.push(c));
          currentDecoder.on("end", () => {
            const s = Buffer.concat(chunks).toString("utf8");
            if (partType === "text/html") htmlContent = s;
            else textContent = s;
            pendingDecoders -= 1;
            if (pendingDecoders === 0 && splitterEnded) resolveDone();
          });
        }
      } else {
        currentDecoder = null;
      }
    } else if (data.type === "body" && currentDecoder && data.value) {
      currentDecoder.write(data.value);
    }
  });
  splitter.on("end", () => {
    splitterEnded = true;
    if (currentDecoder) currentDecoder.end();
    if (pendingDecoders === 0) resolveDone();
  });

  const readable = Readable.from([emlBuffer]);
  readable.pipe(splitter);
  await done;
  return { htmlContent, textContent };
}

export default parseEmlBuffer;
