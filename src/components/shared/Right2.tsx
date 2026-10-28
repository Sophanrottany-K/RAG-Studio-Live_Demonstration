import { ChannelPublicLink } from "./ChannelPublicLink";
import { ConfigurationSummary } from "./ConfigurationSummary";
import { DangerZone } from "./DangerZone";

export function Right2() {
  return (
    <div className="w-100 shrink-0 flex flex-col items-start gap-6">
      <div className="self-stretch shrink-0 bg-bg-card border border-border-default rounded-[20px] flex flex-col items-start gap-3 p-5">
        <div className="self-stretch shrink-0 flex justify-between items-center">
          <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[18px] leading-[28px] text-ink-primary">{"Channels · 3 of 3 connected"}</div>
          <div className="shrink-0 rounded-[6px] flex items-center gap-1 px-2 py-1">
            <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">{"Manage"}</div>
            <img className="w-3.5 h-3.5 shrink-0" src="icons/icon-arrow-right.svg" alt="" />
          </div>
        </div>
        <ChannelPublicLink />
      </div>
      <ConfigurationSummary />
      <DangerZone />
    </div>
  );
}
