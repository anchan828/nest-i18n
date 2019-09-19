import { ArgumentsHost } from "@nestjs/common";

export interface I18nMessage<T> extends Object {
  key: string;
  options?: T;
}

export interface I18nExceptionFilter<T> {
  getTranslation(message: I18nMessage<T>, host: ArgumentsHost): string;
}
