"use client";

import {
  Settings,
  User,
  Shield,
  Bell,
  Moon,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Button } from "@acme/ui/components/button";
import { Separator } from "@acme/ui/components/separator";
// import { Switch } from "@acme/ui/components/switch";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 pb-16">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </h1>
        </div>

        <div className="p-4 space-y-6">
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">
              Account
            </h2>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Profile Information
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">
              Preferences
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </div>
                {/* <Switch /> */}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  <span>Dark Mode</span>
                </div>
                {/* <Switch /> */}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">
              Support
            </h2>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help Center
              </Button>
            </div>
          </div>

          <Separator />

          <Button variant="destructive" className="w-full">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
