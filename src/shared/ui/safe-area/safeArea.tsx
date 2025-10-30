function TopSafeArea() {
  return (
    <div
      style={{ backgroundColor: "red", height: "env(safe-area-inset-top)" }}
    ></div>
  );
}

function BottomSafeArea() {
  return <div style={{ height: "env(safe-area-inset-bottom)" }}></div>;
}

function LeftSafeArea() {
  return <div style={{ width: "env(safe-area-inset-left)" }}></div>;
}

function RightSafeArea() {
  return <div style={{ width: "env(safe-area-inset-right)" }}></div>;
}

export function SafeArea({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <TopSafeArea />
      <div className="flex-1 flex">
        <LeftSafeArea />
        {children}
        <RightSafeArea />
      </div>
      <BottomSafeArea />
    </div>
  );
}

