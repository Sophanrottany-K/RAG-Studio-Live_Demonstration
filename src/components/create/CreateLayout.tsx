import type { ReactNode } from "react";
import { Breadcrumb6 } from "../shared/Breadcrumb6";
import { Header9 } from "../shared/Header9";
import { Sidebar2 } from "../shared/Sidebar2";
import { CreateStepper } from "./CreateStepper";

/** Page frame shared by every Create chatbot screen: sidebar, header, stepper, form + aside. */
export function CreateLayout({
  step,
  aside,
  children,
  overlay,
}: {
  step: 1 | 2 | 3 | 4;
  aside: ReactNode;
  children: ReactNode;
  overlay?: ReactNode;
}) {
  return (
    <div className="relative w-full h-full bg-bg-card overflow-hidden flex items-start">
      <Sidebar2 />
      <div className="flex-1 min-w-0 self-stretch bg-bg-page overflow-hidden flex flex-col items-start">
        <Header9 />
        <div className="self-stretch flex-1 min-h-0 overflow-y-auto flex flex-col items-start gap-6 pt-7 pr-10 pb-10 pl-10">
          <Breadcrumb6 />
          <CreateStepper current={step} />
          <div className="self-stretch shrink-0 flex items-start gap-6">
            <div className="flex-1 min-w-0 bg-bg-card border border-border-default rounded-[20px] flex flex-col items-start gap-6 p-8">
              {children}
            </div>
            <aside className="w-95 shrink-0 sticky top-0 flex flex-col items-start gap-5">{aside}</aside>
          </div>
        </div>
      </div>
      {overlay}
    </div>
  );
}

export function StepHeading({ title, subtitle }: { title: string; subtitle: ReactNode }) {
  return (
    <div className="self-stretch shrink-0 flex flex-col items-start gap-1.5">
      <h1 className="font-gabarito font-bold text-[24px] leading-[28px] text-ink-primary">{title}</h1>
      <div className="self-stretch font-gabarito text-[14px] leading-[20px] text-ink-secondary">{subtitle}</div>
    </div>
  );
}

export function StepFooter({ children }: { children: ReactNode }) {
  return (
    <div className="self-stretch shrink-0 border-t border-border-default flex items-center gap-2.5 pt-5">
      {children}
    </div>
  );
}
