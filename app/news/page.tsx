import TopNav from "../components/menu/top-nav";
import NewsTable from "../components/news/news-table";
import PageLayout from "../layout/page-layout";

export default function Page() {
    return (
        <PageLayout
            header={<TopNav />}>
            <NewsTable />
        </PageLayout>
    )
}