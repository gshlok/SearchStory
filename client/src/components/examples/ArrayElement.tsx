import ArrayElement from '../ArrayElement';

export default function ArrayElementExample() {
  return (
    <div className="flex gap-4 p-8 bg-background">
      <ArrayElement value={12} index={0} />
      <ArrayElement value={25} index={1} isActive />
      <ArrayElement value={37} index={2} isTarget />
      <ArrayElement value={48} index={3} isEliminated />
    </div>
  );
}
