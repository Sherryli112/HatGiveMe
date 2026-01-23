import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Heart } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          {/* Logo Placeholder */}
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">H</div>
          <span className="text-xl font-bold text-primary">HatGiveMe</span>
        </Link>
        <div className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/store" className="transition-colors hover:text-primary">帽子派對</Link>
          <Link href="/contact" className="transition-colors hover:text-primary">傳紙條給我</Link>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button asChild variant="default" className="rounded-full bg-primary hover:bg-primary/90">
            <Link href="/login">加入我們</Link>
          </Button>
          {/* Authenticated State Placeholder (Commented out)
           <Button variant="ghost" size="icon" className="rounded-full overflow-hidden border-2 border-primary">
              <img src="/placeholder-avatar.jpg" alt="User" />
           </Button>
           */}
        </div>
      </div>
    </nav>
  );
}
