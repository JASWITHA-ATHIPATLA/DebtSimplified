export const SEED = {
  user: null,
  users: [
    { id: 'u1', name: 'Rahul Sharma', email: 'rahul@demo.com', password: 'demo123', avatar: 'RS' },
    { id: 'u2', name: 'Sneha Patel', email: 'sneha@demo.com', password: 'demo123', avatar: 'SP' },
    { id: 'u3', name: 'Arjun Mehta', email: 'arjun@demo.com', password: 'demo123', avatar: 'AM' },
    { id: 'u4', name: 'Priya Singh', email: 'priya@demo.com', password: 'demo123', avatar: 'PS' },
  ],
  friends: ['u1', 'u2', 'u3'],
  groups: [
    { id: 'g1', name: 'Goa Trip', emoji: '🏖️', members: ['me', 'u1', 'u2', 'u3'], created: '2024-03-01' },
    { id: 'g2', name: 'Flat Mates', emoji: '🏠', members: ['me', 'u1', 'u4'], created: '2024-01-15' },
    { id: 'g3', name: 'Office Lunch', emoji: '🍱', members: ['me', 'u2', 'u3', 'u4'], created: '2024-04-01' },
  ],
  expenses: [
    { id: 'e1', groupId: 'g1', title: 'Hotel booking', amount: 12000, paidBy: 'u1', participants: ['me', 'u1', 'u2', 'u3'], splitType: 'equal', splits: {}, date: '2024-03-10', category: 'stay', note: '' },
    { id: 'e2', groupId: 'g1', title: 'Scuba diving', amount: 4800, paidBy: 'me', participants: ['me', 'u1', 'u2'], splitType: 'equal', splits: {}, date: '2024-03-11', category: 'activity', note: 'Amazing experience!' },
    { id: 'e3', groupId: 'g2', title: 'March rent', amount: 30000, paidBy: 'u1', participants: ['me', 'u1', 'u4'], splitType: 'equal', splits: {}, date: '2024-03-01', category: 'rent', note: '' },
    { id: 'e4', groupId: 'g2', title: 'Electricity bill', amount: 1500, paidBy: 'me', participants: ['me', 'u1', 'u4'], splitType: 'equal', splits: {}, date: '2024-03-20', category: 'utilities', note: '' },
    { id: 'e5', groupId: 'g3', title: 'Team lunch', amount: 2400, paidBy: 'u2', participants: ['me', 'u2', 'u3', 'u4'], splitType: 'equal', splits: {}, date: '2024-04-05', category: 'food', note: '' },
    { id: 'e6', groupId: 'g1', title: 'Cab to airport', amount: 900, paidBy: 'u3', participants: ['me', 'u1', 'u3'], splitType: 'exact', splits: { me: 200, u1: 400, u3: 300 }, date: '2024-03-12', category: 'transport', note: '' },
  ],
  settlements: [],
  activity: [
    { id: 'a1', type: 'expense', text: 'Rahul added Hotel booking ₹12,000 in Goa Trip', time: '2024-03-10', icon: '💸' },
    { id: 'a2', type: 'expense', text: 'You added Scuba diving ₹4,800 in Goa Trip', time: '2024-03-11', icon: '🤿' },
    { id: 'a3', type: 'group', text: 'You joined Flat Mates group', time: '2024-01-15', icon: '👥' },
    { id: 'a4', type: 'expense', text: 'Sneha added Team lunch ₹2,400 in Office Lunch', time: '2024-04-05', icon: '🍽️' },
  ],
  theme: 'light',
};

export function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'SIGNUP':
      return { ...state, users: [...state.users, action.payload], user: action.payload };
    case 'ADD_GROUP':
      return {
        ...state,
        groups: [...state.groups, action.payload],
        activity: [{ id: 'a' + Date.now(), type: 'group', text: `You created ${action.payload.name} group`, time: new Date().toISOString().slice(0, 10), icon: '👥' }, ...state.activity],
      };
    case 'EDIT_GROUP':
      return { ...state, groups: state.groups.map(g => (g.id === action.payload.id ? action.payload : g)) };
    case 'DELETE_GROUP':
      return { ...state, groups: state.groups.filter(g => g.id !== action.payload), expenses: state.expenses.filter(e => e.groupId !== action.payload) };
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
        activity: [{ id: 'a' + Date.now(), type: 'expense', text: `You added ${action.payload.title} ₹${action.payload.amount.toLocaleString('en-IN')}`, time: action.payload.date, icon: '💸' }, ...state.activity],
      };
    case 'DELETE_EXPENSE':
      return { ...state, expenses: state.expenses.filter(e => e.id !== action.payload) };
    case 'ADD_SETTLEMENT':
      return {
        ...state,
        settlements: [...state.settlements, action.payload],
        activity: [{ id: 'a' + Date.now(), type: 'settle', text: `You settled ₹${action.payload.amount.toLocaleString('en-IN')} with ${action.payload.toName}`, time: new Date().toISOString().slice(0, 10), icon: '✅' }, ...state.activity],
      };
    case 'ADD_FRIEND':
      return { ...state, friends: [...state.friends, action.payload] };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    default:
      return state;
  }
}