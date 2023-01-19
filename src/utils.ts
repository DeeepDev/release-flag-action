import { readFile } from "fs/promises";
import { compile } from "handlebars";
import sharp, { SharpOptions } from "sharp";

/**
 *
 * @param templatePath - path to the template file
 * @param ctx - context object to use for rendering the template file
 * @returns
 */
export const renderHbsTemplate = <TContext extends object>(templatePath: string, ctx: TContext): Promise<string> =>
  readFile(templatePath, { encoding: "utf-8" }).then((buf) => compile<TContext>(buf)(ctx));

/**
 *
 * @param xml - xml string of the file to be conterted to JPG
 * @param density - DPI of the image
 * @returns Promise that resolves to jpg buffer
 */
export const createJpg = (xml: string, density: SharpOptions["density"] = 150): Promise<Buffer> =>
  sharp(Buffer.from(xml, "utf-8"), { density }).toBuffer();
