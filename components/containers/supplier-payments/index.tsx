const SupplierPaymentsContainer = () => {
  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <p className="text-lg font-semibold tracking-tight">
          Supplier Payments
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4"></div>
    </div>
  );
};

export default SupplierPaymentsContainer;
