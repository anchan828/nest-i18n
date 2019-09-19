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

## License

[MIT](LICENSE)
