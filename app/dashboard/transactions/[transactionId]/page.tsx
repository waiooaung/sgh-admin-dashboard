import TransactionDetailContainer from "@/components/containers/transaction/detail";

export default async function Page({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) {
  const { transactionId } = await params;
  return <TransactionDetailContainer transactionId={transactionId} />;
}
