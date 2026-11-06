import Image from "next/image";
import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  /** 편집 화면에서 맨 위에 붙는 도구 줄 */
  toolbar?: ReactNode;
  className?: string;
};

/** 모든 카드의 기본 모양: 둥근 모서리 + 얇은 테두리 + 아주 약한 그림자 + 살짝 떠오르기 */
export function Card({ children, toolbar, className = "" }: CardProps) {
  // 편집 중에는 떠오르기·나타나기 효과를 끔 (입력하다가 카드가 움직이지 않게)
  const hover = toolbar
    ? ""
    : "reveal hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(27,36,64,0.05),0_12px_28px_rgba(47,107,255,0.10)] motion-reduce:hover:translate-y-0";

  return (
    <article
      className={`group relative flex flex-col rounded-2xl border border-line bg-card
        shadow-[0_1px_2px_rgba(27,36,64,0.04),0_4px_16px_rgba(27,36,64,0.04)]
        transition duration-200 motion-reduce:transition-none ${hover}
        break-words ${toolbar ? "" : "overflow-hidden"} ${className}`}
    >
      {toolbar && <div className="overflow-hidden rounded-t-2xl">{toolbar}</div>}
      {children}
    </article>
  );
}

/** 카드 맨 위 사진 (4:3 비율로 잘라서 꽉 채움) */
export function CardImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-[4/3] w-full bg-line/50">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 320px, (min-width: 768px) 50vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}

export function CardBody({ children }: { children: ReactNode }) {
  return <div className="flex flex-1 flex-col gap-2 p-5">{children}</div>;
}
