import TopNav from "@/app/components/menu/top-nav";
import RequestAccessForm from "@/app/components/request-access/request-access-form";
import PageLayout from "@/app/layout/page-layout";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;

    return (
        <PageLayout
            header={<TopNav />}>
            <RequestAccessForm id={Number(id)} isSubmit={false} />
        </PageLayout>
    )
}