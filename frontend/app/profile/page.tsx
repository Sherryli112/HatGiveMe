import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Package, Settings, LogOut } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-5xl mx-auto grid md:grid-cols-[300px_1fr] gap-8">

        {/* Sidebar / User Card */}
        <aside>
          <Card className="sticky top-24 border-t-8 border-t-primary shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="w-24 h-24 bg-primary mx-auto rounded-full flex items-center justify-center text-4xl mb-4 text-white font-bold border-4 border-white shadow-md">
                P
              </div>
              <CardTitle className="text-xl">派大星</CardTitle>
              <CardDescription>patrick@bikini.bottom</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 pt-6">
              <Button variant="ghost" className="w-full justify-start font-bold bg-secondary/20 text-secondary-dark">
                <User className="mr-2 h-4 w-4" /> 我的公民證
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" /> 訂單紀錄
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" /> 帳號設定
              </Button>
              <div className="pt-4 mt-4 border-t">
                <Button variant="destructive" className="w-full justify-start">
                  <LogOut className="mr-2 h-4 w-4" /> 登出
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>個人資料</CardTitle>
              <CardDescription>管理你的比基尼海灘公民資訊</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">暱稱</label>
                <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" defaultValue="派大星" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Email (不可修改)</label>
                <input type="email" disabled className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm opacity-50" defaultValue="patrick@bikini.bottom" />
              </div>
              <div className="flex justify-end">
                <Button>儲存修改</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>歷史訂單</CardTitle>
              <CardDescription>你過去買的所有酷東西</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2].map((order) => (
                  <div key={order} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-bold">訂單 #202401{order}</p>
                      <p className="text-sm text-gray-500">2024-01-20 • 已付款</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">$ 1,200</p>
                      <Button variant="link" className="text-sm h-auto p-0 text-gray-500">查看詳情</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
