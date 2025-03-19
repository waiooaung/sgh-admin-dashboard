import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Link2Icon, Globe } from "lucide-react";

interface BusinessCardProps {
  name: string;
  title: string;
  email: string;
  phone: string;
  linkedin?: string;
  website?: string;
  avatarUrl?: string;
}

export function BusinessCard({
  name,
  title,
  email,
  phone,
  linkedin,
  website,
  avatarUrl,
}: BusinessCardProps) {
  return (
    <Card className="w-[320px] shadow-lg border border-gray-200 rounded-xl p-4">
      <CardHeader className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg">{name}</CardTitle>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </CardHeader>
      <CardContent className="mt-4 space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary" />
          <span>{email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-primary" />
          <span>{phone}</span>
        </div>
        {linkedin && (
          <div className="flex items-center gap-2">
            <Link2Icon className="h-4 w-4 text-primary" />
            <a
              href={linkedin}
              target="_blank"
              className="text-blue-500 hover:underline"
            >
              LinkedIn
            </a>
          </div>
        )}
        {website && (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <a
              href={website}
              target="_blank"
              className="text-blue-500 hover:underline"
            >
              Website
            </a>
          </div>
        )}
        <Button className="mt-4 w-full">Contact</Button>
      </CardContent>
    </Card>
  );
}
