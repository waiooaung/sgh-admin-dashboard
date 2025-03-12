import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  JapaneseYenIcon,
  DollarSign,
  CheckCircle,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
const SupplierOverview = () => {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium truncate">
            Total Exchanged (RMB)
          </CardTitle>
          <JapaneseYenIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Link href="/transactions?date=25-02-2025">
            <div className="text-2xl font-bold text-green-500 truncate">
              ¥ {new Intl.NumberFormat("en-US").format(15800000)}
            </div>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium truncate">
            Total Exchanged (USD)
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Link href="/transactions">
            <div className="text-2xl font-bold text-blue-500 truncate">
              $ {new Intl.NumberFormat("en-US").format(2076215.50591)}
            </div>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium truncate">
            Paid Amount (USD)
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Link href="/transactions">
            <div className="text-2xl font-bold text-amber-500 truncate">
              $ {new Intl.NumberFormat("en-US").format(2000000.35)}
            </div>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium truncate">
            Amount to Pay (USD)
          </CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Link href="/transactions">
            <div className="text-2xl font-bold text-red-500 truncate">
              $ {new Intl.NumberFormat("en-US").format(76215.15591)}
            </div>
          </Link>
        </CardContent>
      </Card>
    </>
  );
};

export default SupplierOverview;
