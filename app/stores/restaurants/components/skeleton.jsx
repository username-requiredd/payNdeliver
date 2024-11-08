import ShopCardSkeleton from "@/components/loaders/shopCardskeleton";
export default function ShopCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <ShopCardSkeleton key={index} />
      ))}
    </div>
  );
}
