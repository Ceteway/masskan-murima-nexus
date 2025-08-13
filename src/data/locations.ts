export type TownInfo = {
  name: string;
  image: string; // Representative image URL for the town
};

export type CountyLocations = Record<string, TownInfo[]>;

// Counties and towns with curated Unsplash images
export const locationData: CountyLocations = {
  Nairobi: [
    { name: "Nairobi City", image: "https://images.unsplash.com/photo-1562088287-bde35a1ea917?w=1200&auto=format&fit=crop" },
    { name: "Westlands", image: "https://images.unsplash.com/photo-1533514114760-4389f572ae99?w=1200&auto=format&fit=crop" },
    { name: "Kilimani", image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&auto=format&fit=crop" },
    { name: "Karen", image: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&auto=format&fit=crop" },
    { name: "Kileleshwa", image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&auto=format&fit=crop" },
  ],
  Embu: [
    { name: "Embu Town", image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&auto=format&fit=crop" },
    { name: "Runyenjes", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop" },
    { name: "Kithimu", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop" },
  ],
  "Tharaka-Nithi": [
    { name: "Chogoria", image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&auto=format&fit=crop" },
    { name: "Chuka", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop" },
  ],
  Meru: [
    { name: "Meru Town", image: "https://images.unsplash.com/photo-1582582621959-48d5024f00c5?w=1200&auto=format&fit=crop" },
    { name: "Nkubu", image: "https://images.unsplash.com/photo-1544986581-efac024faf62?w=1200&auto=format&fit=crop" },
  ],
  Kirinyaga: [
    { name: "Kerugoya", image: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=1200&auto=format&fit=crop" },
    { name: "Kutus", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop" },
    { name: "Wang’uru (Mwea)", image: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=1200&auto=format&fit=crop" },
  ],
  Nyeri: [
    { name: "Nyeri Town", image: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=1200&auto=format&fit=crop" },
    { name: "Kiganjo", image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1200&auto=format&fit=crop" },
  ],
  Laikipia: [
    { name: "Nanyuki", image: "https://images.unsplash.com/photo-1529165981561-8c5ae80d40a5?w=1200&auto=format&fit=crop" },
    { name: "Nyahururu", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&auto=format&fit=crop" },
  ],
  "Murang’a": [
    { name: "Murang’a Town", image: "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?w=1200&auto=format&fit=crop" },
    { name: "Maragua", image: "https://images.unsplash.com/photo-1455906876003-298dd8c44ec8?w=1200&auto=format&fit=crop" },
    { name: "Kangema", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop" },
    { name: "Kiriaini", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&auto=format&fit=crop" },
    { name: "Gatura", image: "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?w=1200&auto=format&fit=crop" },
    { name: "Kenol", image: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=1200&auto=format&fit=crop" },
    { name: "Kandara", image: "https://images.unsplash.com/photo-1496449903678-68ddcb189a24?w=1200&auto=format&fit=crop" },
  ],
};

export const allCounties = Object.keys(locationData);

export function townsForCounty(county?: string): TownInfo[] {
  if (!county) return Object.values(locationData).flat();
  return locationData[county] ?? [];
}
