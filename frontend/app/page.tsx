import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Star, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-primary pt-20 pb-16 px-4 text-center rounded-b-[3rem] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/SpongeBob_SquarePants_character.svg/1200px-SpongeBob_SquarePants_character.svg.png')] bg-repeat space-x-4"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-md">
            帽子給我好嗎？
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 font-medium">
            派大星的精選帽帽店，每一頂都充滿智慧（大概吧）！
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-8 rounded-full shadow-xl transition-transform hover:scale-105">
              <ShoppingBag className="mr-2 h-5 w-5" />
              開始逛街
            </Button>
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100 text-lg px-8 rounded-full shadow-xl transition-transform hover:scale-105">
              傳紙條給我
            </Button>
          </div>
        </div>
      </section>

      {/* Hot Categories */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-primary mb-12 flex items-center justify-center gap-2">
            <TrendingUp className="h-8 w-8" />
            熱門分類
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['派對專用', '睡覺戴的', '裝聰明系列', '海灘時尚'].map((cat, i) => (
              <div key={i} className="flex flex-col items-center group cursor-pointer">
                <div className="w-32 h-32 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors border-4 border-transparent group-hover:border-accent">
                  <span className="text-4xl">🎩</span>
                </div>
                <h3 className="text-xl font-bold text-gray-700 group-hover:text-accent transition-colors">{cat}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-white rounded-t-[3rem]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">派大星精選</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} className="overflow-hidden border-2 border-transparent hover:border-primary transition-all hover:shadow-2xl group">
                <div className="h-64 bg-gray-100 relative group-hover:scale-105 transition-transform duration-500">
                  {/* Placeholder Image */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">商品圖片 COMING SOON</div>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800">超酷炫帽子 #{item}</h3>
                    <span className="bg-secondary text-secondary-foreground text-xs font-bold px-2 py-1 rounded-full">HOT</span>
                  </div>
                  <p className="text-gray-500 mb-4 line-clamp-2">這是一頂非常神奇的帽子，戴上它你就會感覺像派大星一樣...</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">$ 599</span>
                    <Button className="rounded-full bg-primary hover:bg-primary/90">
                      加入購物車
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full">
              查看全部商品
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-accent/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary mb-12">大家怎麼說</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm transform rotate-1">
              <p className="text-gray-600 italic mb-4">"自從買了這頂帽子，我連美乃滋是不是樂器都搞清楚了！"</p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-10 h-10 bg-yellow-400 rounded-full"></div>
                <div className="text-left">
                  <p className="font-bold text-sm">海綿寶寶</p>
                  <div className="flex text-yellow-500"><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /></div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm transform -rotate-1">
              <p className="text-gray-600 italic mb-4">"這帽子品質不錯，但我還是比較喜歡錢。"</p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-10 h-10 bg-red-400 rounded-full"></div>
                <div className="text-left">
                  <p className="font-bold text-sm">蟹老闆</p>
                  <div className="flex text-yellow-500"><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
