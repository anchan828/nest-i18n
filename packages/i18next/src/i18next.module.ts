import { DynamicModule, Global, Inject, Module, OnModuleInit, Provider } from "@nestjs/common";
import i18next, { InitOptions } from "i18next";
import Backend from "i18next-fs-backend";
import { I18NEXT_INIT_OPTIONS } from "./constants";
import { InitAsyncOptions, InitOptionsFactory } from "./interfaces";

@Global()
@Module({})
export class I18nextModule implements OnModuleInit {
  constructor(@Inject(I18NEXT_INIT_OPTIONS) private readonly options: InitOptions) {}

  async onModuleInit(): Promise<void> {
    await i18next.use(Backend).init(this.options);
  }

  public static register(options: InitOptions): DynamicModule {
    return {
      module: I18nextModule,
      providers: [
        {
          provide: I18NEXT_INIT_OPTIONS,
          useValue: options,
        },
      ],
    };
  }

  public static registerAsync(options: InitAsyncOptions): DynamicModule {
    return {
      module: I18nextModule,
      imports: options.imports,
      providers: [...this.createAsyncProviders(options), ...(options.extraProviders || [])],
    };
  }

  private static createAsyncProviders(options: InitAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    const providers = [this.createAsyncOptionsProvider(options)];

    if (options.useClass) {
      providers.push({
        provide: options.useClass,
        useClass: options.useClass,
      });
    }

    return providers;
  }

  private static createAsyncOptionsProvider(options: InitAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: I18NEXT_INIT_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [];

    if (options.useExisting) {
      inject.push(options.useExisting);
    } else if (options.useClass) {
      inject.push(options.useClass);
    }

    return {
      provide: I18NEXT_INIT_OPTIONS,
      useFactory: (optionsFactory: InitOptionsFactory): InitOptions | Promise<InitOptions> =>
        optionsFactory.createCacheOptions(),
      inject,
    };
  }
}
