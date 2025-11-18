import RequestAccessStatus from "@/app/components/request-access/request-accesss-status";
import FullScreenLayout from "@/app/layout/full-layout";

export default async function Page() {
    return (
        <FullScreenLayout>
            <RequestAccessStatus />
        </FullScreenLayout>
    )
}