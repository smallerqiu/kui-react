import { ArrowLeft, Plus, Search } from "kui-icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Input,
  ListPanel,
  PageHeader,
  Table,
  Tag,
} from "react-kui";

const columns = [
  { title: "Name", key: "name" },
  { title: "Role", key: "role" },
  { title: "Status", key: "status" },
];
const data = [
  { key: 1, name: "Alex", role: "Owner", status: "Active" },
  { key: 2, name: "Mia", role: "Designer", status: "Active" },
  { key: 3, name: "Leo", role: "Developer", status: "Invited" },
];

export default function App() {
  return (
    <>
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
      />

      <ListPanel
        summary="3 members"
        filters={<Input icon={Search} placeholder="Search members" style={{ width: 220 }} />}
        actions={<Button icon={Plus}>Add member</Button>}
      >
        <Table columns={columns} data={data} />
      </ListPanel>
    </>
  );
}
