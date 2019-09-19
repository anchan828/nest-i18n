import { I18nMessage } from "@anchan828/nest-i18n-common";
import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GatewayTimeoutException,
  GoneException,
  HttpException,
  ImATeapotException,
  InternalServerErrorException,
  MethodNotAllowedException,
  NotAcceptableException,
  NotFoundException,
  NotImplementedException,
  PayloadTooLargeException,
  RequestTimeoutException,
  ServiceUnavailableException,
  UnauthorizedException,
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
} from "@nestjs/common";
import { StringMap, TOptions } from "i18next";
export class I18nBadRequestException extends BadRequestException {
  constructor(message: I18nMessage<TOptions<StringMap>>, error?: string) {
    super(message, error);
  }
}

export class I18nHttpException extends HttpException {
  constructor(message: I18nMessage<TOptions<StringMap>>, status: number) {
    super(message, status);
  }
}

export class I18nUnauthorizedException extends UnauthorizedException {
  constructor(message: I18nMessage<TOptions<StringMap>>, error?: string) {
    super(message, error);
  }
}

export class I18nMethodNotAllowedException extends MethodNotAllowedException {
  constructor(message: I18nMessage<TOptions<StringMap>>, error?: string) {
    super(message, error);
  }
}

export class I18nNotFoundException extends NotFoundException {
  constructor(message: I18nMessage<TOptions<StringMap>>, error?: string) {
    super(message, error);
  }
}

export class I18nForbiddenException extends ForbiddenException {
  constructor(message: I18nMessage<TOptions<StringMap>>, error?: string) {
    super(message, error);
  }
}

export class I18nNotAcceptableException extends NotAcceptableException {
  constructor(message: I18nMessage<TOptions<StringMap>>, error?: string) {
    super(message, error);
  }
}

export class I18nRequestTimeoutException extends RequestTimeoutException {
  constructor(message: I18nMessage<TOptions<StringMap>>, error?: string) {
    super(message, error);
  }
}

export class I18nConflictException extends ConflictException {
  constructor(message: I18nMessage<TOptions<StringMap>>, error?: string) {
    super(message, error);
  }
}

export class I18nGoneException extends GoneException {
  constructor(message: I18nMessage<TOptions<StringMap>>, error?: string) {
    super(message, error);
  }
}

export class I18nPayloadTooLargeException extends PayloadTooLargeException {
  constructor(message: I18nMessage<TOptions<StringMap>>, error?: string) {
    super(message, error);
  }
}

export class I18nUnsupportedMediaTypeException extends UnsupportedMediaTypeException {
  constructor(message: I18nMessage<TOptions<StringMap>>, error?: string) {
    super(message, error);
  }
}

export class I18nUnprocessableEntityException extends UnprocessableEntityException {
  constructor(message: I18nMessage<TOptions<StringMap>>, error?: string) {
    super(message, error);
  }
}

export class I18nInternalServerErrorException extends InternalServerErrorException {
  constructor(message: I18nMessage<TOptions<StringMap>>, error?: string) {
    super(message, error);
  }
}

export class I18nNotImplementedException extends NotImplementedException {
  constructor(message: I18nMessage<TOptions<StringMap>>, error?: string) {
    super(message, error);
  }
}

export class I18nBadGatewayException extends BadGatewayException {
  constructor(message: I18nMessage<TOptions<StringMap>>, error?: string) {
    super(message, error);
  }
}

export class I18nServiceUnavailableException extends ServiceUnavailableException {
  constructor(message: I18nMessage<TOptions<StringMap>>, error?: string) {
    super(message, error);
  }
}

export class I18nGatewayTimeoutException extends GatewayTimeoutException {
  constructor(message: I18nMessage<TOptions<StringMap>>, error?: string) {
    super(message, error);
  }
}

export class I18nImATeapotException extends ImATeapotException {
  constructor(message: I18nMessage<TOptions<StringMap>>, error?: string) {
    super(message, error);
  }
}
