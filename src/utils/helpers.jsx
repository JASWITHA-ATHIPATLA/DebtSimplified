export function getName(state, id) {
  if (id === 'me') return state.user?.name || 'You';
  const u = state.users.find(u => u.id === id);
  return u ? u.name.split(' ')[0] : id;
}