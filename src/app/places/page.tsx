import { redirect } from 'next/navigation';

export default function PlacesPage() {
  // Redirect to search page with place type filter
  redirect('/search');
} 