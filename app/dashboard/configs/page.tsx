"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function Page() {
  const handleSave = () => {
    console.log("Settings saved!");
  };

  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <p className="text-lg font-semibold tracking-tight">Configs</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Manual Exchange Rate Card */}
        <Card>
          <CardHeader>
            <CardTitle>Manual Exchange Rate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>Base Currency</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Base Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Target Currency</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Target Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Buy Rate (Agent)</Label>
                <Input type="number" placeholder="Enter rate" />
              </div>
              <div>
                <Label>Sell Rate (Agent)</Label>
                <Input type="number" placeholder="Enter rate" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Buy Rate (Client)</Label>
                <Input type="number" placeholder="Enter rate" />
              </div>
              <div>
                <Label>Sell Rate (Client)</Label>
                <Input type="number" placeholder="Enter rate" />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="auto-update" />
              <Label htmlFor="auto-update">Auto Update</Label>
            </div>

            {/* Save Button */}
            <div className="mt-4 flex justify-end">
              <Button onClick={handleSave}>Save</Button>
            </div>
          </CardContent>
        </Card>

        {/* Commission Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Commission Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>Commission Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Agent Commission (%)</Label>
                <Input type="number" placeholder="Enter %" />
              </div>
              <div>
                <Label>Client Commission (%)</Label>
                <Input type="number" placeholder="Enter %" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Min Commission</Label>
                <Input type="number" placeholder="Enter Min" />
              </div>
              <div>
                <Label>Max Commission</Label>
                <Input type="number" placeholder="Enter Max" />
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-4 flex justify-end">
              <Button onClick={handleSave}>Save</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
