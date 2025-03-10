"use client";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "./ui/breadcrumb";
import { usePathname } from "next/navigation";
import React from "react";
import Link from "next/link";

export function AppBreadcrumb() {
  const pathname = usePathname();

  const pathSegments = pathname?.split("/").filter((segment) => segment);

  return (
    <nav aria-label="breadcrumb" className="text-sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <Link href="/">Home</Link>
          </BreadcrumbItem>
          {pathSegments?.map((segment, index) => {
            const path = "/" + pathSegments.slice(0, index + 1).join("/");

            const capitalizedSegment = decodeURIComponent(
              segment.replaceAll("-", " "),
            ).replace(/^(.)/, (match) => match.toUpperCase());

            return (
              <React.Fragment key={path}>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <Link href={path}>
                    <BreadcrumbPage>{capitalizedSegment}</BreadcrumbPage>
                  </Link>
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </nav>
  );
}
