import { Left } from "./Left";
import { Right2 } from "./Right2";

export function Columns() {
  return (
    <div className="self-stretch shrink-0 flex items-start gap-6">
      <Left />
      <Right2 />
    </div>
  );
}
