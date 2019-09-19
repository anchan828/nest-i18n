# @anchan828/nest-i18n-packages

## Description

i18n for nestjs

## Support i18n libraries

### i18next

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

See [@anchan828/nest-i18n-i18next](./packages/i18next#readme)

## License

[MIT](LICENSE)
