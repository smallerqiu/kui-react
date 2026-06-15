import ReactDOM from "react-dom";
import "./assets/theme.jpg";

import App from "./app";

ReactDOM.render(<App />, document.getElementById("app"));

import "./assets/index.less";

var _hmt = _hmt || [],
  host = window.location.hostname;
if (host != "localhost" && host != "127.0.0.1") {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?2cd83ff4bed8ca08c9962d0c458d8e16";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
}
