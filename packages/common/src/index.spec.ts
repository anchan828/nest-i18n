describe("interfaces", () => {
  it("should import more types", async () => {
    expect(import("./index")).resolves.toEqual(expect.anything());
  });
});
