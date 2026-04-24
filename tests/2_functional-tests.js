// @ts-nocheck
const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

describe("Functional Tests", () => {
  // 🧪 Test 1: View one stock
  describe("GET /api/stock-prices?stock=AAPL", () => {
    it("should return stock data", async () => {
      const res = await chai
        .request(server)
        .get("/api/stock-prices?stock=AAPL");
      assert.equal(res.status, 200);
      assert.equal(res.body.stockData.stock, "AAPL");
      assert.equal(typeof res.body.stockData.price, "number");
      assert.equal(typeof res.body.stockData.likes, "number");
    });
  });

  // 🧪 Test 2: View + like
  describe("GET /api/stock-prices?stock=AAPL&like=true", () => {
    it("should like the stock", async () => {
      const res = await chai
        .request(server)
        .get("/api/stock-prices?stock=AAPL&like=true");
      assert.equal(res.status, 200);
      assert.equal(res.body.stockData.stock, "AAPL");
      assert.equal(typeof res.body.stockData.likes, "number");
    });
  });
  // 🧪 Test 3: Like same stock again
  describe("GET /api/stock-prices?stock=AAPL&like=true again", () => {
    it("should not increase likes again", async () => {
      const res1 = await chai
        .request(server)
        .get("/api/stock-prices?stock=AAPL&like=true");
      const res2 = await chai
        .request(server)
        .get("/api/stock-prices?stock=AAPL&like=true");
      assert.equal(res1.body.stockData.likes, res2.body.stockData.likes);
    });
  });
  // 🧪 Test 4: View two stocks
  describe("GET /api/stock-prices?stock=AAPL&stock=GOOG", () => {
    it("should return data for two stocks", async () => {
      const res = await chai
        .request(server)
        .get("/api/stock-prices?stock=AAPL&stock=GOOG");
      assert.equal(res.status, 200);
      assert.equal(res.body.stockData.length, 2);
      assert.equal(typeof res.body.stockData[0].rel_likes, "number");
      assert.equal(typeof res.body.stockData[1].rel_likes, "number");
    });
  });

  // 🧪 Test 5: View + like two stocks
  describe("GET /api/stock-prices?stock=AAPL&stock=GOOG&like=true", () => {
    it("should like both stocks", async () => {
      const res = await chai
        .request(server)
        .get("/api/stock-prices?stock=AAPL&stock=GOOG&like=true");
      assert.equal(res.status, 200);
      assert.equal(res.body.stockData.length, 2);
      assert.equal(typeof res.body.stockData[0].rel_likes, "number");
      assert.equal(typeof res.body.stockData[1].rel_likes, "number");
    });
  });
});
