export function WorldBackground({ paused }: { paused: boolean }) {
  return (
    <div className="menu-world" data-paused={paused ? "true" : "false"} aria-hidden="true">
      <div className="menu-sky" />
      <div className="menu-sun" />
      <div className="menu-cloud menu-cloud-one" />
      <div className="menu-cloud menu-cloud-two" />
      <div className="menu-mountain menu-mountain-far" />
      <div className="menu-mountain menu-mountain-near" />
      <div className="menu-terrain menu-terrain-back" />
      <div className="menu-terrain menu-terrain-front" />
      <div className="menu-fog menu-fog-one" />
      <div className="menu-fog menu-fog-two" />
      <div className="menu-particles">
        {Array.from({ length: 10 }, (_, index) => <i key={index} />)}
      </div>
      <div className="menu-world-vignette" />
    </div>
  );
}
