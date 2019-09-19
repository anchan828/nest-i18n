import { ArgumentsHost, HttpException } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { I18nMessage } from "./interfaces";

/**
 *
 *
 * @export
 * @abstract
 * @class BaseI18nExceptionFilter
 * @extends {BaseExceptionFilter}
 * @template T
 */
export abstract class BaseI18nExceptionFilter<T> extends BaseExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost): void {
    exception = this.translateException(exception, host);
    super.catch(exception, host);
  }

  protected translateException(exception: HttpException, host: ArgumentsHost): HttpException {
    if (exception.message && exception.message.key) {
      const message = this.getTranslation(exception.message, host);
      const status = Reflect.get(exception, "status");
      Reflect.set(exception, "message", message);
      Reflect.set(exception, "response", { statusCode: status, message: message });
    }

    return exception;
  }

  protected getAcceptLanguageHeader(host: ArgumentsHost): string | undefined {
    const req = host.switchToHttp().getRequest();

    if (!req) {
      return;
    }

    return req.headers["accept-language"];
  }

  /**
   * Get languages from accept-language header
   *
   * @param {ArgumentsHost} host
   * @returns {(string | undefined)}
   * @memberof BaseI18nExceptionFilter
   */
  public getCurrentLanguages(host: ArgumentsHost): string[] {
    const language = this.getAcceptLanguageHeader(host);

    if (!language) {
      return [];
    }

    return language
      .split(",")
      .filter(l => l)
      .map(l => l.trim().split(";")[0]);
  }

  public abstract getTranslation(message: I18nMessage<T>, host: ArgumentsHost): string;
}

export abstract class BaseI18nGqlExceptionFilter<T> extends BaseI18nExceptionFilter<T> {
  public catch(exception: HttpException, host: ArgumentsHost): HttpException {
    exception = this.translateException(exception, host);
    return exception;
  }

  protected getAcceptLanguageHeader(host: ArgumentsHost): string | undefined {
    const context = host.getArgByIndex(2);

    for (const key of Object.keys(context)) {
      if (context[key] && context[key].headers) {
        return context[key].headers["accept-language"];
      }
    }
  }
}
