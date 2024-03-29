# @anchan828/nest-i18n-i18next

![npm](https://img.shields.io/npm/v/@anchan828/nest-i18n-i18next.svg)
![NPM](https://img.shields.io/npm/l/@anchan828/nest-i18n-i18next.svg)

## Description

i18n module for [i18next](https://www.i18next.com)

## Installation

```sh
$ npm i --save @anchan828/nest-i18n-i18next i18next
```

## Quick Start

### Importing module

```ts
@Module({
  imports: [
    I18nextModule.register({
      fallbackLng: ["en"],
      resources: {
        en: {
          translation: { test: "Test" },
        },
        jp: {
          translation: { test: "テスト" },
        },
      },
    }),
  ],
})
export class AppModule {}
```

### Basic usage

```ts
@Controller()
class TestController {
  @Get("test")
  public test(@Headers("accept-language") acceptLanguage: string): string {
    return i18next.t("test", { lng: acceptLanguage });
  }
}
```

### Using with controller

Use **I18nExceptionFilter**

```ts
import { I18nExceptionFilter, I18nNotFoundException } from "@anchan828/nest-i18n-i18next";

@Controller()
@UseFilters(I18nExceptionFilter)
class TestController {
  @Get("error")
  public i18nError(): Promise<string> {
    throw new I18nNotFoundException({ key: "test" });
  }
}
```

### Using with GraphQL

Use **I18nExceptionFilter**

```ts
import { I18nExceptionFilter, I18nNotFoundException } from "@anchan828/nest-i18n-i18next";

@Resolver("User")
@UseFilters(I18nExceptionFilter)
export class RootUserQueryResolver {
  @Query()
  public async user(@Args("id") id: string): Promise<Nullable<UserEntity>> {
    throw new I18nNotFoundException({ key: "test" });
  }
}
```

### Set Accept-Language header

You need to set Accept-Language header for detecting language.

![](https://i.gyazo.com/460408102a11c604452dbb4dc89710ae.png)

## Note

There are wrapped exception classes for i18n. See [./src/exceptions.t](./src/exceptions.ts)

This package is using `i18next-fs-backend` for loading translations from static files.

```ts
I18nextModule.register({
  fallbackLng: ["en"],
  backend: {
    loadPath: "/locales/{{lng}}/{{ns}}.json",
  },
});
```

## License

[MIT](LICENSE)
