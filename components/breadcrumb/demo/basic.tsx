import { Breadcrumb, BreadcrumbItem } from "react-kui";
export default function Basic() {
  return (
    <>
      <p>use href</p>
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/components/breadcrumb">Breadcrumb</BreadcrumbItem>
        <BreadcrumbItem>Other</BreadcrumbItem>
      </Breadcrumb>
      <p>use anchor child</p>
      <Breadcrumb>
        <BreadcrumbItem>
          <a href="/">Home</a>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <a href="/components/breadcrumb">Breadcrumb</a>
        </BreadcrumbItem>
        <BreadcrumbItem>Other</BreadcrumbItem>
      </Breadcrumb>
    </>
  );
}
