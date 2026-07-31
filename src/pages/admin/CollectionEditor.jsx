import { useState } from 'react';
import { ChevronDown, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

const inputClass =
  'w-full bg-white border border-black/15 rounded-md px-3 py-2.5 text-sm text-black focus:outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30 transition disabled:opacity-50 disabled:bg-neutral-100';

const getVal = (item, key) => {
  const parts = key.split('.');
  return parts.reduce((acc, part) => (acc == null ? acc : acc[part]), item);
};

const setVal = (item, key, value) => {
  const parts = key.split('.');
  const last = parts.pop();
  const target = parts.reduce((acc, part) => {
    if (!acc[part] || typeof acc[part] !== 'object') acc[part] = {};
    return acc[part];
  }, item);
  target[last] = value;
};

const cloneItem = (item) => {
  const next = { ...item };
  Object.keys(next).forEach((k) => {
    if (Array.isArray(next[k])) next[k] = [...next[k]];
    else if (next[k] && typeof next[k] === 'object') next[k] = { ...next[k] };
  });
  return next;
};

const FieldInput = ({ field, item, onChange }) => {
  const get = field.get || ((it) => getVal(it, field.key));
  const set = field.set || ((it, value) => setVal(it, field.key, value));

  if (field.type === 'textarea') {
    return (
      <textarea
        className={`${inputClass} resize-y min-h-[90px]`}
        value={get(item) || ''}
        onChange={(e) => {
          const next = cloneItem(item);
          set(next, e.target.value);
          onChange(next);
        }}
      />
    );
  }

  return (
    <input
      type="text"
      className={inputClass}
      value={get(item) || ''}
      readOnly={field.readOnly}
      placeholder={field.placeholder || ''}
      onChange={(e) => {
        const next = cloneItem(item);
        set(next, e.target.value);
        onChange(next);
      }}
    />
  );
};

const CollectionEditor = ({ title, subtitle, items, onChange, fields, makeNew, itemLabel }) => {
  const [expanded, setExpanded] = useState(null);

  const updateItem = (index, next) => {
    onChange(items.map((item, i) => (i === index ? next : item)));
  };

  const addItem = () => {
    onChange([...items, makeNew()]);
    setExpanded(items.length);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const moveItem = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const labelOf = (item) => {
    if (typeof itemLabel === 'function') return itemLabel(item);
    const label = itemLabel ? item[itemLabel] : getVal(item, fields[0]?.key);
    return label || 'Untitled';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-bold text-lg leading-none">{title}</h3>
          {subtitle && <p className="text-xs text-black/45 mt-1">{subtitle}</p>}
        </div>
        <button
          onClick={addItem}
          className="shrink-0 inline-flex items-center gap-2 rounded-md bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] hover:bg-lime-500 hover:text-black transition-all duration-300"
        >
          <Plus size={14} /> Add
        </button>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-black/40 border border-dashed border-black/15 rounded-md px-4 py-6 text-center">
          No items yet — press Add to create one.
        </p>
      )}

      {items.map((item, index) => {
        const isOpen = expanded === index;
        return (
          <div key={index} className="border border-black/10 rounded-md bg-white shadow-sm">
            <div className="flex items-center gap-1 px-3 py-2.5">
              <button
                onClick={() => setExpanded(isOpen ? null : index)}
                className="flex-1 flex items-center gap-2 text-left min-w-0"
              >
                <ChevronDown size={16} className={`shrink-0 text-black/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                <span className="text-sm font-semibold truncate">{labelOf(item)}</span>
              </button>
              <button
                onClick={() => moveItem(index, -1)}
                aria-label="Move up"
                className="p-1.5 rounded text-black/40 hover:bg-black/5 hover:text-black transition"
              >
                <ArrowUp size={13} />
              </button>
              <button
                onClick={() => moveItem(index, 1)}
                aria-label="Move down"
                className="p-1.5 rounded text-black/40 hover:bg-black/5 hover:text-black transition"
              >
                <ArrowDown size={13} />
              </button>
              <button
                onClick={() => removeItem(index)}
                aria-label="Delete item"
                className="p-1.5 rounded text-red-500/70 hover:bg-red-50 hover:text-red-600 transition"
              >
                <Trash2 size={13} />
              </button>
            </div>

            {isOpen && (
              <div className="grid sm:grid-cols-2 gap-4 px-4 pb-4 pt-4 border-t border-black/5">
                {fields.map((field) => (
                  <label
                    key={field.key}
                    className={`flex flex-col gap-1.5 ${field.type === 'textarea' || field.full ? 'sm:col-span-2' : ''}`}
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/45">{field.label}</span>
                    <FieldInput field={field} item={item} onChange={(next) => updateItem(index, next)} />
                    {field.hint && <span className="text-[10px] text-black/35">{field.hint}</span>}
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CollectionEditor;
