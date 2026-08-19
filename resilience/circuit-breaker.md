# Circuit Breaker State Machine

## 1. States & Parameters
* **Closed State**: Normal operation. Requests flow through. If failures exceed the failure threshold within a rolling window, the circuit trips to **Open**.
* **Open State**: Requests fail fast without calling the downstream system for a designated duration (open duration, e.g., 30 seconds). After the timer expires, it transitions to **Half-Open**.
* **Half-Open State**: A limited number of probe requests are allowed through. If successful up to the success threshold, the circuit returns to **Closed**. If any probe fails, it returns to **Open**.

## 2. Configuration Parameters
* **Failure Threshold**: 50% error rate over 20 consecutive requests.
* **Open Duration**: 30 seconds before probing.
* **Half-Open Probe Limit**: 5 test requests.
* **Success Threshold**: 3 consecutive successes required to close the circuit.