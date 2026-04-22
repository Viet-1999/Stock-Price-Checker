// @ts-nocheck
const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  // 🧪 Test 1: View one stock
  describe("GET /api/stock-prices?stock=AAPL", () => {
    it("should return stock data", async () => {
      const res = await fetch(
        "http://localhost:3000/api/stock-prices?stock=AAPL",
      );
      const data = await res.json();

      assert.equal(res.status, 200);
      assert.equal(data.stockData.stock, "AAPL");
      assert.equal(typeof data.stockData.price, "number");
      assert.equal(typeof data.stockData.likes, "number");
    });
  });

  // 🧪 Test 2: View + like
  describe("GET /api/stock-prices?stock=AAPL&like=true", () => {
    it("should like the stock", async () => {
      const res = await fetch(
        "http://localhost:3000/api/stock-prices?stock=AAPL&like=true",
      );
      const data = await res.json();

      assert.equal(res.status, 200);
      assert.equal(data.stockData.stock, "AAPL");
      assert.equal(typeof data.stockData.likes, "number");
    });
  });

  // 🧪 Test 3: Like same stock again
  describe("GET /api/stock-prices?stock=AAPL&like=true again", () => {
    it("should not increase likes again", async () => {
      const res1 = await fetch(
        "http://localhost:3000/api/stock-prices?stock=AAPL&like=true",
      );
      const data1 = await res1.json();

      const res2 = await fetch(
        "http://localhost:3000/api/stock-prices?stock=AAPL&like=true",
      );
      const data2 = await res2.json();

      assert.equal(data1.stockData.likes, data2.stockData.likes);
    });
  });

  // 🧪 Test 4: View two stocks
  describe("GET /api/stock-prices?stock=AAPL&stock=GOOG", () => {
    it("should return data for two stocks", async () => {
      const res = await fetch(
        "http://localhost:3000/api/stock-prices?stock=AAPL&stock=GOOG",
      );
      const data = await res.json();

      assert.equal(res.status, 200);
      assert.equal(data.stockData.length, 2);
      assert.equal(typeof data.stockData[0].rel_likes, "number");
      assert.equal(typeof data.stockData[1].rel_likes, "number");
    });
  });

  // 🧪 Test 5: View + like two stocks
  describe("GET /api/stock-prices?stock=AAPL&stock=GOOG&like=true", () => {
    it("should like both stocks", async () => {
      const res = await fetch(
        "http://localhost:3000/api/stock-prices?stock=AAPL&stock=GOOG&like=true",
      );
      const data = await res.json();

      assert.equal(res.status, 200);
      assert.equal(data.stockData.length, 2);
      assert.equal(typeof data.stockData[0].rel_likes, "number");
    });
  });
});
