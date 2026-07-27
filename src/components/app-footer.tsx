export default function AppFooter() {
  return (
    <footer className="footer">
      <span>©{new Date().getFullYear()} KUI. All rights reserved.</span>
      <a href="https://beian.miit.gov.cn" target="_blank" className="beian" rel="noreferrer">
        粤ICP备17111365号-2
      </a>
      <span>
        Designed &amp; Developed with love by{" "}
        <a href="https://chuchur.com" target="_blank" className="author" rel="noreferrer">
          Qiu
        </a>
      </span>
    </footer>
  );
}
