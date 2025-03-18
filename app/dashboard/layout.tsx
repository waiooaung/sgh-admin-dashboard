import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { PageContainer } from "@/components/page-container";
import React from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar className="overflow-y-auto" />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-2 md:px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-2 md:px-4 h-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <AppBreadcrumb />
            </div>
          </header>
          <PageContainer>{children}</PageContainer>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
