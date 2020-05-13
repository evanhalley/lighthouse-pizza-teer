# lighthouse-pizza-teer

This is sample code on how to use Puppeteer alongside Lighthouse to run analysis on webpages behind an authentication wall.  See the walkthrough at [https://evanhalley.dev/post/lighthouse-pizza-teer](https://evanhalley.dev/post/lighthouse-pizza-teer).

## Setup

1. Create an account at [https://salviospizza.hungerrush.com/](https://salviospizza.hungerrush.com/)
2. Run `npm i` to download the dependencies.
3. Create a file in the root of this repo called `.env` with the following format.

```
USERNAME=your@email.com
PASSWORD=your-password
```

4. Run the script by typing `node .`.
5. Two reports will be generated `report.html` and `report.json`.

If you are local to the Raleigh area, go ahead and order a Pizza and enjoy! 🍕
