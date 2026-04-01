import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'wset-study-notes';

// A note is { id, text: "bullet1; bullet2; bullet3", done: false }
// text is split on "; " to render bullets

function NoteBullets({ text }) {
  return text.split(';').map((b) => b.trim()).filter(Boolean).map((b, i) => (
    <span key={i} className="note-bullet">• {b}</span>
  ));
}

function NoteItem({ note, onToggle, onDelete, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note.text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function save() {
    const trimmed = draft.trim();
    if (trimmed) onSave(note.id, trimmed);
    setEditing(false);
  }

  function cancel() {
    setDraft(note.text);
    setEditing(false);
  }

  return (
    <li className={`note-item ${note.done ? 'done' : ''}`}>
      <button className="note-check" onClick={() => onToggle(note.id)}>
        {note.done ? '✓' : '○'}
      </button>

      <div className="note-body" onClick={() => !editing && setEditing(true)}>
        {editing ? (
          <textarea
            ref={inputRef}
            className="note-edit-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); save(); }
              if (e.key === 'Escape') cancel();
            }}
            rows={Math.max(2, draft.split(';').length)}
            placeholder="Use ; to separate bullets"
          />
        ) : (
          <div className="note-bullets">
            <NoteBullets text={note.text} />
          </div>
        )}
      </div>

      <div className="note-actions">
        {editing ? (
          <>
            <button className="note-save" onClick={save}>Save</button>
            <button className="note-cancel" onClick={cancel}>✕</button>
          </>
        ) : (
          <button className="note-delete" onClick={() => onDelete(note.id)} title="Delete">✕</button>
        )}
      </div>
    </li>
  );
}

export default function StudyNotes() {
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  function add() {
    const text = input.trim();
    if (!text) return;
    setNotes((n) => [{ id: Date.now(), text, done: false }, ...n]);
    setInput('');
  }

  function toggle(id) {
    setNotes((n) => n.map((note) => note.id === id ? { ...note, done: !note.done } : note));
  }

  function remove(id) {
    setNotes((n) => n.filter((note) => note.id !== id));
  }

  function save(id, text) {
    setNotes((n) => n.map((note) => note.id === id ? { ...note, text } : note));
  }

  return (
    <div className="study-notes">
      <h2 className="notes-title">📝 Study Notes</h2>
      <p className="notes-hint">Use <strong>;</strong> to separate bullet points. Click any note to edit.</p>
      <div className="notes-input-row">
        <input
          className="notes-input"
          type="text"
          placeholder="e.g. Riesling; high acidity; Germany"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <button className="notes-add-btn" onClick={add}>Add</button>
      </div>
      {notes.length === 0 && (
        <p className="notes-empty">No notes yet. Add something to remember!</p>
      )}
      <ul className="notes-list">
        {notes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            onToggle={toggle}
            onDelete={remove}
            onSave={save}
          />
        ))}
      </ul>
    </div>
  );
}
