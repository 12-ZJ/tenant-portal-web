import ManualForm from "../components/manual/manual-form";
import TopNav from "../components/menu/top-nav";
import PageLayout from "../layout/page-layout";

export default function Page() {
    return (
        <PageLayout
            header={<TopNav />}>
            <ManualForm />
        </PageLayout>
    )
}