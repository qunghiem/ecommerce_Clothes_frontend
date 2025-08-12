import { useDispatch, useSelector } from 'react-redux';

// Typed hooks for better TypeScript support (optional)
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;