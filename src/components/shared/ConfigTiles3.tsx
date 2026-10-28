import { TileChannels2 } from "./TileChannels2";
import { TileKnowledgeBase } from "./TileKnowledgeBase";
import { TileLanguage } from "./TileLanguage";
import { TilePrimaryModel2 } from "./TilePrimaryModel2";
import { TileTone } from "./TileTone";

export function ConfigTiles3() {
  return (
    <div className="self-stretch shrink-0 flex items-start gap-3">
      <TilePrimaryModel2 />
      <TileLanguage />
      <TileTone />
      <TileKnowledgeBase />
      <TileChannels2 />
    </div>
  );
}
