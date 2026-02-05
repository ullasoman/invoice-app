import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calculator } from "lucide-react";

export default function EstimateSummary({ subtotal }: { subtotal: number }) {
  return (
    <div>
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 backdrop-blur-sm sticky top-24">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Calculator className="w-5 h-5 mr-3 text-orange-600" />
            Estimate Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Subtotal</span>
            <span className="font-medium">AED {subtotal.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-xl text-slate-900 dark:text-slate-100">
            <span>Grand Total</span>
            <span className="text-blue-600 dark:text-blue-400">
              AED {subtotal.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
