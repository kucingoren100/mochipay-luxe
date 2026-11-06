import StandaloneWidgetView from "@/components/widgets/StandaloneWidgetView";

export default async function StandaloneWidgetPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  return <StandaloneWidgetView type={type} />;
}
