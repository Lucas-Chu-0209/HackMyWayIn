/**
 * PageHeader — reusable rectangular cover banner for top-level pages.
 *
 * Height: ~200px. To adjust height, change the `h-[200px]` class below.
 *
 * Gradient/colors: the gradient is defined in the `background` inline style.
 * To swap to an image later, replace the `background` style with a
 * `background-image: url(...)` and keep the overlay `<div>` for readability.
 *
 * Overlay: a semi-transparent dark overlay sits on top of the gradient so that
 * white text is always readable ("反白"). In light mode the gradient is
 * brightened slightly and the overlay is a touch lighter — text stays white and
 * clearly legible in both modes without dramatic difference.
 */
export interface PageHeaderProps {
  /** The page title displayed centered inside the header. */
  title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
  return (
    /**
     * Outer wrapper.
     * • `h-[200px]` — adjust this value to change the header height.
     * • `relative` + `overflow-hidden` — contains the overlay and keeps
     *   things from spilling out if you later add a background image.
     */
    <div
      className="relative h-[200px] overflow-hidden"
      style={{
        /**
         * Gradient colors.
         * Light mode: slightly brighter slate tones (see the `html:not(.dark)`
         *   rule in globals.css – we handle it inline here via CSS variables
         *   is too complex, so we use a single gradient that reads well in
         *   both modes; light-mode brightness tweak is handled by the overlay).
         *
         * To replace with an image:
         *   background: "url('/your-image.jpg') center/cover no-repeat"
         */
        background:
          "linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e3a5f 100%)",
      }}
    >
      {/* ─── Overlay ──────────────────────────────────────────────────────────
          Light mode : bg-black/20 — slightly lighter; gradient already reads
                       well in a bright UI, keeps the look consistent without
                       being too heavy.
          Dark mode  : bg-black/35 — moderate darkening for extra contrast.

          To adjust overlay strength, change the opacity values:
            light  →  `bg-black/20`  (increase for more darkening in light mode)
            dark   →  `dark:bg-black/35`  (increase for more darkening in dark mode)
      ──────────────────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-black/20 dark:bg-black/35" />

      {/* ─── Centered title ──────────────────────────────────────────────── */}
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-md sm:text-4xl">
          {title}
        </h1>
      </div>
    </div>
  );
}
