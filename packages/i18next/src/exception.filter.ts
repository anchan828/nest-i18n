import { I18nMessage, StringMap } from "@anchan828/nest-i18n-common";
import { ArgumentsHost, Catch, ContextType, HttpException } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import i18next, { TOptions } from "i18next";

@Catch(HttpException)
export class I18nExceptionFilter extends BaseExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost): void | HttpException {
    exception = this.translateException(exception, host);
    switch (this.getHostType(host)) {
      case "graphql":
        return exception;
      case "http":
      default:
        super.catch(exception, host);
    }
  }

  protected translateException(exception: HttpException, host: ArgumentsHost): HttpException {
    const response = exception.getResponse() as I18nMessage<TOptions<StringMap>>;
    if (typeof response === "object" && response.key) {
      const message = this.getTranslation(response, host);
      const status = Reflect.get(exception, "status");
      Reflect.set(exception, "response", {
        statusCode: status,
        error: exception.message.replace(/^18 /g, ""),
        message,
      });
      exception.message = message;
    }
    return exception;
  }

  protected getAcceptLanguageHeader(host: ArgumentsHost): string | undefined {
    const req = this.getRequest(host);

    if (!(req && req.headers)) {
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
      .filter((l) => l)
      .map((l) => l.trim().split(";")[0]);
  }

  public getTranslation(message: I18nMessage<TOptions<StringMap>>, host: ArgumentsHost): string {
    const languages = this.getCurrentLanguages(host);

    if (Array.isArray(languages)) {
      message.options = Object.assign({ lng: languages[0] }, message.options);
    }

    return i18next.t(message.key, message.options);
  }

  private getRequest(host: ArgumentsHost): any {
    switch (this.getHostType(host)) {
      case "graphql":
        const context = host.getArgByIndex(2);
        for (const key of Object.keys(context)) {
          if (context[key] && context[key].headers) {
            return context[key];
          }
        }
        break;
      case "http":
      default:
        return host.getArgByIndex(0);
    }
  }

  private getHostType(host: ArgumentsHost): ContextType | "graphql" {
    return host.getType();
  }
}
