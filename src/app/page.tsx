import Map from "@/components/Map";
import { SearchBar } from "@/components/SearchBar";

export default function Home() {
  return (
    <div className="relative h-dvh w-full overflow-hidden bg-black">
      <Map />
      <div className="pointer-events-none absolute inset-0 flex flex-col p-4 sm:p-6">
        <div className="pointer-events-auto mx-auto w-full max-w-xl">
          <SearchBar />
        </div>
      </div>
    </div>
  );
}
