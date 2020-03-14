import { Controller, Get, INestApplication, UseFilters } from "@nestjs/common";
import { Test } from "@nestjs/testing";
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
])("I18nextModule", i18nModule => {
  @Controller()
  @UseFilters(I18nExceptionFilter)
  class TestController {
    @Get("error")
    public i18nError(): Promise<string> {
      throw new I18nNotFoundException({ key: "test" });
    }
  }

  let app: INestApplication;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [i18nModule],
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
      .get("/error")
      .then(res => {
        expect(res.body).toEqual({
          statusCode: 404,
          message: "Not Found Exception",
          error: "Test",
        });
      });
  });

  it("should get japanese text", async () => {
    await request(app.getHttpServer())
      .get("/error")
      .set("Accept-Language", "ja")
      .then(res => {
        expect(res.body).toEqual({
          statusCode: 404,
          message: "Not Found Exception",
          error: "テスト",
        });
      });

    await request(app.getHttpServer())
      .get("/error")
      .set("Accept-Language", "ja;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5")
      .then(res => {
        expect(res.body).toEqual({
          statusCode: 404,
          error: "テスト",
          message: "Not Found Exception",
        });
      });
  });

  it("should get fallback text", async () => {
    await request(app.getHttpServer())
      .get("/error")
      .set("Accept-Language", "fr")
      .then(res => {
        expect(res.body).toEqual({
          statusCode: 404,
          error: "Test",
          message: "Not Found Exception",
        });
      });
  });
});
