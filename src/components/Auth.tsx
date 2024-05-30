import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../supabaseClient';

const AuthComponent = () => {
  return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={[]} />;
};

export default AuthComponent;
