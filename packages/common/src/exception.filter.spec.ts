import { BaseI18nExceptionFilter } from "./exception.filter";
import { I18nMessage } from "./interfaces";

describe("BaseI18nExceptionFilter", () => {
  it("should be defined", () => {
    expect(BaseI18nExceptionFilter).toBeDefined();
  });

  class TestI18nExceptionFilter extends BaseI18nExceptionFilter<any> {
    public getTranslation(message: I18nMessage<any>): string {
      return message.key;
    }
  }
  let filter: TestI18nExceptionFilter;
  beforeEach(() => {
    filter = new TestI18nExceptionFilter();
  });

  describe("catch", () => {
    it("should be defined", () => {
      expect(filter.catch).toBeDefined();
    });

    it("should return exception", () => {
      expect(filter.catch({ message: { key: "test" } } as any, {} as any)).toEqual({
        message: "test",
        response: { message: "test" },
      });
    });
  });

  describe("getAcceptLanguageHeader", () => {
    it("should be defined", () => {
      expect(filter["getAcceptLanguageHeader"]).toBeDefined();
    });
  });

  describe("getTranslation", () => {
    it("should be defined", () => {
      expect(filter.getTranslation).toBeDefined();
    });
    it("should return key", () => {
      expect(filter.getTranslation({ key: "key" })).toBe("key");
    });
  });
});
