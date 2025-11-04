import { afterEach, describe, expect, it } from "bun:test";
import { getLog, resetLog } from "./";

describe("Singleton Pattern - Log", () => {
  afterEach(() => {
    resetLog();
  });

  it("should return the same instance on multiple calls", () => {
    const log1 = getLog();
    const log2 = getLog();
    
    expect(log1).toBe(log2);
  });

  it("should maintain state across different calls", () => {
    const log1 = getLog();
    log1.loggin("First message", "info");
    
    const log2 = getLog();
    log2.loggin("Second message", "warn");
    
    expect(log1.logs).toHaveLength(2);
    expect(log2.logs).toHaveLength(2);
    expect(log1).toBe(log2);
  });

  it("should format log messages correctly", () => {
    const logger = getLog();
    logger.loggin("Test message", "error");
    
    const lastLog = logger.logs[logger.logs.length - 1];
    expect(lastLog).toContain("[ERROR]");
    expect(lastLog).toContain("Test message");
    expect(lastLog).toMatch(/\d{4}-\d{2}-\d{2}/);
  });
});