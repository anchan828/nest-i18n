import { ApolloDriver } from "@nestjs/apollo";
import { Controller, createParamDecorator, Get, HttpStatus, INestApplication, UseFilters } from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { GraphQLModule, ResolveField, Resolver } from "@nestjs/graphql";
import { Test } from "@nestjs/testing";
import { GraphQLError } from "graphql";
import i18next from "i18next";
import request from "supertest";
import { I18nExceptionFilter } from "./exception.filter";
import { I18nNotFoundException } from "./exceptions";
import { I18nextModule } from "./i18next.module";
describe.each([
  I18nextModule.register({
    fallbackLng: ["en"],
    resources: {
      en: {
        translation: { test: "Test" },
      },
      ja: {
        translation: { test: "テスト" },
      },
    },
  }),
  I18nextModule.registerAsync({
    useFactory: () => {
      return {
        fallbackLng: ["en"],
        resources: {
          en: {
            translation: { test: "Test" },
          },
          ja: {
            translation: { test: "テスト" },
          },
        },
      };
    },
  }),
])("I18nextModule", (i18nModule) => {
  const AcceptLanguage = createParamDecorator((_, args: ExecutionContextHost) => {
    if (args.getType() === "http") {
      return args.switchToHttp().getRequest().headers["accept-language"];
    } else {
      return args.getArgByIndex(2).req.headers["accept-language"];
    }
  });

  @Controller()
  @UseFilters(I18nExceptionFilter)
  @Resolver("Query")
  class TestController {
    @Get("error")
    @ResolveField("error")
    public error(): Promise<string> {
      throw new I18nNotFoundException({ key: "test" });
    }

    @Get("test")
    @ResolveField("test")
    public test(@AcceptLanguage() acceptLanguage: string): string {
      return i18next.t("test", { lng: acceptLanguage });
    }
  }

  let app: INestApplication;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        i18nModule,
        GraphQLModule.forRoot({
          driver: ApolloDriver,
          bodyParserConfig: { limit: "1000mb" },
          context: ({ req }: { req: Request }): { req: Request } => ({ req }),
          cors: { credentials: true, origin: true },
          fieldResolverEnhancers: ["guards", "interceptors", "filters"],
          formatError: (error: GraphQLError) => {
            error.extensions.code = HttpStatus[error.extensions.status as number];
            return error;
          },
          typeDefs: `type Query {
            error: String
            test: String
          }`,
        }),
      ],
      providers: [TestController],
      controllers: [TestController],
    }).compile();
    app = module.createNestApplication();
    expect(app).toBeDefined();
    await app.init();
  });
  afterEach(async () => {
    await app.close();
  });

  it("should get fallback text", async () => {
    await request(app.getHttpServer())
      .get("/test")
      .then((res) => {
        expect(res.text).toEqual("Test");
      });

    await request(app.getHttpServer())
      .post("/graphql")
      .send({ query: "{test}" })
      .then((res) => {
        expect(res.body).toMatchObject({
          data: {
            test: "Test",
          },
        });
      });

    await request(app.getHttpServer())
      .get("/error")
      .then((res) => {
        expect(res.body).toEqual({
          statusCode: 404,
          error: "Not Found Exception",
          message: "Test",
        });
      });

    await request(app.getHttpServer())
      .post("/graphql")
      .send({ query: "{error}" })
      .then((res) => {
        expect(res.body).toMatchObject({
          errors: [
            {
              extensions: {
                code: "NOT_FOUND",
              },
              message: "Test",
            },
          ],
        });
      });
  });

  it("should get japanese text", async () => {
    await request(app.getHttpServer())
      .get("/test")
      .set("Accept-Language", "ja")
      .then((res) => {
        expect(res.text).toEqual("テスト");
      });

    await request(app.getHttpServer())
      .post("/graphql")
      .set("Accept-Language", "ja")
      .send({ query: "{test}" })
      .then((res) => {
        expect(res.body).toMatchObject({
          data: {
            test: "テスト",
          },
        });
      });

    await request(app.getHttpServer())
      .get("/error")
      .set("Accept-Language", "ja")
      .then((res) => {
        expect(res.body).toEqual({
          statusCode: 404,
          error: "Not Found Exception",
          message: "テスト",
        });
      });

    await request(app.getHttpServer())
      .post("/graphql")
      .set("Accept-Language", "ja")
      .send({ query: "{error}" })
      .then((res) => {
        expect(res.body).toMatchObject({
          errors: [
            {
              extensions: {
                code: "NOT_FOUND",
              },
              message: "テスト",
            },
          ],
        });
      });

    await request(app.getHttpServer())
      .get("/error")
      .set("Accept-Language", "ja;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5")
      .then((res) => {
        expect(res.body).toEqual({
          statusCode: 404,
          message: "テスト",
          error: "Not Found Exception",
        });
      });

    await request(app.getHttpServer())
      .post("/graphql")
      .set("Accept-Language", "ja;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5")
      .send({ query: "{error}" })
      .then((res) => {
        expect(res.body).toMatchObject({
          errors: [
            {
              extensions: {
                code: "NOT_FOUND",
              },
              message: "テスト",
            },
          ],
        });
      });
  });

  it("should get fallback text", async () => {
    await request(app.getHttpServer())
      .get("/error")
      .set("Accept-Language", "fr")
      .then((res) => {
        expect(res.body).toEqual({
          statusCode: 404,
          message: "Test",
          error: "Not Found Exception",
        });
      });

    await request(app.getHttpServer())
      .post("/graphql")
      .set("Accept-Language", "fr")
      .send({ query: "{error}" })
      .then((res) => {
        expect(res.body).toMatchObject({
          errors: [
            {
              extensions: {
                code: "NOT_FOUND",
              },
              message: "Test",
            },
          ],
        });
      });
  });
});
