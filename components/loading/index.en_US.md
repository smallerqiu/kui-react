# Loading

Progress loading.

## When to Use

- Display progress during asynchronous requests.

## Examples

Simulate route loading

```js
// # router.js
import loading from "react-kui/components/loading";

async function loadData() {
  loading.start();
  try {
    await fetch("/api/data");
  } finally {
    loading.finish();
  }
}
```

If you are using `axios`.

```js
import axios from "axios";
import loading from "react-kui/components/loading";

const axiosInstance = axios.create({
  baseURL: "/api", // Your API address
  timeout: 10000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    loading.start();
    return config;
  },
  (error) => {
    loading.finish();
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    loading.finish();
    return response;
  },
  (error) => {
    loading.finish();
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

## Examples

[Basic Usage](./demo/basic.tsx)

- The simplest usage.

## Loading API

| Property | Description              | Type                    | Default |
| -------- | ------------------------ | ----------------------- | ------- |
| start    | Start loading            | () => void              | -       |
| finish   | Finish loading           | () => void              | -       |
| error    | Loading error            | () => void              | -       |
| update   | Manually update progress | (percent:number)=> void | -       |
| destroy  | Destroy loading       | () => void              | -       |
