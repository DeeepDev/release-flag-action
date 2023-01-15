import { readFile } from "fs/promises";
import { compile } from "handlebars";
import sharp from "sharp";

/**
 *
 * @param templatePath
 * @param ctx
 * @returns
 */
export const renderHbsTemplate = <TContext extends object>(templatePath: string, ctx: TContext): Promise<string> =>
  readFile(templatePath, { encoding: "utf-8" }).then((buf) => compile<TContext>(buf)(ctx));

/**
 *
 * @param xml
 * @returns Promise that resolves to jpg buffer
 */
export const createJpg = (xml: string): Promise<Buffer> =>
  sharp(Buffer.from(xml, "utf-8"), { density: 150 }).toBuffer();
