# @anchan828/nest-i18n-i18next

![npm](https://img.shields.io/npm/v/@anchan828/nest-i18n-i18next.svg)
![NPM](https://img.shields.io/npm/l/@anchan828/nest-i18n-i18next.svg)

## Description

i18n module for [i18next](https://www.i18next.com)

**Note: This package only supports HttpException filter**

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

Use **I18nGqlExceptionFilter**

```ts
import { I18nGqlExceptionFilter, I18nNotFoundException } from "@anchan828/nest-i18n-i18next";

@Resolver("User")
@UseFilters(I18nGqlExceptionFilter)
export class RootUserQueryResolver {
  @Query()
  public async user(@Args("id") id: string): Promise<Nullable<UserEntity>> {
    throw new I18nNotFoundException({ key: "test" });
  }
}
```

## Note

This package is using `i18next-node-fs-backend` for loading translations from static files.

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
