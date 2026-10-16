import { useReducer } from 'react';
import { CONVERSATIONS, GROUPS } from '../data.js';

let msgSeq = 0;
const withIds = (messages, convo) => messages.map(m => ({ ...m, id: `${convo}-${msgSeq++}` }));

function init() {
  const convos = {};
  CONVERSATIONS.forEach(c => {
    convos[c.id] = { ...c, done: false, messages: withIds(c.messages, c.id) };
  });
  return {
    convos,
    order: CONVERSATIONS.map(c => c.id),
    selected: 'marcus',
    collapsed: {},
    lastDone: null,
  };
}

/** Conversations J/K can reach: not done, and not inside a collapsed section. */
export function navigable(state) {
  return GROUPS.flatMap(g =>
    state.collapsed[g.id] ? [] : state.order.filter(id => state.convos[id].group === g.id && !state.convos[id].done)
  );
}

export function openIds(state) {
  return GROUPS.flatMap(g => state.order.filter(id => state.convos[id].group === g.id && !state.convos[id].done));
}

function patch(state, id, changes) {
  return { ...state, convos: { ...state.convos, [id]: { ...state.convos[id], ...changes } } };
}

function reducer(state, action) {
  switch (action.type) {
    case 'select': {
      const c = state.convos[action.id];
      if (!c) return state;
      const next = patch(state, action.id, { unread: 0, done: false });
      return { ...next, selected: action.id, collapsed: { ...state.collapsed, [c.group]: false } };
    }
    case 'move': {
      const list = navigable(state);
      if (!list.length) return state;
      const i = list.indexOf(state.selected);
      const j = i === -1 ? 0 : Math.min(list.length - 1, Math.max(0, i + action.dir));
      return reducer(state, { type: 'select', id: list[j] });
    }
    case 'done': {
      const id = action.id;
      if (!id || state.convos[id]?.done) return state;
      const list = openIds(state);
      const i = list.indexOf(id);
      const rest = list.filter(x => x !== id);
      const nextSel = state.selected === id ? rest[Math.min(i, rest.length - 1)] ?? null : state.selected;
      let next = patch(state, id, { done: true, unread: 0 });
      next = { ...next, lastDone: { id, prevSelected: state.selected } };
      if (nextSel && nextSel !== state.selected) {
        next = { ...patch(next, nextSel, { unread: 0 }), selected: nextSel };
      } else if (!nextSel) {
        next = { ...next, selected: null };
      }
      return next;
    }
    case 'undo': {
      const ld = state.lastDone;
      if (!ld) return state;
      const next = patch(state, ld.id, { done: false });
      return { ...next, selected: ld.id, lastDone: null };
    }
    case 'restoreAll': {
      const convos = {};
      Object.values(state.convos).forEach(c => (convos[c.id] = { ...c, done: false }));
      return { ...state, convos, selected: state.order[0], lastDone: null };
    }
    case 'toggle':
      return { ...state, collapsed: { ...state.collapsed, [action.group]: !state.collapsed[action.group] } };
    case 'incoming': {
      const c = state.convos[action.id];
      if (!c) return state;
      const msg = { from: c.person, at: 'Just now', body: action.body, id: action.msgId, fresh: true };
      const isOpen = state.selected === action.id;
      const next = patch(state, action.id, {
        messages: [...c.messages, msg],
        unread: isOpen ? 0 : c.unread + 1,
        done: false,
      });
      return next.selected ? next : { ...next, selected: action.id };
    }
    case 'send': {
      const c = state.convos[action.id];
      if (!c) return state;
      const msg = { from: 'you', at: 'Just now', body: action.body, id: action.msgId, fresh: true, demo: true };
      return patch(state, action.id, { messages: [...c.messages, msg] });
    }
    default:
      return state;
  }
}

export function useInbox() {
  return useReducer(reducer, undefined, init);
}
