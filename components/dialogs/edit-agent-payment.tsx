// "use client";
// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import useSWRMutation from "swr/mutation";
// import axiosInstance from "@/lib/axios-instance";
// import { toast } from "sonner";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import { TextArea } from "@/components/ui/textarea";

// import { AgentPayment, AgentPaymentFormData } from "@/types/agentPayment";

// const formSchema = z.object({
//   paymentDate: z.date(),
//   amountRMB: z.coerce.number(),
//   amountUSD: z.coerce.number(),
//   receivedAmountUSD: z.coerce.number(),
//   amountToReceiveUSD: z.coerce.number(),
//   transactionId: z.coerce.number(),
//   agentId: z.coerce.number(),
//   status: z.string(),
//   paymentType: z.string(),
// });

// interface EditAgentPaymentModalProps {
//   open: boolean;
//   onClose: () => void;
//   agentPayment: AgentPayment;
//   onSave: () => void;
// }

// const EditAgentPayment: React.FC<EditAgentPaymentModalProps> = ({
//   open,
//   onClose,
//   agentPayment,
//   onSave,
// }) => {
//   const [editAgentPayment, setEditAgentPayment] = useState<AgentPayment | null>(
//     agentPayment,
//   );

//   useEffect(() => {
//     if (open && agentPayment) {
//       setEditAgentPayment(agentPayment);
//     }
//   }, [open, agentPayment]);

//   const form = useForm<AgentPaymentFormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       paymentDate: editAgentPayment?.paymentDate
//         ? new Date(editAgentPayment.paymentDate)
//         : undefined,
//       amountRMB: editAgentPayment?.amountRMB || 0,
//       amountUSD: editAgentPayment?.amountUSD || 0,
//       receivedAmountUSD: editAgentPayment?.receivedAmountUSD || 0,
//       amountToReceiveUSD: editAgentPayment?.amountToReceiveUSD || 0,
//       transactionId: editAgentPayment?.transactionId || undefined,
//       agentId: editAgentPayment?.agentId || undefined,
//       status: "PENDING",
//       paymentType: " ",
//     },
//   });

//   const { trigger } = useSWRMutation(
//     `/agent-payments/${editAgentPayment?.id}`,
//     async (url: string, { arg }: { arg: AgentPaymentFormData }) => {
//       return await axiosInstance.put<AgentPayment>(url, arg);
//     },
//   );

//   const handleSubmit = async (values: AgentPaymentFormData) => {
//     try {
//       await trigger(values);
//       toast.success("Transaction updated successfully!");
//       onSave();
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to create transaction!");
//     }
//   };

//   if (!agentPayment) return null;

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[800px] w-full max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>
//             Update Payment for Transaction: #TNX-{agentPayment?.id}
//           </DialogTitle>
//         </DialogHeader>
//         <div className="grid gap-4 md:grid-cols-1">
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(handleSubmit)}
//               className="space-y-4"
//             >
//               {/* Amount USD */}
//               <FormField
//                 control={form.control}
//                 name="amountUSD"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Amount USD</FormLabel>
//                     <FormControl>
//                       <Input {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               {/* Received Amount */}
//               <FormField
//                 control={form.control}
//                 name="receivedAmountUSD"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Received Amount</FormLabel>
//                     <FormControl>
//                       <Input {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               {/* Amount to Received */}
//               <FormField
//                 control={form.control}
//                 name="amountToReceiveUSD"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Remaining Amount</FormLabel>
//                     <FormControl>
//                       <Input {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <DialogFooter>
//                 <Button variant="outline" onClick={onClose}>
//                   Cancel
//                 </Button>
//                 <Button type="submit">Save</Button>
//               </DialogFooter>
//             </form>
//           </Form>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default EditAgentPayment;
