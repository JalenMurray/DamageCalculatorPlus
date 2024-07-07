export default function SideDrawer({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div className="drawer drawer-end">
      <input id={id} type="checkbox" className="drawer-toggle" />
      {children}
    </div>
  );
}
