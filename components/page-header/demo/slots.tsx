import { ArrowLeft } from "kui-icons";
import { Alert, Breadcrumb, BreadcrumbItem, Button, PageHeader, Tag } from "react-kui";

export default function App() {
  return (
    <PageHeader
      breadcrumb={
        <Breadcrumb>
          <BreadcrumbItem>Projects</BreadcrumbItem>
          <BreadcrumbItem>Detail</BreadcrumbItem>
        </Breadcrumb>
      }
      back={<Button icon={ArrowLeft} shape="circle" />}
      title={
        <>
          <span>Design system </span>
          <Tag color="blue">Active</Tag>
        </>
      }
      description="Shared foundations and reusable components."
      actions={<Button type="primary">Edit project</Button>}
    >
      <Alert description="The next release is scheduled for Friday." showIcon />
    </PageHeader>
  );
}
