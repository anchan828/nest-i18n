import {
  BadRequestException,
  Catch,
  Controller,
  Get,
  HttpException,
  INestApplication,
  UseFilters,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import { BaseI18nExceptionFilter } from "./exception.filter";
import { I18nMessage } from "./interfaces";

describe("BaseI18nExceptionFilter", () => {
  @Catch(HttpException)
  class TestI18nExceptionFilter extends BaseI18nExceptionFilter<any> {
    public getTranslation(message: I18nMessage<any>): string {
      return `translated ${message.key}`;
    }
  }

  let filter: TestI18nExceptionFilter;

  beforeEach(async () => {
    filter = new TestI18nExceptionFilter();
  });

  it("should be defined", () => {
    expect(BaseI18nExceptionFilter).toBeDefined();
  });

  describe("e2e tests", () => {
    @Controller()
    @UseFilters(TestI18nExceptionFilter)
    class TestController {
      @Get("error")
      public error(): Promise<string> {
        throw new HttpException("error message", 400);
      }

      @Get("i18n-error")
      public i18nError(): Promise<string> {
        throw new BadRequestException({ key: "test" });
      }
    }
    let app: INestApplication;
    beforeEach(async () => {
      const module = await Test.createTestingModule({
        controllers: [TestController],
      }).compile();
      app = module.createNestApplication();
      expect(app).toBeDefined();
      await app.init();
      filter = new TestI18nExceptionFilter();
    });
    afterEach(async () => {
      await app.close();
    });

    it("should get text", async () => {
      await request(app.getHttpServer())
        .get("/i18n-error")
        .then(res => {
          expect(res.body).toEqual({
            statusCode: 400,
            message: "translated test",
            error: "Bad Request Exception",
          });
        });
    });

    it("should get text", async () => {
      await request(app.getHttpServer())
        .get("/error")
        .then(res => {
          expect(res.body).toEqual({
            statusCode: 400,
            message: "error message",
          });
        });
    });
  });

  describe("getAcceptLanguageHeader", () => {
    it("should be defined", () => {
      expect(filter["getAcceptLanguageHeader"]).toBeDefined();
    });
    it("should return undefined", () => {
      expect(
        filter["getAcceptLanguageHeader"]({
          switchToHttp: () => ({
            getRequest: (): any => ({}),
          }),
          getType: () => "http",
        } as any),
      ).toBeUndefined();
    });

    it("should get accept-language header (http)", () => {
      expect(
        filter["getAcceptLanguageHeader"]({
          switchToHttp: () => ({
            getRequest: (): any => ({
              headers: {
                "accept-language": "ja, en",
              },
            }),
          }),
          getType: () => "http",
        } as any),
      ).toBe("ja, en");
    });

    it("should get accept-language header (graphql)", () => {
      expect(
        filter["getAcceptLanguageHeader"]({
          getArgByIndex: () => ({
            req: {
              headers: {
                "accept-language": "ja, en",
              },
            },
          }),
          getType: () => "graphql",
        } as any),
      ).toBe("ja, en");
    });
  });

  describe("getCurrentLanguages", () => {
    it("should be defined", () => {
      expect(filter.getCurrentLanguages).toBeDefined();
    });
    it("should get empty array", () => {
      filter["getAcceptLanguageHeader"] = (): undefined => undefined;
      expect(filter.getCurrentLanguages({} as any)).toEqual([]);
    });
    it("should get languages", () => {
      filter["getAcceptLanguageHeader"] = (): string => "ja, en";
      expect(filter.getCurrentLanguages({} as any)).toEqual(["ja", "en"]);
    });
  });

  describe("getTranslation", () => {
    it("should be defined", () => {
      expect(filter.getTranslation).toBeDefined();
    });
    it("should return key", () => {
      expect(filter.getTranslation({ key: "key" })).toBe("translated key");
    });
  });
});
