import { redirect } from 'next/navigation';

export default function AnmeldenRedirect() {
  redirect('/login');
}
