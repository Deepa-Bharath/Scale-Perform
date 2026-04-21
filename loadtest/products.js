import http from "k6/http";
import { sleep } from "k6";

export let options = {
  stages: [
    { duration: '30s', target: 50 },  // Level 1: Can we handle 1k?
    { duration: '1m', target: 100 }, // Level 2: The real pressure
    { duration: '1m', target: 200 }, // Level 3: The "Scale-Perform" limit
  ]
};

export default function () {
  http.get("http://localhost:5000/api/products?lastSeenId=69bbf40e33860144df4ef255&category=personal-care&price=asc&lastPrice=101");
  sleep(1);
}
