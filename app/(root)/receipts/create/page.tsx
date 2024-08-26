import { BillForm } from "@/components/receipts/forms/bill-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  return (
    <Tabs defaultValue="bill" className="w-full">
      <TabsList className="flex w-[600px]">
        <TabsTrigger value="bill">Factura</TabsTrigger>
        <TabsTrigger value="credit_note">Nota de crédito</TabsTrigger>
        <TabsTrigger value="debit_note">Nota de débito</TabsTrigger>
      </TabsList>
      <BillForm />
      <TabsContent value="credit_note">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
