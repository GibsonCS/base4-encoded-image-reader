import { before, describe, it, afterEach } from "mocha";
import { expect } from "chai";

describe("initialTest", () => {
  it("should return a hello message", () => {
    const hello = "hello";
    expect("hello").to.be.equals(hello);
  });
});
