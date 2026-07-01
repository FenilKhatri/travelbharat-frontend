import { FiPlus, FiTrash2, FiMenu } from "react-icons/fi";
import { useState } from "react";

const ArrayEditor = ({ 
  items = [], 
  onAdd, 
  onRemove, 
  onReorder, 
  addLabel = "Add Item", 
  emptyText = "No items added yet.",
  renderItem,
  maxItems = null
}) => {
  const [draggedIdx, setDraggedIdx] = useState(null);

  const handleDragStart = (e, idx) => {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = "move";
    // Slight delay to allow UI to update before drag image is captured
    setTimeout(() => {
      e.target.style.opacity = "0.5";
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    setDraggedIdx(null);
  };

  const handleDragOver = (e, idx) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;

    const newItems = [...items];
    const draggedItem = newItems[draggedIdx];
    newItems.splice(draggedIdx, 1);
    newItems.splice(idx, 0, draggedItem);
    
    // Update order fields if present
    const updatedItems = newItems.map((item, i) => ({ ...item, order: i }));
    onReorder(updatedItems);
    setDraggedIdx(idx);
  };

  const isAtMax = maxItems !== null && items.length >= maxItems;

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-sm rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
          {emptyText}
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div 
              key={item._id || idx}
              draggable={!!onReorder}
              onDragStart={(e) => onReorder && handleDragStart(e, idx)}
              onDragEnd={onReorder ? handleDragEnd : undefined}
              onDragOver={(e) => onReorder && handleDragOver(e, idx)}
              className="group relative flex gap-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 transition-all"
            >
              {onReorder && (
                <div className="flex flex-col items-center justify-start pt-2 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500">
                  <FiMenu size={16} />
                </div>
              )}
              
              <div className="flex-1">
                {renderItem(item, idx, (key, val) => {
                  const newItems = [...items];
                  newItems[idx] = { ...newItems[idx], [key]: val };
                  onReorder(newItems); // Abuse onReorder as general onChange
                })}
              </div>

              {onRemove && (
                <div className="flex flex-col justify-start">
                  <button
                    type="button"
                    onClick={() => onRemove(idx)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {onAdd && !isAtMax && (
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1.5 text-sm font-bold text-[#E85D04] hover:text-[#C04D02] px-4 py-2 rounded-lg hover:bg-[#E85D04]/10 transition-colors w-fit border border-transparent hover:border-[#E85D04]/20"
        >
          <FiPlus size={16} /> {addLabel}
        </button>
      )}
    </div>
  );
};

export default ArrayEditor;
