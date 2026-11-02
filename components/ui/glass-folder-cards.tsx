"use client";

/**
 * GlassFolder: an achievement archive folder you can actually open, adapted
 * from the Glass Folder Cards concept (21st.dev). Three layers, back to front:
 * a back panel holding a cover photo, the files the folder contains, and a
 * frosted-glass front panel. Hover leans the panel toward you and lifts the
 * files; activating the panel fans the files out; each file opens in a viewer,
 * and a file whose evidence is not published yet renders locked.
 *
 * Self-contained apart from the shared Dialog and LocalizedText components.
 */

import * as React from "react";
import { Dialog } from "@/components/ui/Dialog";
import { LocalizedText } from "@/components/ui/LocalizedText";
import styles from "./glass-folder-cards.module.css";

export type LocalText = { en: string; id: string };

export type FolderFile = {
  name: LocalText;
  /** A short second line: a kind, a team, a place. */
  meta?: LocalText;
  /** Thumbnail and full-view image. Without one, the file is a plain sheet. */
  image?: string;
  /** When set, the file renders locked and shows this note instead of an image. */
  lockedNote?: LocalText;
};

export type GlassFolderProps = {
  label: LocalText;
  /** The second line on the front panel. */
  meta?: LocalText;
  /** Chip on the front panel, e.g. an award status. */
  status?: LocalText;
  /** `light` is milk glass, `dark` is smoked glass. */
  tone?: "light" | "dark";
  /** Your own picture for the back panel. */
  cover?: string;
  files: FolderFile[];
  defaultOpen?: boolean;
  /** Assemble itself the first time it scrolls into view. */
  appear?: boolean;
  /** Delay before that entrance, in ms, for staggering a row of folders. */
  appearDelay?: number;
  className?: string;
};

/** Where a file sits in the fan: -1 to 1 across the visible stack, 0 for one file. */
export function fanSlot(index: number, count: number): number {
  return count <= 1 ? 0 : (index / (count - 1)) * 2 - 1;
}

export function GlassFolder({
  label,
  meta,
  status,
  tone = "light",
  cover,
  files,
  defaultOpen = false,
  appear = true,
  appearDelay = 0,
  className,
}: GlassFolderProps) {
  const uid = React.useId().replace(/:/g, "");
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(defaultOpen);
  const [inView, setInView] = React.useState(!appear);
  const [viewer, setViewer] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!appear || !stageRef.current) return;
    const el = stageRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [appear]);

  const imageIndexes = files.map((f, i) => (f.image ? i : -1)).filter((i) => i >= 0);
  const lockedCount = files.filter((f) => f.lockedNote).length;

  const stepViewer = (dir: 1 | -1) => {
    if (viewer === null) return;
    const pos = imageIndexes.indexOf(viewer);
    if (pos < 0) return;
    setViewer(imageIndexes[(pos + dir + imageIndexes.length) % imageIndexes.length]);
  };

  const viewerFile = viewer !== null ? files[viewer] : null;

  return (
    <div className={`${styles.wrap} ${className ?? ""}`}>
      <div
        ref={stageRef}
        className={`${styles.stage} ${tone === "dark" ? styles.toneDark : styles.toneLight} ${open ? styles.open : ""} ${inView ? styles.inview : ""}`}
        style={{ transitionDelay: `${appearDelay}ms` }}
      >
        <div className={styles.back} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element -- static export with images.unoptimized; next/image adds no benefit */}
          {cover ? <img src={cover} alt="" loading="lazy" /> : null}
        </div>

        <div className={styles.files}>
          {files.map((file, i) => {
            const slot = fanSlot(i, files.length);
            const style = {
              "--slot": slot,
              "--tilt": `${slot * 2}deg`,
              zIndex: file.lockedNote ? 0 : i + 1,
            } as React.CSSProperties;
            if (file.lockedNote) {
              return (
                <button
                  key={i}
                  type="button"
                  className={`${styles.file} ${styles.locked}`}
                  style={style}
                  onClick={() => setViewer(i)}
                  aria-label={file.name.en}
                >
                  <span className={styles.lockFace}>
                    <LocalizedText en="LOCKED" id="TERKUNCI" />
                  </span>
                  <span className={styles.fileName}><LocalizedText en={file.name.en} id={file.name.id} /></span>
                  {file.meta ? <span className={styles.fileMeta}><LocalizedText en={file.meta.en} id={file.meta.id} /></span> : null}
                </button>
              );
            }
            return (
              <button
                key={i}
                type="button"
                className={styles.file}
                style={style}
                onClick={() => setViewer(i)}
                aria-label={file.name.en}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- static export with images.unoptimized; next/image adds no benefit */}
                {file.image ? <img src={file.image} alt="" loading="lazy" /> : null}
                <span className={styles.fileName}><LocalizedText en={file.name.en} id={file.name.id} /></span>
                {file.meta ? <span className={styles.fileMeta}><LocalizedText en={file.meta.en} id={file.meta.id} /></span> : null}
              </button>
            );
          })}
        </div>

        <div
          className={styles.front}
          role="button"
          tabIndex={0}
          aria-expanded={open}
          aria-label={label.en}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen((v) => !v);
            }
          }}
        >
          {status ? (
            <span className={styles.status}><LocalizedText en={status.en} id={status.id} /></span>
          ) : null}
          <span className={styles.count}>
            <LocalizedText
              en={`${files.length - lockedCount} files${lockedCount ? ` + ${lockedCount} pending` : ""}`}
              id={`${files.length - lockedCount} berkas${lockedCount ? ` + ${lockedCount} pending` : ""}`}
            />
          </span>
        </div>
      </div>
<div className={styles.caption}>
    <p className={styles.captionLabel}><LocalizedText en={label.en} id={label.id} /></p>
  {meta ? <p className={styles.captionMeta}><LocalizedText en={meta.en} id={meta.id} /></p> : null}
</div>

      <Dialog open={viewer !== null} onClose={() => setViewer(null)} labelledBy={`${uid}-viewer-title`}>
        {viewerFile ? (
          <div className={styles.viewer}>
            <h3 id={`${uid}-viewer-title`} className={styles.viewerTitle}>
              <LocalizedText en={viewerFile.name.en} id={viewerFile.name.id} />
            </h3>
            {viewerFile.lockedNote ? (
              <p className={styles.viewerNote}>
                <LocalizedText en={viewerFile.lockedNote.en} id={viewerFile.lockedNote.id} />
              </p>
            ) : viewerFile.image ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element -- static export with images.unoptimized; next/image adds no benefit */}
                <img className={styles.viewerImg} src={viewerFile.image} alt={viewerFile.name.en} />
                {viewerFile.meta ? (
                  <p className={styles.viewerNote}>
                    <LocalizedText en={viewerFile.meta.en} id={viewerFile.meta.id} />
                  </p>
                ) : null}
                {imageIndexes.length > 1 ? (
                  <div className={styles.viewerNav}>
                    <button type="button" onClick={() => stepViewer(-1)}>
                      <LocalizedText en="← Previous" id="← Sebelumnya" />
                    </button>
                    <button type="button" onClick={() => stepViewer(1)}>
                      <LocalizedText en="Next →" id="Berikutnya →" />
                    </button>
                  </div>
                ) : null}
              </>
            ) : null}
            <button type="button" className={styles.viewerClose} onClick={() => setViewer(null)} data-autofocus>
              <LocalizedText en="Close" id="Tutup" />
            </button>
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}
