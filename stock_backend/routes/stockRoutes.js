import express from "express";
import YahooFinance from "yahoo-finance2";
const router = express.Router();
/* ================= YAHOO CONFIG ================= */
const yahooFinance = new YahooFinance({
suppressNotices: [
"yahooSurvey",
"ripHistorical",
],
queue: {
concurrency: 1,
},
});
/* ================= QUOTE ================= */
router.get("/stock/:ticker", async (req, res) => {
try {
const ticker =  req.params.ticker.toUpperCase();// SMALL DELAY TO AVOID 429await new Promise((resolve) =>  setTimeout(resolve, 500));const data =  await yahooFinance.quote(ticker);res.json({  symbol: data.symbol,  c:    data.regularMarketPrice || 0,  h:    data.regularMarketDayHigh || 0,  l:    data.regularMarketDayLow || 0,  o:    data.regularMarketOpen || 0,  pc:    data.regularMarketPreviousClose || 0,  dp:    data.regularMarketPreviousClose      ? (          ((data.regularMarketPrice -            data.regularMarketPreviousClose) /            data.regularMarketPreviousClose) *          100        ).toFixed(2)      : 0,});
} catch (error) {
console.error(  "QUOTE ERROR:",  error);res.status(500).json({  error:    error.message ||    "Stock fetch failed",});
}
});
/* ================= HISTORY ================= */
router.get("/history/:ticker", async (req, res) => {
try {
const ticker =  req.params.ticker.toUpperCase();// SMALL DELAY TO AVOID 429await new Promise((resolve) =>  setTimeout(resolve, 500));const result =  await yahooFinance.chart(    ticker,    {      interval: "1d",      range: "1mo",    }  );const quotes =  result.quotes || [];res.json({  s: "ok",  t: quotes.map((item) =>    Math.floor(      new Date(item.date).getTime() /        1000    )  ),  c: quotes.map(    (item) => item.close || 0  ),});
} catch (error) {
console.error(  "HISTORY ERROR:",  error);res.status(500).json({  s: "error",  error:    error.message ||    "History fetch failed",});
}
});
export default router;
