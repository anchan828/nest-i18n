import * as exceptions from "@nestjs/common/exceptions";
import { writeFileSync } from "fs";
import { resolve } from "path";
import * as prettier from "prettier";

const exceptionNames = Object.keys(exceptions).filter((key) => key.endsWith("Exception"));

const texts: string[] = [`import { I18nMessage } from "@anchan828/nest-i18n-common";`];

texts.push("import {");
for (const exceptionName of exceptionNames) {
  texts.push(`${exceptionName},`);
}
texts.push(`} from "@nestjs/common"`);

for (const exceptionName of exceptionNames) {
  texts.push(`export class I18n${exceptionName} extends ${exceptionName} {`);
  if (exceptionName === "HttpException") {
    texts.push(`constructor(message: I18nMessage<any>, status: number) {`, `super(message, status);`, `}`);
  } else {
    texts.push(`constructor(message: I18nMessage<any>, error?: string) {`, `super(message, error);`, `}`);
  }

  texts.push(`}`, ``);
}

writeFileSync(
  resolve(__dirname, "../", "exceptions.txt"),
  prettier.format(texts.join("\n"), {
    parser: "typescript",
    ...require("../.prettierrc"),
  }),
  "utf8",
);
