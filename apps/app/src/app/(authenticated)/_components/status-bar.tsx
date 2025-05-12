export function StatusBar() {
  return (
    <div className="p-2 text-sm flex justify-between items-center">
      <div>9:41</div>
      <div className="flex items-center gap-1">
        <div className="h-3 w-3">•••</div>
        <div className="h-3 w-3">📶</div>
        <div className="h-3 w-3">🔋</div>
      </div>
    </div>
  );
}
