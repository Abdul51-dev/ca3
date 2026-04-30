import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const { maxCalories, maxPrice, allergens, day } = await req.json();

  const { data: items, error } = await supabase
    .from('canteen_items')
    .select('*')
    .eq('day', day);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const filtered = items.filter((item: any) => {
    if (item.calories > maxCalories) return false;
    if (item.price > maxPrice) return false;
    if (allergens.length > 0) {
      const hasAllergen = allergens.some((a: string) => item.allergens.includes(a));
      if (hasAllergen) return false;
    }
    return true;
  });

  const scored = filtered.map((item: any) => {
    const ratingScore     = (item.avg_rating / 5) * 40;
    const popularityScore = Math.min(item.popularity_score / 500, 1) * 30;
    const healthScore     = (item.healthiness / 10) * 20;
    const priceScore      = (1 - item.price / maxPrice) * 10;
    const totalScore      = ratingScore + popularityScore + healthScore + priceScore;
    return { ...item, score: Math.round(totalScore * 10) / 10 };
  });

  const top3 = scored.sort((a: any, b: any) => b.score - a.score).slice(0, 3);

  return NextResponse.json({ recommendations: top3 });
}
