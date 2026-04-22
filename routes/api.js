'use strict';

module.exports = function (app) {
  const https = require('https');
  const likesByStock = new Map();

  const getClientIp = (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.length > 0) {
      return forwarded.split(',')[0].trim();
    }
    return req.ip || req.connection.remoteAddress || 'unknown-ip';
  };

  const getLikeSet = (stock) => {
    if (!likesByStock.has(stock)) {
      likesByStock.set(stock, new Set());
    }
    return likesByStock.get(stock);
  };

  const fetchStockQuote = (stock) =>
    new Promise((resolve, reject) => {
      const url =
        'https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/' +
        encodeURIComponent(stock) +
        '/quote';

      https
        .get(url, (response) => {
          let body = '';

          response.on('data', (chunk) => {
            body += chunk;
          });

          response.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              if (typeof parsed.latestPrice !== 'number') {
                return reject(new Error('Invalid stock response'));
              }
              resolve({
                stock: String(parsed.symbol || stock).toUpperCase(),
                price: parsed.latestPrice
              });
            } catch (error) {
              reject(error);
            }
          });
        })
        .on('error', reject);
    });

  app.route('/api/stock-prices')
    .get(async function (req, res) {
      try {
        const stockQuery = req.query.stock;
        const like = req.query.like === 'true' || req.query.like === true;

        if (!stockQuery) {
          return res.status(400).json({ error: 'stock query is required' });
        }

        const symbols = (Array.isArray(stockQuery) ? stockQuery : [stockQuery])
          .map((symbol) => String(symbol).toUpperCase())
          .slice(0, 2);

        const clientIp = getClientIp(req);
        const stockData = await Promise.all(
          symbols.map(async (symbol) => {
            const quote = await fetchStockQuote(symbol);
            const likeSet = getLikeSet(quote.stock);

            if (like) {
              likeSet.add(clientIp);
            }

            return {
              stock: quote.stock,
              price: quote.price,
              likes: likeSet.size
            };
          })
        );

        if (stockData.length === 1) {
          return res.json({ stockData: stockData[0] });
        }

        return res.json({
          stockData: [
            {
              stock: stockData[0].stock,
              price: stockData[0].price,
              rel_likes: stockData[0].likes - stockData[1].likes
            },
            {
              stock: stockData[1].stock,
              price: stockData[1].price,
              rel_likes: stockData[1].likes - stockData[0].likes
            }
          ]
        });
      } catch (error) {
        return res.status(500).json({ error: 'Unable to fetch stock data' });
      }
    });
};
