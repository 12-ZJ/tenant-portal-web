import TopNav from "../components/menu/top-nav";
import RequestAccessTable from "../components/request-access/request-access-table";
import PageLayout from "../layout/page-layout";

export default function Page() {
    return (
        <PageLayout
            header={<TopNav />}>
            <RequestAccessTable />
        </PageLayout>
    )
}