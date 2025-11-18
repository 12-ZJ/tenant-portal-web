import TopNav from "@/app/components/menu/top-nav";
import RequestAccessForm from "@/app/components/request-access/request-access-form";
import PageLayout from "@/app/layout/page-layout";

export default async function Page() {
    return (
        <PageLayout>
            <RequestAccessForm id={0} isSubmit={true} />
        </PageLayout>
    )
}