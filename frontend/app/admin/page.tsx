import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users, BarChart3 } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 hidden md:block">
        <h2 className="text-2xl font-bold text-primary mb-8">後台管理</h2>
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start text-primary font-bold bg-primary/10">
            <BarChart3 className="mr-2 h-4 w-4" /> 儀表板
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Package className="mr-2 h-4 w-4" /> 商品管理
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <ShoppingCart className="mr-2 h-4 w-4" /> 訂單管理
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Users className="mr-2 h-4 w-4" /> 會員管理
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">儀表板</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Admin User</span>
            <div className="w-8 h-8 bg-primary rounded-full"></div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          {[
            { label: "總營收", value: "$12,345", icon: BarChart3, color: "text-green-600" },
            { label: "總訂單", value: "+573", icon: ShoppingCart, color: "text-blue-600" },
            { label: "商品數", value: "104", icon: Package, color: "text-orange-600" },
            { label: "活躍會員", value: "2,350", icon: Users, color: "text-purple-600" },
          ].map((stat, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% 與上月相比
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Placeholder for Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>最近訂單</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-400">
              目前沒有新訂單... 大家都去抓水母了嗎？
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
