import { notFound } from "next/navigation";
import { getPage } from "@/app/create/actions";
import EditPageClient from "../../../components/edit-client";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const page = await getPage(id);

    if (!page) {
        notFound();
    }

    return <EditPageClient page={page} />;
}
