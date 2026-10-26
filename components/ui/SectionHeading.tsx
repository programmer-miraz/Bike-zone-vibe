type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}: Props) {
  const alignment =
    align === "center" ? "items-center text-center mx-auto" : "items-start text-left";

  return (
    <header className={`flex flex-col gap-4 ${alignment} ${className}`}>
      <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-light">
        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
        {eyebrow}
      </span>

      <h2 className="max-w-2xl text-3xl font-black uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>

      {description ? (
        <p className="max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
          {description}
        </p>
      ) : null}
    </header>
  );
}
