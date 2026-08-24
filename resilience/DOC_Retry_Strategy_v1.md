# Retry Strategy Specification

## 1. Exponential Backoff Formula with Jitter
To prevent thundering herd problems and downstream system congestion during outages, we implement an exponential backoff formula with full jitter:

$$wait = \min(cap, \text{random}(base, base \times 2^{attempt}))$$

* **Base**: Initial wait time (e.g., 1000ms = 1 second)
* **Cap**: Maximum wait time ceiling (e.g., 60000ms = 60 seconds)
* **Attempt**: Current retry iteration index (1-based)
* **Jitter**: Randomization factor between the base and exponential ceiling to decorrelate concurrent retries.