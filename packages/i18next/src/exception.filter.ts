import { BaseI18nExceptionFilter, BaseI18nGqlExceptionFilter, I18nMessage } from "@anchan828/nest-i18n-common";
import { ArgumentsHost, Catch, HttpException } from "@nestjs/common";
import { StringMap, t, TOptions } from "i18next";

@Catch(HttpException)
export class I18nExceptionFilter extends BaseI18nExceptionFilter<TOptions<StringMap>> {
  public getTranslation(message: I18nMessage<TOptions<StringMap>>, host: ArgumentsHost): string {
    const languages = this.getCurrentLanguages(host);

    if (Array.isArray(languages)) {
      message.options = Object.assign({ lng: languages[0] }, message.options);
    }

    return t(message.key, message.options);
  }
}

@Catch(HttpException)
export class I18nGqlExceptionFilter extends BaseI18nGqlExceptionFilter<TOptions<StringMap>> {
  public getTranslation(message: I18nMessage<TOptions<StringMap>>, host: ArgumentsHost): string {
    const languages = this.getCurrentLanguages(host);

    if (Array.isArray(languages)) {
      message.options = Object.assign({ lng: languages[0] }, message.options);
    }

    return t(message.key, message.options);
  }
}
