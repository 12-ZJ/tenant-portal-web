import TopNav from "@/app/components/menu/top-nav";
import NewsForm from "@/app/components/news/news-form";
import PageLayout from "@/app/layout/page-layout";

export default function Page() {
    return (
        <PageLayout
            header={<TopNav />}>
            <NewsForm />
        </PageLayout>
    )
}